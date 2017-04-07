const express = require('express');
const bluebird = require('bluebird');
const redis = require('redis');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const Oracle = require('./oracle');


const client = redis.createClient();
const oracle = new Oracle();
const app = express();


// client.on('error', (err) => {
//   console.log('We got problems:', err);
// });

// client.set('key', 'value', redis.print);
// client.getAsync('key').then(res => console.log(res));

/* CORS Headers */
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/summoner/:region/:name', (req, res) => { 
  const { region, name } = req.params;
  oracle.region = region;
  oracle.generateMatrix(name)
  .then(matrix => {
    res.send(matrix);
  });
});

app.get('/champions', (req, res) => {
  oracle.championIndexPromise
  .then(championIndex => {
    res.send(Object.keys(championIndex).map(id => { return { label: championIndex[id].name, value: id } }));
  })
});

app.get('*', (req, res) => { res.status(400).send(); });

// Used for testing
if (module.parent) {
  module.exports = app;
} else {
  console.log('Listening on port 8080!');
  app.listen(8080);
}
