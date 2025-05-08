// backend/__tests__/userShowInfo.test.js

const request = require('supertest');
const app = require('../app');
const { ObjectId } = require('mongodb');

// Mock the DB connection module
jest.mock('../db/connection.cjs', () => ({
  connectToDatabase: jest.fn(),
  closeDatabaseConnection: jest.fn(),
}));
const { connectToDatabase } = require('../db/connection.cjs');

describe('userShowInfo Routes', () => {
  let mockDb;

  beforeEach(() => {
    // Prepare a fresh mock database for each test
    mockDb = { collection: jest.fn() };
    connectToDatabase.mockResolvedValue(mockDb);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /userShowInfo', () => {
    it('should return 200 and all documents', async () => {
      const docs = [
        {
          _id: new ObjectId(),
          userID: '67da15550b51479308f72a7b',
          showID: '3605a5d1c8b589c84ba97a98aad14750',
          numWatched: 0,
          timeStamp: 0,
          isBookmarked: true,
          userShowRating: 2,
        },
      ];
      mockDb.collection.mockReturnValue({
        find: () => ({ toArray: () => Promise.resolve(docs) }),
      });

      const res = await request(app).get('/userShowInfo');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(
        docs.map(d => ({ ...d, _id: d._id.toHexString() }))
      );
      expect(mockDb.collection).toHaveBeenCalledWith('userShowInfo');
    });

    it('should return 500 on DB error', async () => {
      mockDb.collection.mockImplementation(() => { throw new Error('fail'); });
      const res = await request(app).get('/userShowInfo');
      expect(res.status).toBe(500);
      expect(res.text).toBe('Internal Server Error');
    });
  });

  describe('GET /userShowInfo/user/:userID', () => {
    it('should return entries for given userID', async () => {
      const docs = [
        {
          _id: new ObjectId(),
          userID: '67da15550b51479308f72a7b',
          showID: '3605a5d1c8b589c84ba97a98aad14750',
          numWatched: 0,
          timeStamp: 0,
          isBookmarked: true,
          userShowRating: 2,
        },
      ];
      mockDb.collection.mockReturnValue({
        find: () => ({ toArray: () => Promise.resolve(docs) }),
      });

      const res = await request(app).get('/userShowInfo/user/67da15550b51479308f72a7b');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(
        docs.map(d => ({ ...d, _id: d._id.toHexString() }))
      );
      expect(mockDb.collection).toHaveBeenCalledWith('userShowInfo');
    });

    it('should return 500 on DB error', async () => {
      mockDb.collection.mockImplementation(() => { throw new Error(); });
      const res = await request(app).get('/userShowInfo/user/67da15550b51479308f72a7b');
      expect(res.status).toBe(500);
      expect(res.text).toBe('Internal Server Error');
    });
  });

  describe('GET /userShowInfo/ratings/:showID', () => {
    it('should return totalRating and results', async () => {
      const docs = [
        {
          showID: '3605a5d1c8b589c84ba97a98aad14750',
          userShowRating: 2,
        },
        {
          showID: '3605a5d1c8b589c84ba97a98aad14750',
          userShowRating: 3,
        },
      ];
      mockDb.collection.mockReturnValue({
        find: () => ({ toArray: () => Promise.resolve(docs) }),
      });

      const res = await request(app).get(
        '/userShowInfo/ratings/3605a5d1c8b589c84ba97a98aad14750'
      );
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ totalRating: 5, result: docs });
      expect(mockDb.collection).toHaveBeenCalledWith('userShowInfo');
    });

    it('should return 500 on DB error', async () => {
      mockDb.collection.mockImplementation(() => { throw new Error(); });
      const res = await request(app).get(
        '/userShowInfo/ratings/3605a5d1c8b589c84ba97a98aad14750'
      );
      expect(res.status).toBe(500);
      expect(res.text).toBe('Internal Server Error');
    });
  });

  describe('GET /userShowInfo/:userID/:showID', () => {
    it('should return single entry when found', async () => {
      const doc = {
        _id: new ObjectId(),
        userID: '67da15550b51479308f72a7b',
        showID: '3605a5d1c8b589c84ba97a98aad14750',
        numWatched: 0,
        timeStamp: 0,
        isBookmarked: true,
        userShowRating: 2,
      };
      mockDb.collection.mockReturnValue({ findOne: () => Promise.resolve(doc) });

      const res = await request(app).get(
        '/userShowInfo/67da15550b51479308f72a7b/3605a5d1c8b589c84ba97a98aad14750'
      );
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ ...doc, _id: doc._id.toHexString() });
      expect(mockDb.collection).toHaveBeenCalledWith('userShowInfo');
    });

    it('should return 404 when not found', async () => {
      mockDb.collection.mockReturnValue({ findOne: () => Promise.resolve(null) });
      const res = await request(app).get(
        '/userShowInfo/67da15550b51479308f72a7b/3605a5d1c8b589c84ba97a98aad14750'
      );
      expect(res.status).toBe(404);
      expect(res.text).toBe('Not found');
    });

    it('should return 500 on DB error', async () => {
      mockDb.collection.mockImplementation(() => { throw new Error(); });
      const res = await request(app).get(
        '/userShowInfo/67da15550b51479308f72a7b/3605a5d1c8b589c84ba97a98aad14750'
      );
      expect(res.status).toBe(500);
      expect(res.text).toBe('Internal Server Error');
    });
  });

  describe('POST /userShowInfo', () => {
    it('should create a new entry and return 201', async () => {
      const newDoc = {
        userID: '67da15550b51479308f72a7b',
        showID: '3605a5d1c8b589c84ba97a98aad14750',
        numWatched: 0,
        timeStamp: 0,
        userShowRating: 2,
      };
      mockDb.collection.mockReturnValue({
        insertOne: doc => Promise.resolve({ insertedId: new ObjectId(), ...doc }),
      });

      const res = await request(app).post('/userShowInfo').send(newDoc);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('insertedId');
      expect(res.body.userShowRating).toBe(newDoc.userShowRating);
    });

    it('should return 500 on DB error', async () => {
      mockDb.collection.mockImplementation(() => { throw new Error(); });
      const res = await request(app).post('/userShowInfo').send({});
      expect(res.status).toBe(500);
      expect(res.text).toBe('Internal Server Error');
    });
  });

  describe('PATCH /userShowInfo/:id', () => {
    it('should update entry and return 200', async () => {
      const id = new ObjectId();
      mockDb.collection.mockReturnValue({ updateOne: () => Promise.resolve({ matchedCount: 1, modifiedCount: 1 }) });
      const res = await request(app)
        .patch(`/userShowInfo/${id.toHexString()}`)
        .send({ userShowRating: 3 });
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ matchedCount: 1, modifiedCount: 1 });
    });

    it('should return 500 on DB error', async () => {
      mockDb.collection.mockImplementation(() => { throw new Error(); });
      const res = await request(app).patch(
        `/userShowInfo/${new ObjectId().toHexString()}`
      ).send({});
      expect(res.status).toBe(500);
      expect(res.text).toBe('Internal Server Error');
    });
  });

  describe('DELETE /userShowInfo/:id', () => {
    it('should delete entry and return result', async () => {
      const id = new ObjectId();
      mockDb.collection.mockReturnValue({ deleteOne: () => Promise.resolve({ deletedCount: 1 }) });
      const res = await request(app).delete(
        `/userShowInfo/${id.toHexString()}`
      );
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ deletedCount: 1 });
    });

    it('should return 500 on DB error', async () => {
      mockDb.collection.mockImplementation(() => { throw new Error(); });
      const res = await request(app).delete(
        `/userShowInfo/${new ObjectId().toHexString()}`
      );
      expect(res.status).toBe(500);
      expect(res.text).toBe('Internal Server Error');
    });
  });
});
