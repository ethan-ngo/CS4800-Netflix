// backend/server.js

// 1) load your env vars from the root-level config.env
require('dotenv').config();

const express = require('express');
const cors = require('cors');

// your routes…
const users         = require('./routes/users.cjs');
const userMovieInfo = require('./routes/userMovieInfo.cjs');
const userShowInfo  = require('./routes/userShowInfo.cjs');
const movies        = require('./routes/movies.cjs');
const shows         = require('./routes/shows.cjs');

const app = express();

app.use(
  cors({
    origin: '*',
    methods: ['GET','POST','DELETE','PATCH'],
  })
);

app.use(express.json());

// mount your routers
app.use('/users',         users);
app.use('/userMovieInfo', userMovieInfo);
app.use('/userShowInfo',  userShowInfo);
app.use('/movies',        movies);
app.use('/shows',         shows);

// export for Jest
module.exports = app;

// only start listening when run directly
if (require.main === module) {
  const PORT = process.env.PORT || 5050;
  app.listen(PORT, () => {
    console.log(`🚀 Server listening on port ${PORT}`);
  });
}
