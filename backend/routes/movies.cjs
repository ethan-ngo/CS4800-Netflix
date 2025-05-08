// backend/routes/movies.js

const express = require('express');
const { ObjectId } = require('mongodb');
const { connectToDatabase } = require('../db/connection.cjs');

const router = express.Router();

// Get all movies
router.get('/', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('movies');
    const results = await collection.find({}).toArray();
    return res.status(200).send(results);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Error fetching movies');
  }
});

// Get a single movie by ID
router.get('/:id', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('movies');
    const query = { _id: new ObjectId(req.params.id) };
    const result = await collection.findOne(query);

    if (!result) {
      return res.status(404).send('Not found');
    }
    return res.status(200).send(result);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Error fetching movie');
  }
});

// Create a new movie
router.post('/', async (req, res) => {
  try {
    const newMovie = {
      title:          req.body.title,
      overall_rating: req.body.overall_rating,
      genres:         req.body.genres,
      movie_length:   req.body.movie_length,
      actors:         req.body.actors,
      directors:      req.body.directors,
    };

    const db = await connectToDatabase();
    const collection = db.collection('movies');
    const result = await collection.insertOne(newMovie);

    return res.status(201).send(result);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Error adding new movie');
  }
});

// Update a movie by ID
router.patch('/:id', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('movies');
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        title:          req.body.title,
        overall_rating: req.body.overall_rating,
        genres:         req.body.genres,
        movie_length:   req.body.movie_length,
        actors:         req.body.actors,
        directors:      req.body.directors,
      },
    };

    const result = await collection.updateOne(query, updates);
    return res.status(200).send(result);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Error updating movie');
  }
});

// Delete a movie by ID
router.delete('/:id', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('movies');
    const query = { _id: new ObjectId(req.params.id) };
    const result = await collection.deleteOne(query);

    return res.status(200).send(result);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Error dealeting movie');
  }
});

module.exports = router;
