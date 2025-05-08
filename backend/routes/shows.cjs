// backend/routes/shows.js

const express = require('express');
const { ObjectId } = require('mongodb');
const { connectToDatabase } = require('../db/connection.cjs');

const router = express.Router();

// Get all shows
router.get('/', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('shows');
    const results = await collection.find({}).toArray();
    return res.status(200).send(results);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Error fetching shows');
  }
});

// Get a single show by ID
router.get('/:id', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('shows');
    const query = { _id: new ObjectId(req.params.id) };
    const result = await collection.findOne(query);

    if (!result) {
      return res.status(404).send('Not found');
    }
    return res.status(200).send(result);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Error fetching show');
  }
});

// Create a new show
router.post('/', async (req, res) => {
  try {
    const newShow = {
      title:         req.body.title,
      overall_rating:req.body.overall_rating,
      genres:        req.body.genres,
      num_seasons:   req.body.num_seasons,
      episodes:      req.body.episodes,
      actors:        req.body.actors,
      directors:     req.body.directors,
    };

    const db = await connectToDatabase();
    const collection = db.collection('shows');
    const result = await collection.insertOne(newShow);

    return res.status(201).send(result);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Error adding new show');
  }
});

// Update a show by ID
router.patch('/:id', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('shows');
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        title:         req.body.title,
        overall_rating:req.body.overall_rating,
        genres:        req.body.genres,
        num_seasons:   req.body.num_seasons,
        episodes:      req.body.episodes,
        actors:        req.body.actors,
        directors:     req.body.directors,
      },
    };

    const result = await collection.updateOne(query, updates);
    return res.status(200).send(result);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Error updating show');
  }
});

// Delete a show by ID
router.delete('/:id', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('shows');
    const query = { _id: new ObjectId(req.params.id) };
    const result = await collection.deleteOne(query);

    return res.status(200).send(result);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Error deleting show');
  }
});

module.exports = router;
