// backend/routes/userShowInfo.js

const express = require('express');
const { ObjectId } = require('mongodb');
const { connectToDatabase } = require('../db/connection.cjs');

const router = express.Router();

// Get all userShowInfo documents
router.get('/', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const docs = await db.collection('userShowInfo').find({}).toArray();
    return res.status(200).json(docs);
  } catch (err) {
    console.error('Error fetching userShowInfo:', err);
    return res.status(500).send('Internal Server Error');
  }
});

// Get all entries for a specific userID
router.get('/user/:userID', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const docs = await db
      .collection('userShowInfo')
      .find({ userID: req.params.userID })
      .toArray();
    return res.status(200).json(docs);
  } catch (err) {
    console.error('Error fetching by userID:', err);
    return res.status(500).send('Internal Server Error');
  }
});

// Get total rating and entries for a given showID
router.get('/ratings/:showID', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const docs = await db
      .collection('userShowInfo')
      .find({ showID: req.params.showID, userShowRating: { $ne: 0 } })
      .toArray();
    const totalRating = docs.reduce((sum, d) => sum + d.userShowRating, 0);
    return res.status(200).json({ totalRating, result: docs });
  } catch (err) {
    console.error('Error fetching ratings:', err);
    return res.status(500).send('Internal Server Error');
  }
});

// Get one entry by userID and showID
router.get('/:userID/:showID', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const query = {
      userID: req.params.userID,
      showID: req.params.showID,
    };
    const result = await db.collection('userShowInfo').findOne(query);
    if (!result) return res.status(404).send('Not found');
    return res.status(200).json(result);
  } catch (err) {
    console.error('Error fetching entry:', err);
    return res.status(500).send('Internal Server Error');
  }
});

// Create a new userShowInfo
router.post('/', async (req, res) => {
  try {
    const newDoc = {
      userID: req.body.userID,
      showID: req.body.showID,
      numWatched: req.body.numWatched,
      timeStamp: req.body.timeStamp,
      isBookmarked: false,
      userShowRating: req.body.userShowRating,
    };
    const db = await connectToDatabase();
    const result = await db.collection('userShowInfo').insertOne(newDoc);
    return res.status(201).json(result);
  } catch (err) {
    console.error('Error adding new userShowInfo:', err);
    return res.status(500).send('Internal Server Error');
  }
});

// Update an existing entry by _id
router.patch('/:id', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        userID: req.body.userID,
        showID: req.body.showID,
        numWatched: req.body.numWatched,
        timeStamp: req.body.timeStamp,
        isBookmarked: req.body.isBookmarked,
        userShowRating: req.body.userShowRating,
      },
    };
    const result = await db.collection('userShowInfo').updateOne(query, updates);
    return res.status(200).json(result);
  } catch (err) {
    console.error('Error updating userShowInfo:', err);
    return res.status(500).send('Internal Server Error');
  }
});

// Delete an entry by _id
router.delete('/:id', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const query = { _id: new ObjectId(req.params.id) };
    const result = await db.collection('userShowInfo').deleteOne(query);
    return res.status(200).json(result);
  } catch (err) {
    console.error('Error deleting userShowInfo:', err);
    return res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
