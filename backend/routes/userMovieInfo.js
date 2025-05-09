import express from 'express'

// This will help us connect to the database
import db from '../db/connection.js'

// This help convert the id from string to ObjectId for the _id.
import { ObjectId } from 'mongodb'

// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /userMovieInfo.
const router = express.Router()

// This section will help you get a list of all the userMovieInfo instances.
router.get('/', async (req, res) => {
  let collection = await db.collection('userMovieInfo')
  let results = await collection.find({}).toArray()
  res.send(results).status(200)
})

// This section will help you get a userMovieInfo by userID to get all userMovieInfo instances for a user
router.get('/ratings/:movieID', async (req, res) => {
  try {
    const collection = await db.collection('userMovieInfo')
    const result = await collection.find({ movieID: req.params.movieID, userMovieRating: {$ne: 0}}).toArray()
    const totalRating = result.reduce((sum, item) => sum + item.userMovieRating, 0);

    res.status(200).json({totalRating, result})
  } catch (err) {
    console.error('Error fetching userMovieInfo by movieID:', err)
    res.status(500).send('Internal Server Error')
  }
})

// This section will help you get a userMovieInfo by userID to get all userMovieInfo instances for a user
router.get('/user/:userID', async (req, res) => {
  try {
    const collection = await db.collection('userMovieInfo')
    const result = await collection.find({ userID: req.params.userID }).toArray()
    res.status(200).json(result)
  } catch (err) {
    console.error('Error fetching userMovieInfo by userID:', err)
    res.status(500).send('Internal Server Error')
  }
})

// This section will help you get a single userMovieInfo by userID and movieID
router.get('/:userID/:movieID', async (req, res) => {
  let collection = await db.collection('userMovieInfo')
  let query = {
    userID: req.params.userID,
    movieID: req.params.movieID,
  }
  let result = await collection.findOne(query)

  if (!result) res.send('userMovieInfo Not found').status(404)
  else res.status(200).send(result)
})

// This section will help you create a new userMovieInfo.
router.post('/', async (req, res) => {
  try {
    let newuserMovieInfo = {
      userID: req.body.userID,
      movieID: req.body.movieID,
      numWatched: req.body.numWatched,
      timeStamp: req.body.timeStamp,
      isBookmarked: false,
      userMovieRating: req.body.userMovieRating,
    }
    let collection = await db.collection('userMovieInfo')
    let result = await collection.insertOne(newuserMovieInfo)
    res.send(result).status(200)
  } catch (err) {
    console.error(err)
    res.status(500).send('Error adding newUserMovieInfo')
  }
})

// This section will help you update a userMovieInfo by id.
router.patch('/:id', async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) }
    const updates = {
      $set: {
        userID: req.body.userID,
        movieID: req.body.movieID,
        numWatched: req.body.numWatched,
        timeStamp: req.body.timeStamp,
        isBookmarked: req.body.isBookmarked,
        userMovieRating: req.body.userMovieRating,
      },
    }

    let collection = await db.collection('userMovieInfo')
    let result = await collection.updateOne(query, updates)
    res.send(result).status(200)
  } catch (err) {
    console.error(err)
    res.status(500).send('Error updating userMovieInfo')
  }
})

// This section will help you delete a user
router.delete('/:id', async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) }

    const collection = db.collection('userMovieInfo')
    let result = await collection.deleteOne(query)

    res.send(result).status(200)
  } catch (err) {
    console.error(err)
    res.status(500).send('Error deleting userMovieInfo')
  }
})

export default router
