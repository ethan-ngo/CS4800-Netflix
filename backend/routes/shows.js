import express from 'express'

// This will help us connect to the database
import db from '../db/connection.js'

// This helps convert the id from string to ObjectId for the _id
import { ObjectId } from 'mongodb'

const router = express.Router()

// Get all shows
router.get('/', async (req, res) => {
  let collection = await db.collection('shows')
  let results = await collection.find({}).toArray()
  res.send(results).status(200)
})

// Get a single show by ID
router.get('/:id', async (req, res) => {
  let collection = await db.collection('shows')
  let query = { _id: new ObjectId(req.params.id) }
  let result = await collection.findOne(query)

  if (!result) res.send('Not found').status(404)
  else res.send(result).status(200)
})

// Create a new show
router.post('/', async (req, res) => {
  try {
    let newShow = {
      title: req.body.title,
      overall_rating: req.body.overall_rating,
      genres: req.body.genres,
      num_seasons: req.body.num_seasons,
      episodes: req.body.episodes,
      actors: req.body.actors,
      directors: req.body.directors,
    }
    let collection = await db.collection('shows')
    let result = await collection.insertOne(newShow)
    res.send(result).status(204)
  } catch (err) {
    console.error(err)
    res.status(500).send('Error adding newShow')
  }
})

// Update a show by ID
router.patch('/:id', async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) }
    const updates = {
      $set: {
        title: req.body.title,
        overall_rating: req.body.overall_rating,
        genres: req.body.genres,
        num_seasons: req.body.num_seasons,
        episodes: req.body.episodes,
        actors: req.body.actors,
        directors: req.body.directors,
      },
    }

    let collection = await db.collection('shows')
    let result = await collection.updateOne(query, updates)
    res.send(result).status(200)
  } catch (err) {
    console.error(err)
    res.status(500).send('Error updating show')
  }
})

// Delete a show by ID
router.delete('/:id', async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) }

    const collection = db.collection('shows')
    let result = await collection.deleteOne(query)

    res.send(result).status(200)
  } catch (err) {
    console.error(err)
    res.status(500).send('Error deleting show')
  }
})

export default router
