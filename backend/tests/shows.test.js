// backend/__tests__/shows.test.js

const request = require('supertest');
const app = require('../app'); // use app instead of server
const { ObjectId } = require('mongodb');

// Mock the DB connection module
jest.mock('../db/connection.cjs', () => ({
  connectToDatabase: jest.fn(),
  closeDatabaseConnection: jest.fn(),
}));

describe('Shows Routes', () => {
  let connectToDatabase;
  let mockDb;

  beforeAll(() => {
    // Retrieve the mocked connectToDatabase
    connectToDatabase = require('../db/connection.cjs').connectToDatabase;
  });

  beforeEach(() => {
    // Create a fresh mock DB for each test
    mockDb = { collection: jest.fn() };
    connectToDatabase.mockResolvedValue(mockDb);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /shows', () => {
    it('should return an array of shows', async () => {
      const id = new ObjectId();
      const fakeShows = [{ _id: id, title: 'Show1' }];
      mockDb.collection.mockReturnValue({
        find: () => ({ toArray: () => Promise.resolve(fakeShows) }),
      });

      const res = await request(app).get('/shows');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([{ _id: id.toHexString(), title: 'Show1' }]);
      expect(mockDb.collection).toHaveBeenCalledWith('shows');
    });

    it('should return 500 on DB error', async () => {
      mockDb.collection.mockImplementation(() => { throw new Error('DB failure'); });
      const res = await request(app).get('/shows');
      expect(res.status).toBe(500);
      expect(res.text).toBe('Error fetching shows');
    });
  });

  describe('GET /shows/:id', () => {
    it('should return a single show when found', async () => {
      const id = new ObjectId();
      const fakeShow = { _id: id, title: 'MyShow' };
      mockDb.collection.mockReturnValue({
        findOne: () => Promise.resolve(fakeShow),
      });

      const res = await request(app).get(`/shows/${id.toHexString()}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ _id: id.toHexString(), title: 'MyShow' });
      expect(mockDb.collection).toHaveBeenCalledWith('shows');
    });

    it('should return 404 when not found', async () => {
      mockDb.collection.mockReturnValue({ findOne: () => Promise.resolve(null) });
      const res = await request(app).get(`/shows/${new ObjectId().toHexString()}`);
      expect(res.status).toBe(404);
      expect(res.text).toBe('Not found');
    });

    it('should return 500 on DB error', async () => {
      mockDb.collection.mockReturnValue({ findOne: () => { throw new Error('fail'); } });
      const res = await request(app).get(`/shows/${new ObjectId().toHexString()}`);
      expect(res.status).toBe(500);
      expect(res.text).toBe('Error fetching show');
    });
  });

  describe('POST /shows', () => {
    it('should create a new show and return 201', async () => {
      const showData = {
        title: 'NewShow',
        overall_rating: 4,
        genres: ['Drama'],
        num_seasons: 2,
        episodes: 10,
        actors: ['Actor1'],
        directors: ['Director1'],
      };
      mockDb.collection.mockReturnValue({
        insertOne: (doc) => Promise.resolve({ insertedId: new ObjectId(), ...doc }),
      });

      const res = await request(app).post('/shows').send(showData);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('insertedId');
      expect(res.body.title).toBe(showData.title);
    });

    it('should return 500 on DB error', async () => {
      mockDb.collection.mockImplementation(() => { throw new Error(); });
      const res = await request(app).post('/shows').send({});
      expect(res.status).toBe(500);
      expect(res.text).toBe('Error adding new show');
    });
  });

  describe('PATCH /shows/:id', () => {
    it('should update a show and return 200', async () => {
      const id = new ObjectId();
      mockDb.collection.mockReturnValue({
        updateOne: () => Promise.resolve({ matchedCount: 1, modifiedCount: 1 }),
      });

      const res = await request(app)
        .patch(`/shows/${id.toHexString()}`)
        .send({
          title: 'UpdatedShow',
          overall_rating: 5,
          genres: ['Comedy'],
          num_seasons: 3,
          episodes: 24,
          actors: ['ActorX'],
          directors: ['DirectorY'],
        });
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ matchedCount: 1, modifiedCount: 1 });
    });

    it('should return 500 on DB error', async () => {
      mockDb.collection.mockReturnValue({ updateOne: () => { throw new Error(); } });
      const res = await request(app)
        .patch(`/shows/${new ObjectId().toHexString()}`)
        .send({});
      expect(res.status).toBe(500);
      expect(res.text).toBe('Error updating show');
    });
  });

  describe('DELETE /shows/:id', () => {
    it('should delete a show and return result', async () => {
      const id = new ObjectId();
      mockDb.collection.mockReturnValue({ deleteOne: () => Promise.resolve({ deletedCount: 1 }) });
      const res = await request(app).delete(`/shows/${id.toHexString()}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ deletedCount: 1 });
    });

    it('should return 500 on DB error', async () => {
      mockDb.collection.mockReturnValue({ deleteOne: () => { throw new Error(); } });
      const res = await request(app).delete(`/shows/${new ObjectId().toHexString()}`);
      expect(res.status).toBe(500);
      expect(res.text).toBe('Error deleting show');
    });
  });
});
