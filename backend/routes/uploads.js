import express from 'express';
import db from '../db/connection.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const posts = await db.collection('upload').find({}).toArray();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  const body = req.body;
  try {
    const result = await db.collection('upload').insertOne(body);
    res.status(201).json({ msg: "New image uploaded...!", result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;