// backend/__tests__/users.test.js

const request = require('supertest');
const app = require('../app');
const { ObjectId } = require('mongodb');

// Mock the DB connection module
jest.mock('../db/connection.cjs', () => ({
  connectToDatabase: jest.fn(),
  closeDatabaseConnection: jest.fn(),
}));
// Mock nodemailer
jest.mock('nodemailer', () => ({
  createTransport: () => ({
    sendMail: (opts, cb) => cb(null, { response: 'OK' }),
  }),
}));

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { connectToDatabase } = require('../db/connection.cjs');

describe('Users Routes', () => {
  let mockDb;

  beforeEach(() => {
    mockDb = { collection: jest.fn() };
    connectToDatabase.mockResolvedValue(mockDb);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /users', () => {
    it('returns 200 and an array', async () => {
      const fakeUsers = [{ _id: new ObjectId().toHexString(), name: 'Alice' }];
      mockDb.collection.mockReturnValue({ find: () => ({ toArray: () => Promise.resolve(fakeUsers) }) });
      const res = await request(app).get('/users');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(fakeUsers);
    });

    it('returns 500 on DB error', async () => {
      mockDb.collection.mockImplementation(() => { throw new Error('fail'); });
      const res = await request(app).get('/users');
      expect(res.status).toBe(500);
    });
  });

  describe('GET /users/:id', () => {
    it('returns 200 when found', async () => {
      const id = new ObjectId();
      mockDb.collection.mockReturnValue({ findOne: () => Promise.resolve({ _id: id, name: 'Bob' }) });
      const res = await request(app).get(`/users/${id.toHexString()}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ _id: id.toHexString(), name: 'Bob' });
    });

    it('returns 404 when missing', async () => {
      mockDb.collection.mockReturnValue({ findOne: () => Promise.resolve(null) });
      const res = await request(app).get(`/users/${new ObjectId().toHexString()}`);
      expect(res.status).toBe(404);
    });

    it('returns 500 on DB error', async () => {
      mockDb.collection.mockReturnValue({ findOne: () => { throw new Error(); } });
      const res = await request(app).get(`/users/${new ObjectId().toHexString()}`);
      expect(res.status).toBe(500);
    });
  });

  describe('POST /users', () => {
    it('creates user 201', async () => {
      const user = { name: 'Carol', email: 'c@e', password: 'pw' };
      mockDb.collection.mockReturnValue({ insertOne: doc => Promise.resolve({ insertedId: new ObjectId(), ...doc }) });
      const res = await request(app).post('/users').send(user);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('insertedId');
    });

    it('returns 500 on DB error', async () => {
      mockDb.collection.mockReturnValue({ insertOne: () => { throw new Error(); } });
      const res = await request(app).post('/users').send({});
      expect(res.status).toBe(500);
    });
  });

  describe('POST /users/auth-session', () => {
    it('200 for valid token', async () => {
      const payload = { foo: 'bar' };
      jest.spyOn(jwt, 'verify').mockImplementation((t, s, cb) => cb(null, payload));
      const res = await request(app).post('/users/auth-session').send({ token: 'tok' });
      expect(res.status).toBe(200);
      expect(res.body).toEqual(payload);
    });

    it('401 for invalid token', async () => {
      jest.spyOn(jwt, 'verify').mockImplementation((t, s, cb) => cb(new Error(), null));
      const res = await request(app).post('/users/auth-session').send({ token: 'bad' });
      expect(res.status).toBe(401);
    });

    it('500 on verify throw', async () => {
      jest.spyOn(jwt, 'verify').mockImplementation(() => { throw new Error(); });
      const res = await request(app).post('/users/auth-session').send({ token: 'x' });
      expect(res.status).toBe(500);
    });
  });

  describe('POST /users/login', () => {
    it('200 and token', async () => {
      const pw = 'pw'; const hash = await bcrypt.hash(pw,10);
      mockDb.collection.mockReturnValue({ findOne: () => Promise.resolve({ _id: new ObjectId(), email: 'e', name: 'n', password: hash }) });
      jest.spyOn(jwt, 'sign').mockReturnValue('t');
      const res = await request(app).post('/users/login').send({ email:'e', password: pw });
      expect(res.status).toBe(200);
      expect(res.body.token).toBe('t');
    });
    it('404 no user', async () => {
      mockDb.collection.mockReturnValue({ findOne: () => Promise.resolve(null) });
      const res = await request(app).post('/users/login').send({});
      expect(res.status).toBe(404);
    });
    it('401 bad pass', async () => {
      const hash = await bcrypt.hash('right',10);
      mockDb.collection.mockReturnValue({ findOne: () => Promise.resolve({ password: hash }) });
      const res = await request(app).post('/users/login').send({ email:'e', password: 'wrong' });
      expect(res.status).toBe(401);
    });
    it('500 on DB error', async () => {
      mockDb.collection.mockReturnValue({ findOne: () => { throw new Error(); } });
      const res = await request(app).post('/users/login').send({});
      expect(res.status).toBe(500);
    });
  });

  describe('PATCH /users/:id', () => {
    it('updates provided', async () => {
      const id = new ObjectId();
      mockDb.collection.mockReturnValue({ updateOne: () => Promise.resolve({ matchedCount:1, modifiedCount:1 }) });
      const res = await request(app).patch(`/users/${id.toHexString()}`).send({ name: 'X' });
      expect(res.status).toBe(200);
    });
    it('re-hashes password', async () => {
      const id = new ObjectId();
      mockDb.collection.mockReturnValue({ updateOne: (_,upd) => { expect(typeof upd.$set.password).toBe('string'); return Promise.resolve({}); } });
      const res = await request(app).patch(`/users/${id.toHexString()}`).send({ password:'np' });
      expect(res.status).toBe(200);
    });
    it('updates email and profilePic', async () => {
      const id = new ObjectId();
      mockDb.collection.mockReturnValue({ updateOne: (_,upd) => { expect(upd.$set.email).toBe('e@test'); expect(upd.$set.profilePic).toBe('pic.png'); return Promise.resolve({}); } });
      const res = await request(app).patch(`/users/${id.toHexString()}`).send({ email:'e@test', profilePic:'pic.png' });
      expect(res.status).toBe(200);
    });
    it('500 on update error', async () => {
      mockDb.collection.mockReturnValue({ updateOne: () => { throw new Error(); } });
      const res = await request(app).patch(`/users/${new ObjectId().toHexString()}`).send({});
      expect(res.status).toBe(500);
    });
  });

  describe('POST /users/validate-token', () => {
    it('200 valid', async () => {
      mockDb.collection.mockReturnValue({ findOne: () => Promise.resolve({ token:'t', expireDate: Date.now()+1 }) });
      const res = await request(app).post('/users/validate-token').send({ email:'e', token:'t' });
      expect(res.status).toBe(200);
    });
    it('400 invalid', async () => {
      mockDb.collection.mockReturnValue({ findOne: () => Promise.resolve({ token:'x', expireDate:0 }) });
      const res = await request(app).post('/users/validate-token').send({ email:'e', token:'t' });
      expect(res.status).toBe(400);
    });
    it('500 on error', async () => {
      mockDb.collection.mockReturnValue({ findOne: () => { throw new Error(); } });
      const res = await request(app).post('/users/validate-token').send({});
      expect(res.status).toBe(500);
    });
  });

  describe('PATCH /users/send-email/:email', () => {
    it('200 success', async () => {
      mockDb.collection.mockReturnValue({ findOneAndUpdate: () => Promise.resolve({}) });
      const res = await request(app).patch('/users/send-email/foo');
      expect(res.status).toBe(200);
    });
    it('logs mail error but still 200', async () => {
      // override nodemailer for error
      const nodemailer = require('nodemailer');
      nodemailer.createTransport = jest.fn().mockReturnValue({ sendMail: (opts, cb) => cb(new Error('oops'), null) });
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockDb.collection.mockReturnValue({ findOneAndUpdate: () => Promise.resolve({}) });
      const res = await request(app).patch('/users/send-email/foo');
      expect(res.status).toBe(200);
      expect(spy).toHaveBeenCalledWith('Mail error:', expect.any(Error));
      spy.mockRestore();
    });
    it('500 on DB error', async () => {
      mockDb.collection.mockReturnValue({ findOneAndUpdate: () => { throw new Error(); } });
      const res = await request(app).patch('/users/send-email/foo');
      expect(res.status).toBe(500);
    });
  });

  describe('DELETE /users/:id', () => {
    it('200 delete', async () => {
      const id = new ObjectId();
      mockDb.collection.mockReturnValue({ deleteOne: () => Promise.resolve({ deletedCount:1 }) });
      const res = await request(app).delete(`/users/${id.toHexString()}`);
      expect(res.status).toBe(200);
    });
    it('500 on error', async () => {
      mockDb.collection.mockReturnValue({ deleteOne: () => { throw new Error(); } });
      const res = await request(app).delete(`/users/${new ObjectId().toHexString()}`);
      expect(res.status).toBe(500);
    });
  });

  describe('GET /users/getUserByEmail/:email', () => {
    it('200 found', async () => {
      const id = new ObjectId();
      mockDb.collection.mockReturnValue({ findOne: () => Promise.resolve({ _id:id, name:'N', email:'e', profilePic:'p' }) });
      const res = await request(app).get('/users/getUserByEmail/e');
      expect(res.status).toBe(200);
    });
    it('404 missing', async () => {
      mockDb.collection.mockReturnValue({ findOne: () => Promise.resolve(null) });
      const res = await request(app).get('/users/getUserByEmail/x');
      expect(res.status).toBe(404);
    });
    it('500 on error', async () => {
      mockDb.collection.mockReturnValue({ findOne: () => { throw new Error(); } });
      const res = await request(app).get('/users/getUserByEmail/x');
      expect(res.status).toBe(500);
    });
  });
});