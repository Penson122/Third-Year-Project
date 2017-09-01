const express = require('express');
const path = require('path');

const app = express();

const routes = require('./server/routes.js');

app.use(express.static(path.join(__dirname, 'triton/build')));

app.use('/', routes);

// Serve babel compiled build of triton
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/triton/build/index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port);

console.log('triton climate tool');
console.log('listening on port : ' + port);
