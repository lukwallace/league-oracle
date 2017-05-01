const Promise = require('bluebird');
const redis = require('redis');
const Profile = require('./profile/profileModel.js');

const client = redis.createClient();
Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

/* Some test code for redis */
client.on('ready', () => {
  console.log('Redis connection open and ready!')
});
client.on('error', (err) => {
  console.log('We got problems:', err);
});

// client.flushall(redis.print);
// client.hmsetAsync('na:wallace', 'key', 'value', 'lastMatch', 'asd').then(res => console.log(res));
// client.hgetallAsync('na:wale').then(res => console.log(res));

/* Riot API calls */
const { getChampionIndex, getSummonerId, getMatchRefs, getMatch } = require('./requests');
const { parseMatch } = require('./helpers');

/* Singleton Object for the webserver  -- for now all data is stored locally
Will keep track of the summoners it has served in the local memory for now. Will later be uprooted by whatever database is deemed fit. Right now considering MongoDB for matricies, and Redis for summoner id and lastMatch */

/* 
Scheduling Updates vs. Getting them ad hoc -- for the long term, it might be better to have a system that updates the a summoner's matrix scheduled. Currently, a request for matrix data creates a Riot API request that must check if a player has any new matches. Assuming that a user may want to access matrix data multiple times between matches, there may be a lot of false positives, i.e. there will be a Riot API request on every matrix request even when there isn't any new match data to add to the matrix. Since we won't know if there are any new matches for a user until we actually check, (Riot doesn't have a webhook notifications) scheduling checks proportional to the number of times a matrix is requested seems like a good idea.

Example: 
  Keep a list of users that we get match data for. Every night, update from each user's matrix with match data using the list, if user hasn't had any new matches in the last 3 days, remove from the list. Users that request a matrix will automatically be placed in the list. Users that haven't requested a matrix in the last week or so but are on the list are skipped and removed.  
*/

class Oracle {
  constructor () {
    this.summoners = {};
    this.region = 'na';
    this.championIndexPromise = this.loadChampionIndex();
  }

  loadChampionIndex () {
    return getChampionIndex(this.region)
    .then(json => json.data);
  }

  /* Retrieves a summoners id, first via local storage otherwise through Riot */
  fetchId (name) {
    const { region } = this;
    const key = region + ':' + name;

    return client.hgetallAsync(key)
    .then(summoner => {
      if(summoner) {
        console.log('Summoner:', summoner)
        return summoner.id
      } else {
        return getSummonerId(this.region, name)
        .then(id => {
          client.hmset(key, 'id', id, 'lastMatch', -1, redis.print);
          return id;
        }); 
      }
    });

  }

  fetchMatrix (name) {
    return this.fetchId(name)
    .then(id => {
      return Promise.all([id, Profile.findOne({ id }).exec()]);
    })
    .spread((id, profile) => {
      console.log('Id and profile:', id, profile);
      if(profile) {
        return profile.matrix;
      } else {
        return this.initializeMatrix(name, id)
      }
    });
  }

  /* Will create a new profile, with name and id and matrix */
  initializeMatrix (name, id) {
    const matrix = {};
    let lastMatch = -1;
    const { region, championIndexPromise } = this;

    return getMatchRefs(region, id)
    .then(matchRefs => {
      if(matchRefs.length !== 0) {
        lastMatch = matchRefs[0].timestamp + 1;
      }
      const matches = [];
      matchRefs.forEach(matchRef => {
        matches.push(getMatch(region, matchRef));
      })
      return Promise.all([Promise.all(matches), championIndexPromise]);
    })
    .spread((matches, championIndex)  => {
      matches.forEach(match => parseMatch(match, matrix, championIndex))
      const profile = new Profile({ id, name, region, lastMatch, matrix });
      return profile.save();
    })
    .then(profile => {
      return profile.matrix;
    });
  }
};

module.exports = Oracle;

