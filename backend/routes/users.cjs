// backend/routes/users.js

const express = require('express');
const { ObjectId } = require('mongodb');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { connectToDatabase } = require('../db/connection.cjs');

const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const users = await db.collection('users').find({}).toArray();
    return res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    return res.status(500).send('Internal Server Error');
  }
});

// Get a user by _id
router.get('/:id', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const user = await db
      .collection('users')
      .findOne({ _id: new ObjectId(req.params.id) });
    if (!user) return res.status(404).send('Not found');
    return res.status(200).json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    return res.status(500).send('Internal Server Error');
  }
});

// Create a new user
router.post('/', async (req, res) => {
  try {
    const saltRounds = 10;
    const hashed = await bcrypt.hash(req.body.password, saltRounds);
    const newUser = {
      name: req.body.name,
      email: req.body.email,
      password: hashed,
      profilePic: null,
    };
    const db = await connectToDatabase();
    const result = await db.collection('users').insertOne(newUser);
    return res.status(201).json(result);
  } catch (err) {
    console.error('Error creating user:', err);
    return res.status(500).send('Internal Server Error');
  }
});

// Verify session token
router.post('/auth-session', (req, res) => {
  jwt.verify(req.body.token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).send('Token is invalid');
    return res.status(200).json(decoded);
  });
});

// Login
router.post('/login', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const user = await db.collection('users').findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign(
      { userId: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    return res.status(200).json({
      message: 'Login successful',
      token,
      user: { email: user.email, name: user.name },
      userID: user._id,
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Update a user by _id
router.patch('/:id', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const updates = {};
    if (req.body.password) {
      const hash = await bcrypt.hash(req.body.password, 10);
      updates.password = hash;
    }
    if (req.body.name) updates.name = req.body.name;
    if (req.body.email) updates.email = req.body.email;
    if (req.body.profilePic) updates.profilePic = req.body.profilePic;

    const result = await db
      .collection('users')
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: updates });
    return res.status(200).json(result);
  } catch (err) {
    console.error('Error updating user:', err);
    return res.status(500).send('Internal Server Error');
  }
});

// Validate a stored token
router.post('/validate-token', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const user = await db.collection('users').findOne({ email: req.body.email });
    if (user && user.token === req.body.token && user.expireDate > Date.now()) {
      return res.status(200).send('Token is valid');
    }
    return res.status(400).send('Invalid or expired token');
  } catch (err) {
    console.error('Error validating token:', err);
    return res.status(500).send('Internal Server Error');
  }
});

// Send password-reset email
router.patch('/send-email/:email', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const resetToken = crypto.randomBytes(20).toString('hex');
    const expireDate = Date.now() + 15 * 60 * 1000;

    await db
      .collection('users')
      .findOneAndUpdate(
        { email: req.params.email },
        { $set: { token: resetToken, expireDate } }
      );

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'domainfilms4800@gmail.com',
        pass: process.env.EMAIL_PW,
      },
    });

    const mailOptions = {
      from: 'domainfilms4800@gmail.com',
      to: req.params.email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <p>Please use the following token to reset your password:</p>
          <div style="padding:10px; border:2px solid black; border-radius:5px; display:inline-block;">
            <p style="font-size:1.2em; font-weight:bold; color:#6200ea;">${resetToken}</p>
          </div>
          <p>This token is valid for 15 minutes.</p>
        </div>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) console.error('Mail error:', error);
      else console.log('Email sent:', info.response);
    });

    return res.status(200).send('Reset email sent');
  } catch (err) {
    console.error('Error sending email:', err);
    return res.status(500).send('Internal Server Error');
  }
});

// Delete a user by _id
router.delete('/:id', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const result = await db
      .collection('users')
      .deleteOne({ _id: new ObjectId(req.params.id) });
    return res.status(200).json(result);
  } catch (err) {
    console.error('Error deleting user:', err);
    return res.status(500).send('Internal Server Error');
  }
});

// Get user by email
router.get('/getUserByEmail/:email', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const user = await db.collection('users').findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.status(200).json({
      userId: user._id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (err) {
    console.error('Error fetching user by email:', err);
    return res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
