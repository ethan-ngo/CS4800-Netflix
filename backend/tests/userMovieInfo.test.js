// backend/__tests__/userMovieInfo.test.js

const request = require('supertest');
const app = require('../app');
const { ObjectId } = require('mongodb');

// Mock the DB connection module
jest.mock('../db/connection.cjs', () => ({
  connectToDatabase: jest.fn(),
  closeDatabaseConnection: jest.fn(),
}));

describe('userMovieInfo Routes', () => {
  let connectToDatabase;
  let mockDb;

  beforeAll(() => {
    connectToDatabase = require('../db/connection.cjs').connectToDatabase;
  });

  beforeEach(() => {
    mockDb = { collection: jest.fn() };
    connectToDatabase.mockResolvedValue(mockDb);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /userMovieInfo', () => {
    it('should return 200 and an array of docs', async () => {
      const docs = [{ _id: new ObjectId(), userID: 'u1', movieID: 'm1', userMovieRating: 5 }];
      mockDb.collection.mockReturnValue({
        find: () => ({ toArray: () => Promise.resolve(docs) }),
      });
      const res = await request(app).get('/userMovieInfo');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(docs.map(d => ({ ...d, _id: d._id.toHexString() }))); 
      expect(mockDb.collection).toHaveBeenCalledWith('userMovieInfo');
    });

    it('should return 500 on DB error', async () => {
      mockDb.collection.mockImplementation(() => { throw new Error(); });
      const res = await request(app).get('/userMovieInfo');
      expect(res.status).toBe(500);
      expect(res.text).toBe('Internal Server Error');
    });
  });

  describe('GET /userMovieInfo/ratings/:movieID', () => {
    it('should return totalRating and results', async () => {
      const entries = [
        { movieID: 'm1', userMovieRating: 3 },
        { movieID: 'm1', userMovieRating: 2 },
        { movieID: 'm1', userMovieRating: 0 }
      ];
      mockDb.collection.mockReturnValue({
        find: () => ({ toArray: () => Promise.resolve(entries) }),
      });
      const res = await request(app).get('/userMovieInfo/ratings/m1');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ totalRating: 5, result: entries });
    });

    it('should return 500 on DB error', async () => {
      mockDb.collection.mockImplementation(() => ({
        find: () => { throw new Error(); }
      }));
      const res = await request(app).get('/userMovieInfo/ratings/m1');
      expect(res.status).toBe(500);
      expect(res.text).toBe('Internal Server Error');
    });
  });

  describe('GET /userMovieInfo/user/:userID', () => {
    it('should return entries for given userID', async () => {
      const docs = [{ _id: new ObjectId(), userID: 'u1' }];
      mockDb.collection.mockReturnValue({
        find: () => ({ toArray: () => Promise.resolve(docs) }),
      });
      const res = await request(app).get('/userMovieInfo/user/u1');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(docs.map(d => ({ ...d, _id: d._id.toHexString() }))); 
    });

    it('should return 500 on DB error', async () => {
      mockDb.collection.mockImplementation(() => ({
        find: () => { throw new Error(); }
      }));
      const res = await request(app).get('/userMovieInfo/user/u1');
      expect(res.status).toBe(500);
      expect(res.text).toBe('Internal Server Error');
    });
  });

  describe('GET /userMovieInfo/:userID/:movieID', () => {
    it('should return single entry when found', async () => {
      const doc = { _id: new ObjectId(), userID: 'u1', movieID: 'm1' };
      mockDb.collection.mockReturnValue({
        findOne: () => Promise.resolve(doc),
      });
      const res = await request(app).get('/userMovieInfo/u1/m1');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ ...doc, _id: doc._id.toHexString() });
    });

    it('should return 404 when not found', async () => {
      mockDb.collection.mockReturnValue({ findOne: () => Promise.resolve(null) });
      const res = await request(app).get('/userMovieInfo/u1/m1');
      expect(res.status).toBe(404);
      expect(res.text).toBe('Not found');
    });

    it('should return 500 on DB error', async () => {
      mockDb.collection.mockReturnValue({ findOne: () => { throw new Error(); } });
      const res = await request(app).get('/userMovieInfo/u1/m1');
      expect(res.status).toBe(500);
      expect(res.text).toBe('Internal Server Error');
    });
  });

  describe('POST /userMovieInfo', () => {
    it('should create a new entry and return 201', async () => {
      const newDoc = { userID: 'u1', movieID: 'm1', numWatched: 1, timeStamp: 123, userMovieRating: 4 };
      mockDb.collection.mockReturnValue({
        insertOne: (doc) => Promise.resolve({ insertedId: new ObjectId(), ...doc }),
      });
      const res = await request(app).post('/userMovieInfo').send(newDoc);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('insertedId');
      expect(res.body.userID).toBe(newDoc.userID);
    });

    it('should return 500 on DB error', async () => {
      mockDb.collection.mockImplementation(() => ({
        insertOne: () => { throw new Error(); }
      }));
      const res = await request(app).post('/userMovieInfo').send({});
      expect(res.status).toBe(500);
      expect(res.text).toBe('Internal Server Error');
    });
  });

  describe('PATCH /userMovieInfo/:id', () => {
    it('should update entry and return 200', async () => {
      const id = new ObjectId();
      mockDb.collection.mockReturnValue({
        updateOne: () => Promise.resolve({ matchedCount: 1, modifiedCount: 1 }),
      });
      const res = await request(app)
        .patch(`/userMovieInfo/${id.toHexString()}`)
        .send({ userMovieRating: 5 });
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ matchedCount: 1, modifiedCount: 1 });
    });

    it('should return 500 on DB error', async () => {
      mockDb.collection.mockReturnValue({ updateOne: () => { throw new Error(); } });
      const res = await request(app).patch(`/userMovieInfo/${new ObjectId().toHexString()}`).send({});
      expect(res.status).toBe(500);
      expect(res.text).toBe('Internal Server Error');
    });
  });

  describe('DELETE /userMovieInfo/:id', () => {
    it('should delete entry and return result', async () => {
      const id = new ObjectId();
      mockDb.collection.mockReturnValue({ deleteOne: () => Promise.resolve({ deletedCount: 1 }) });
      const res = await request(app).delete(`/userMovieInfo/${id.toHexString()}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ deletedCount: 1 });
    });

    it('should return 500 on DB error', async () => {
      mockDb.collection.mockReturnValue({ deleteOne: () => { throw new Error(); } });
      const res = await request(app).delete(`/userMovieInfo/${new ObjectId().toHexString()}`);
      expect(res.status).toBe(500);
      expect(res.text).toBe('Internal Server Error');
    });
  });
});
