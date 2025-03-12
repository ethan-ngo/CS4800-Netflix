import express from 'express'

// This will help us connect to the database
import db from '../db/connection.js'

// This help convert the id from string to ObjectId for the _id.
import { ObjectId } from 'mongodb'

// This will help us hash the password
import bcrypt from 'bcrypt'

// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /users.
const router = express.Router()

// This section will help you get a list of all the users.
router.get('/', async (req, res) => {
  let collection = await db.collection('users')
  let results = await collection.find({}).toArray()
  res.send(results).status(200)
})

// This section will help you get a single user by id
router.get('/:id', async (req, res) => {
  let collection = await db.collection('users')
  let query = { _id: new ObjectId(req.params.id) }
  let result = await collection.findOne(query)

  if (!result) res.send('Not found').status(404)
  else res.send(result).status(200)
})

// This section will help you create a new user.
router.post('/', (req, res) => {
  console.log('POST /users endpoint hit')
  console.log('hashing password')

  const saltRounds = 10
  bcrypt
    .hash(req.body.password, saltRounds)
    .then((hashedPassword) => {
      console.log('Hashed password:', hashedPassword)

      let newUser = {
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        profilePic: null,
      }

      db.collection('users')
        .insertOne(newUser)
        .then((result) => {
          console.log('User created:', newUser)
          res.status(201).send(result)
        })
        .catch((err) => {
          console.error('Error adding newUser:', err)
          res.status(500).send('Error adding newUser')
        })
    })
    .catch((err) => {
      console.error('Error hashing password:', err)
      res.status(500).send('Error hashing password')
    })
})

// This section will help you update a user by id.
router.patch('/:id', async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) }
    const updates = {
      $set: {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        profilePic: req.body.profilePic,
      },
    }

    let collection = await db.collection('users')
    let result = await collection.updateOne(query, updates)
    res.send(result).status(200)
  } catch (err) {
    console.error('Error adding newUser:', err)
    res.status(500).send('Error updating users')
  }
})

// This section will help you delete a user
router.delete('/:id', async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) }

    const collection = db.collection('users')
    let result = await collection.deleteOne(query)

    res.send(result).status(200)
  } catch (err) {
    console.error(err)
    res.status(500).send('Error deleting user')
  }
})

export default router
