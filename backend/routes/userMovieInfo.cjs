// backend/routes/userMovieInfo.js

const express = require('express');
const { ObjectId } = require('mongodb');
const { connectToDatabase } = require('../db/connection.cjs');

const router = express.Router();

// Get all userMovieInfo documents
router.get('/', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('userMovieInfo');
    const results = await collection.find({}).toArray();
    return res.status(200).json(results);
  } catch (err) {
    console.error('Error fetching userMovieInfo:', err);
    return res.status(500).send('Internal Server Error');
  }
});

// Get total rating and entries for a given movieID
router.get('/ratings/:movieID', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('userMovieInfo');
    const docs = await collection
      .find({ movieID: req.params.movieID, userMovieRating: { $ne: 0 } })
      .toArray();
    const totalRating = docs.reduce((sum, d) => sum + d.userMovieRating, 0);
    return res.status(200).json({ totalRating, result: docs });
  } catch (err) {
    console.error('Error fetching ratings:', err);
    return res.status(500).send('Internal Server Error');
  }
});

// Get all entries for a given userID
router.get('/user/:userID', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('userMovieInfo');
    const result = await collection.find({ userID: req.params.userID }).toArray();
    return res.status(200).json(result);
  } catch (err) {
    console.error('Error fetching by userID:', err);
    return res.status(500).send('Internal Server Error');
  }
});

// Get one entry by userID and movieID
router.get('/:userID/:movieID', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('userMovieInfo');
    const query = {
      userID: req.params.userID,
      movieID: req.params.movieID,
    };
    const result = await collection.findOne(query);
    if (!result) {
      return res.status(404).send('Not found');
    }
    return res.status(200).json(result);
  } catch (err) {
    console.error('Error fetching entry:', err);
    return res.status(500).send('Internal Server Error');
  }
});

// Create a new userMovieInfo
router.post('/', async (req, res) => {
  try {
    const newDoc = {
      userID: req.body.userID,
      movieID: req.body.movieID,
      numWatched: req.body.numWatched,
      timeStamp: req.body.timeStamp,
      isBookmarked: false,
      userMovieRating: req.body.userMovieRating,
    };
    const db = await connectToDatabase();
    const collection = db.collection('userMovieInfo');
    const result = await collection.insertOne(newDoc);
    return res.status(201).json(result);
  } catch (err) {
    console.error('Error adding new userMovieInfo:', err);
    return res.status(500).send('Internal Server Error');
  }
});

// Update an existing entry by _id
router.patch('/:id', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('userMovieInfo');
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        userID: req.body.userID,
        movieID: req.body.movieID,
        numWatched: req.body.numWatched,
        timeStamp: req.body.timeStamp,
        isBookmarked: req.body.isBookmarked,
        userMovieRating: req.body.userMovieRating,
      },
    };
    const result = await collection.updateOne(query, updates);
    return res.status(200).json(result);
  } catch (err) {
    console.error('Error updating userMovieInfo:', err);
    return res.status(500).send('Internal Server Error');
  }
});

// Delete an entry by _id
router.delete('/:id', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('userMovieInfo');
    const query = { _id: new ObjectId(req.params.id) };
    const result = await collection.deleteOne(query);
    return res.status(200).json(result);
  } catch (err) {
    console.error('Error deleting userMovieInfo:', err);
    return res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
