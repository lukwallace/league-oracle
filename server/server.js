const express = require('express');
const mongoose = require('mongoose');
const app = express();


app.get('/summoner/:region/:name', (req, res) => { res.send(req.params); });
app.get('*', (req, res) => { res.status(400).send(); });

// Used for testing
if (module.parent) {
  module.exports = app;
} else {
  console.log('Listening on port 8080!');
  app.listen(8080);
}
