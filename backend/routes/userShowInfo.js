import express from 'express'
import db from '../db/connection.js'
import { ObjectId } from 'mongodb'

const router = express.Router()

// Get all userShowInfo instances
router.get('/', async (req, res) => {
  const collection = await db.collection('userShowInfo')
  const results = await collection.find({}).toArray()
  res.status(200).json(results)
})

// Get all userShowInfo entries for a specific user
router.get('/user/:userID', async (req, res) => {
  try {
    const collection = await db.collection('userShowInfo')
    const result = await collection.find({ userID: req.params.userID }).toArray()
    res.status(200).json(result)
  } catch (err) {
    console.error('Error fetching userShowInfo by userID:', err)
    res.status(500).send('Internal Server Error')
  }
})

// Get one userShowInfo entry by userID and showID
router.get('/:userID/:showID', async (req, res) => {
  const collection = await db.collection('userShowInfo')
  const query = {
    userID: req.params.userID,
    showID: req.params.showID,
  }
  const result = await collection.findOne(query)

  if (!result) res.status(404).send('userShowInfo Not found')
  else res.status(200).json(result)
})

// Create a new userShowInfo entry
router.post('/', async (req, res) => {
  try {
    const newUserShowInfo = {
      userID: req.body.userID,
      showID: req.body.showID,
      numWatched: req.body.numWatched,
      timeStamp: req.body.timeStamp,
      isBookmarked: false,
      userShowRating: req.body.userShowRating,
    }
    const collection = await db.collection('userShowInfo')
    const result = await collection.insertOne(newUserShowInfo)
    res.status(201).json(result)
  } catch (err) {
    console.error(err)
    res.status(500).send('Error adding newUserShowInfo')
  }
})

// Update an existing userShowInfo entry by ID
router.patch('/:id', async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) }
    const updates = {
      $set: {
        userID: req.body.userID,
        showID: req.body.showID,
        numWatched: req.body.numWatched,
        timeStamp: req.body.timeStamp,
        isBookmarked: req.body.isBookmarked,
        userShowRating: req.body.userShowRating,
      },
    }

    const collection = await db.collection('userShowInfo')
    const result = await collection.updateOne(query, updates)
    res.status(200).json(result)
  } catch (err) {
    console.error(err)
    res.status(500).send('Error updating userShowInfo')
  }
})

// Delete a userShowInfo entry by ID
router.delete('/:id', async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) }
    const collection = await db.collection('userShowInfo')
    const result = await collection.deleteOne(query)
    res.status(200).json(result)
  } catch (err) {
    console.error(err)
    res.status(500).send('Error deleting userShowInfo')
  }
})

export default router
