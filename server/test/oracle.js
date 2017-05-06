const Oracle = require('../oracle');
const redis = require('redis');
const Profile = require('../profile/profileModel');

const oracle = new Oracle();

console.log('Flushing Redis . . .');
oracle._redis.flushallAsync()
.then(() => {
  console.log('Flushed Redis, truncating Profiles . . .')
  return Profile.remove({})
})
.then(() => {
  console.log('Profiles truncated, fetching matrix');
  return oracle.fetchMatrix('wallace')
})
.then(matrix => {
  console.log(matrix);
});

