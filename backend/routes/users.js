import express from 'express'

// This will help us connect to the database
import db from '../db/connection.js'

// This help convert the id from string to ObjectId for the _id.
import { ObjectId } from 'mongodb'

import crypto from 'crypto';
import nodemailer from 'nodemailer'

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
router.post('/', async (req, res) => {
  try {
    let newUser = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      profilePic: null,
    }
    let collection = await db.collection('users')
    let result = await collection.insertOne(newUser)
    res.send(result).status(204)
  } catch (err) {
    console.error(err)
    res.status(500).send('Error adding newUser')
  }
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
        profilePic: req.body.profilePic
      },
    }

    let collection = await db.collection('users')
    let result = await collection.updateOne(query, updates)
    res.send(result).status(200)
  } catch (err) {
    console.error(err)
    res.status(500).send('Error updating users')
  }
})

router.post('/validate-token', async(req, res) => {
  try {
    let collection = await db.collection('users')
    let user = await collection.findOne({email: req.body.email})
    if(user.token === req.body.token && user.expireDate > Date.now()){
      res.status(200).send('Token is valid');
    }
    else{
      res.status(400).send('Invalid or expired token')
    }
  } catch(error) {
    console.log(error)
    res.status(500).send('Error validating token')
  }
})
// This will send an email with a reset token and
// store it and an expiration in the user databse
router.patch('/send-email/:email', async (req, res) => {
  try {
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

    const query = {email: req.params.email}
    const updates = {
      $set: {
        token: resetToken,
        expireDate: resetTokenExpiry,
      }
    }

    let collection = await db.collection('users')
    let result = await collection.findOneAndUpdate(query, updates)
    res.send(result).status(200)
    
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'domainfilms4800@gmail.com',
        pass: process.env.EMAIL_PW
      }
    });
    
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
          <p>This token is valid for 1 hour.</p>
          <p>If you did not request a password reset, please ignore this email.</p>
          <p>Thank you,</p>
          <p>The Nameless Team</p>
        </div>
      `,
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
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
