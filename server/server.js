const express = require('express');
const mongoose = require('mongoose');
const Oracle = require('./oracle');

const oracle = new Oracle();
const app = express();


app.get('/summoner/:region/:name', (req, res) => { 
  const { region, name } = req.params;
  oracle.region = region;
  oracle.generateMatrix(name)
  .then(matrix => {
    res.send(matrix);
  });
});

app.get('*', (req, res) => { res.status(400).send(); });

// Used for testing
if (module.parent) {
  module.exports = app;
} else {
  console.log('Listening on port 8080!');
  app.listen(8080);
}
