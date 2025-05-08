// backend/db.js
const { MongoClient, ServerApiVersion } = require('mongodb');
// if your file is config.env in the project root:
require('dotenv').config();

const uri = process.env.ATLAS_URI || '';
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let dbInstance = null;

/**
 * Connects to MongoDB (if not already connected) and returns the database object.
 * @returns {Promise<import('mongodb').Db>}
 */
async function connectToDatabase() {
  if (dbInstance) {
    return dbInstance;
  }

  try {
    // Establish the connection
    await client.connect();

    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log('✔️  Connected and pinged MongoDB successfully.');

    // Cache and return the target DB
    dbInstance = client.db('sample_mflix');
    return dbInstance;
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    throw err;
  }
}

/**
 * Closes the MongoClient connection (useful in Jest afterAll).
 * @returns {Promise<void>}
 */
async function closeDatabaseConnection() {
  if (client.isConnected && client.isConnected()) {
    await client.close();
  }
}

module.exports = {
  connectToDatabase,
  closeDatabaseConnection,
  client,            // if you ever need direct access
};
