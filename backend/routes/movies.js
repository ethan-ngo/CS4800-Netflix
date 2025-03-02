// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
//use("sample_mflix");
//I connected to the mongodatabase differently, I followed the instructions on the website instead of using mongosh, i downloaded the mongo extension for VScode and used Ben's password
import express from "express";
import db from "../db/connection.js"; 

// This help convert the id from string to ObjectId for the _id.
import { ObjectId } from 'mongodb'

const router = express.Router();

// fetch all movies
router.get("/", async (req, res) => {
      let collection = db.get("movies");
      const movies_collection = await movies_collection.find({}).toArray();
      res.json(movies);
});

// Get a specific movie by id
router.get("/:id", async (req, res) => {
  let movies_collection = await db.collection("movies");
  let query = { _id: new ObjectId(req.params.id) };
  let result = await movies_collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// create a new movie
router.post("/", async (req, res) => {
  try {
    let newUser = {
      id: req.body._id,
      title: req.body.title,
      plot: req.body.plot,
      genres: req.body.genres,
      length: req.body.runtime,
      cast: req.body.cast,
      date_released: req.body.year,
      poster: req.body.poster,
      rating: req.body.imbd.rating,
    };
    let movies_collection = await db.collection("movies");
    let result = await movies_collection.insertOne(newMovie);
    res.send(result).status(204);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding newMovie");
  }
  });

// delete movie by id
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };

    const movies_collection = db.collection("movies");
    let result = await movies_collection.deleteOne(query);

    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting movie");
  }
});
