const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const routes = require('./server/routes.js');

const DB_URI = process.env.MONGODB_URI;
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'triton/build')));

app.use('/api', routes);

// Serve babel compiled build of triton
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/triton/build/index.html'));
});

// mPromise deprecated, use ES6 standard promises
mongoose.promise = global.Promise;

mongoose.connect(DB_URI, { useMongoClient: true }, (err, res) => {
  if (err) {
    console.error(err);
    process.exit(1);
  } else {
    if (process.env.NODE_ENV !== 'test') {
      console.log('connected to database');
      console.log('triton climate tool');
      console.log('listening on port : ' + port);
    }
    app.listen(port);
  }
});

module.exports = { App: app };
