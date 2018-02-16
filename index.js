const path = require('path');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const routes = require('./server/routes.js');
require('dotenv').config();

const app = express();

const DB_URI = process.env.MONGODB_URI;
const port = process.env.PORT || 0;

// mPromise deprecated, use ES6 standard promises
mongoose.promise = global.Promise;

/* istanbul ignore if  */
if (process.env.NODE_ENV !== 'test') { app.use(morgan('dev')); }

app.use(express.static(path.join(__dirname, 'triton/build')));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use('/api', routes);

// Serve babel compiled build of triton
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/triton/build/index.html'));
});

mongoose.connect(DB_URI, { useMongoClient: true }, (err, res) => {
  /* istanbul ignore next */
  if (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  } else {
    if (process.env.NODE_ENV !== 'test') {
      /* eslint-disable no-console */
      console.log('connected to database');
      console.log('triton climate tool');
      console.log('listening on port : ' + port);
    }
    app.listen(port);
  }
});

module.exports = { App: app };
