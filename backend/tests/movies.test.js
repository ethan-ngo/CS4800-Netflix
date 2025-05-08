// backend/__tests__/movies.test.js

const request = require('supertest');
const app = require('../app');
const { ObjectId } = require('mongodb');

// Mock the DB connection module
jest.mock('../db/connection.cjs', () => ({
  connectToDatabase: jest.fn(),
  closeDatabaseConnection: jest.fn(),
}));

describe('Movies Routes', () => {
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

  describe('GET /movies', () => {
    it('returns 200 and an array of movies', async () => {
      const id = new ObjectId();
      const fakeMovies = [{ _id: id, title: 'Movie1' }];
      mockDb.collection.mockReturnValue({
        find: () => ({ toArray: () => Promise.resolve(fakeMovies) }),
      });

      const res = await request(app).get('/movies');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([{ _id: id.toHexString(), title: 'Movie1' }]);
      expect(mockDb.collection).toHaveBeenCalledWith('movies');
    });

    it('returns 500 on DB error', async () => {
      mockDb.collection.mockImplementation(() => { throw new Error('Fail'); });
      const res = await request(app).get('/movies');
      expect(res.status).toBe(500);
      expect(res.text).toBe('Error fetching movies');
    });
  });

  describe('GET /movies/:id', () => {
    it('returns 200 and movie when found', async () => {
      const id = new ObjectId();
      const fakeMovie = { _id: id, title: 'M1' };
      mockDb.collection.mockReturnValue({
        findOne: () => Promise.resolve(fakeMovie),
      });

      const res = await request(app).get(`/movies/${id.toHexString()}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ _id: id.toHexString(), title: 'M1' });
      expect(mockDb.collection).toHaveBeenCalledWith('movies');
    });

    it('returns 404 if not found', async () => {
      mockDb.collection.mockReturnValue({ findOne: () => Promise.resolve(null) });
      const res = await request(app).get(`/movies/${new ObjectId().toHexString()}`);
      expect(res.status).toBe(404);
      expect(res.text).toBe('Not found');
    });

    it('returns 500 on DB error', async () => {
      mockDb.collection.mockReturnValue({ findOne: () => { throw new Error('oops'); } });
      const res = await request(app).get(`/movies/${new ObjectId().toHexString()}`);
      expect(res.status).toBe(500);
      expect(res.text).toBe('Error fetching movie');
    });
  });

  describe('POST /movies', () => {
    it('creates a new movie and returns 201', async () => {
      const movieData = {
        title: 'New',
        overall_rating: 5,
        genres: ['A'],
        movie_length: 120,
        actors: ['A'],
        directors: ['D'],
      };
      mockDb.collection.mockReturnValue({
        insertOne: (doc) => Promise.resolve({ insertedId: new ObjectId(), ...doc }),
      });

      const res = await request(app).post('/movies').send(movieData);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('insertedId');
      expect(res.body.title).toBe(movieData.title);
    });

    it('returns 500 on DB error', async () => {
      mockDb.collection.mockImplementation(() => { throw new Error(); });
      const res = await request(app).post('/movies').send({});
      expect(res.status).toBe(500);
      expect(res.text).toBe('Error adding new movie');
    });
  });

  describe('PATCH /movies/:id', () => {
    it('updates movie and returns 200', async () => {
      const id = new ObjectId();
      mockDb.collection.mockReturnValue({
        updateOne: () => Promise.resolve({ matchedCount: 1, modifiedCount: 1 }),
      });

      const res = await request(app)
        .patch(`/movies/${id.toHexString()}`)
        .send({ title: 'Up', overall_rating: 4, genres: ['B'], movie_length: 90, actors: ['X'], directors: ['Y'] });
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ matchedCount: 1, modifiedCount: 1 });
    });

    it('returns 500 on DB error', async () => {
      mockDb.collection.mockReturnValue({ updateOne: () => { throw new Error(); } });
      const res = await request(app)
        .patch(`/movies/${new ObjectId().toHexString()}`)
        .send({});
      expect(res.status).toBe(500);
      expect(res.text).toBe('Error updating movie');
    });
  });

  describe('DELETE /movies/:id', () => {
    it('deletes movie and returns 200', async () => {
      const id = new ObjectId();
      mockDb.collection.mockReturnValue({ deleteOne: () => Promise.resolve({ deletedCount: 1 }) });
      const res = await request(app).delete(`/movies/${id.toHexString()}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ deletedCount: 1 });
    });

    it('returns 500 on DB error', async () => {
      mockDb.collection.mockReturnValue({ deleteOne: () => { throw new Error(); } });
      const res = await request(app).delete(`/movies/${new ObjectId().toHexString()}`);
      expect(res.status).toBe(500);
      expect(res.text).toBe('Error dealeting movie');
    });
  });
});
