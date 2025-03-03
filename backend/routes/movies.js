import express from 'express'

// This will help us connect to the database
import db from '../db/connection.js'

// This help convert the id from string to ObjectId for the _id.
import { ObjectId } from 'mongodb'

// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /movies.
const router = express.Router()

// This section will help you get a list of all the movies.
router.get('/', async (req, res) => {
  let collection = await db.collection('movies')
  let results = await collection.find({}).toArray()
  res.send(results).status(200)
})

// This section will help you get a single user by id
router.get('/:id', async (req, res) => {
  let collection = await db.collection('movies')
  let query = { _id: new ObjectId(req.params.id) }
  let result = await collection.findOne(query)

  if (!result) res.send('Not found').status(404)
  else res.send(result).status(200)
})

// This section will help you create a new user.
router.post('/', async (req, res) => {
  try {
    let newMovie = {
      title: req.body.title,
      overall_rating: req.body.overall_rating,
      genres: req.body.genres,
      movie_length: req.body.movie_length,
      actors: req.body.actors,
      directors: req.body.directors,
    }
    let collection = await db.collection('movies')
    let result = await collection.insertOne(newMovie)
    res.send(result).status(204)
  } catch (err) {
    console.error(err)
    res.status(500).send('Error adding newMovie')
  }
})

// This section will help you update a user by id.
router.patch('/:id', async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) }
    const updates = {
      $set: {
        title: req.body.title,
        overall_rating: req.body.overall_rating,
        genres: req.body.genres,
        movie_length: req.body.movie_length,
        actors: req.body.actors,
        directors: req.body.directors,
      },
    }

    let collection = await db.collection('movies')
    let result = await collection.updateOne(query, updates)
    res.send(result).status(200)
  } catch (err) {
    console.error(err)
    res.status(500).send('Error updating movies')
  }
})

// This section will help you delete a actor
router.delete('/:id', async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) }

    const collection = db.collection('movies')
    let result = await collection.deleteOne(query)

    res.send(result).status(200)
  } catch (err) {
    console.error(err)
    res.status(500).send('Error deleting movie')
  }
})

export default router
