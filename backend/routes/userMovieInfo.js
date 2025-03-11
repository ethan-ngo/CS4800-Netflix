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

// This section will help you get a single userMovieInfo by id
router.get('/:id', async (req, res) => {
  let collection = await db.collection('userMovieInfo')
  let query = { _id: new ObjectId(req.params.id) }
  let result = await collection.findOne(query)

  if (!result) res.send('userMovieInfo Not found').status(404)
  else res.send(result).status(200)
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
    res.send(result).status(204)
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
