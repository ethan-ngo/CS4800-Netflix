import express from 'express'

// This will help us connect to the database
import db from '../db/connection.js'

// This help convert the id from string to ObjectId for the _id.
import { ObjectId } from 'mongodb'

import crypto from 'crypto'
import nodemailer from 'nodemailer'

// This will help us hash the password
import bcrypt from 'bcrypt'

// This will help us generate a new token
import jwt from 'jsonwebtoken'
import 'dotenv/config'

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

// This will check to see if the user is authenticated.
router.post('/auth-session', async (req, res) => {
  const token = req.body.token;
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(500).send('Token is invalid');
      } else {
        console.log(decoded);
        res.status(200).json(decoded); // Send success response
      }
    });
})

// This section will help you create a new user.
router.post('/', (req, res) => {
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

// This section is for logging in
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  console.log('Login attempt:', `Email: ${email}, Password: ${password}`)
  try {
    const user = await db.collection('users').findOne({ email })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (isPasswordValid) {
      const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'})
      res.status(200).json({ message: 'Login successful', token: token, user: { email: user.email }, userID: user._id })
    } else {
      res.status(401).json({ message: 'Invalid password' })
    }
  } catch (error) {
    console.error('Error during login:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// This section will help you update a user by id.
router.patch('/:id', async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) }
    const updates = {};

    if (req.body.password) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
      updates.password = hashedPassword;
    }

    // Add other fields to the update object if they are provided
    if (req.body.name) updates.name = req.body.name;
    if (req.body.email) updates.email = req.body.email;
    if (req.body.profilePic) updates.profilePic = req.body.profilePic;

    let collection = await db.collection('users')
    let result = await collection.updateOne(query, {$set: updates})
    res.send(result).status(200)
  } catch (err) {
    console.error('Error adding newUser:', err)
    res.status(500).send('Error updating users')
  }
})

router.post('/validate-token', async (req, res) => {
  try {
    let collection = await db.collection('users')
    let user = await collection.findOne({ email: req.body.email })
    if (user.token === req.body.token && user.expireDate > Date.now()) {
      res.status(200).send('Token is valid')
    } else {
      res.status(400).send('Invalid or expired token')
    }
  } catch (error) {
    console.log(error)
    res.status(500).send('Error validating token')
  }
})
// This will send an email with a reset token and
// store it and an expiration in the user databse
router.patch('/send-email/:email', async (req, res) => {
  try {
    const resetToken = crypto.randomBytes(20).toString('hex')
    const resetTokenExpiry = Date.now() + 15 * 60 * 1000;

    const query = { email: req.params.email }
    const updates = {
      $set: {
        token: resetToken,
        expireDate: resetTokenExpiry,
      },
    }

    let collection = await db.collection('users')
    let result = await collection.findOneAndUpdate(query, updates)
    res.send(result).status(200)

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'domainfilms4800@gmail.com',
        pass: process.env.EMAIL_PW,
      },
    })

    var mailOptions = {
      from: 'domainfilms4800@gmail.com',
      to: req.params.email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <p>Please use the following token to reset your password:</p>
          <div style="padding: 10px; border: 2px solid black; border-radius: 5px; display: inline-block; margin: 10px 0;">
            <p style="font-size: 1.2em; font-weight: bold; color: #6200ea; margin: 0;">${resetToken}</p>
          </div>
          <p>This token is valid for 15 minutes.</p>
          <p>If you did not request a password reset, please ignore this email.</p>
          <p>Thank you,</p>
          <p>The Nameless Team</p>
        </div>
      `,
    }

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error)
      } else {
        console.log('Email sent: ' + info.response)
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500).send('Error sending email')
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
