/* Main file */
const Promise = require('bluebird');
const redis = require('redis');
const Profile = require('./profile/profileModel.js');

const client = redis.createClient();
Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

/* Connect to Redis */
client.on('ready', () => {
  console.log('Redis connection open and ready!')
});
client.on('error', (err) => {
  console.log('We got problems:', err);
});

/* Riot API calls */
const { getChampionIndex, getAccountId, getMatchRefs, getMatch } = require('./requests');
const { parseMatch } = require('./helpers');

/* For stubbing Redis callbacks */
const noop = () => {};

/* Main Singleton */
class Oracle {
  constructor () {
    this._redis = client;
    this.region = 'na1';
    this.championIndexPromise = this.loadChampionIndex();
  }

  loadChampionIndex () {
    return getChampionIndex(this.region)
    .then(json => json.data);
  }

  fetchMatrix (name) {
    const { region } = this;
    const key = region + ':' + name;
    let cached = false;

    return client.hgetAsync(key, 'id')
    .then(id => {
      if(id) {
        cached = true;
        return id;
      }
      return getAccountId(region, name);
    })
    .then(id => {
      client.hsetAsync(key, 'id', id);
      return Promise.all([id, Profile.findOne({ id }).exec()]);
    })
    .spread((id, profile) => {
      if(!profile) {
        const lastMatch = -1;
        const matrix = {};
        profile = new Profile({ id, name, region, lastMatch, matrix });
      }

      if(cached) {
        return profile.matrix;
      }
      return this.updateProfile(profile);
    });
  }

  updateProfile (profile) {
    const { region, championIndexPromise } = this;
    const { id, matrix } = profile;

    return getMatchRefs(region, id)
    .then(matchRefs => {
      if(matchRefs.length !== 0) {
        profile.lastMatch = matchRefs[0].timestamp + 1;
      }
      const matches = [];
      matchRefs.forEach(matchRef => {
        matches.push(getMatch(region, matchRef));
      })
      return Promise.all([Promise.all(matches), championIndexPromise]);
    })
    .spread((matches, championIndex)  => {
      matches.forEach(match => parseMatch(match, matrix, championIndex));
      client.hsetAsync(region + ':' + profile.name, 'lastMatch', profile.lastMatch);
      return profile.save();
    })
    .then(profile => {
      return profile.matrix;
    });
  }
};

module.exports = Oracle;

/* 
Topics to touch on:
Why need Redis/Cache

Scheduling Updates vs. Getting them ad hoc -- for the long term, it might be better to have a system that updates the a summoner's matrix scheduled. Currently, a request for matrix data creates a Riot API request that must check if a player has any new matches. Assuming that a user may want to access matrix data multiple times between matches, there may be a lot of false positives, i.e. there will be a Riot API request on every matrix request even when there isn't any new match data to add to the matrix. Since we won't know if there are any new matches for a user until we actually check, (Riot doesn't have a webhook notifications) scheduling checks proportional to the number of times a matrix is requested seems like a good idea.

Example: 
  Keep a list of users that we get match data for. Every night, update from each user's matrix with match data using the list, if user hasn't had any new matches in the last 3 days, remove from the list. Users that request a matrix will automatically be placed in the list. Users that haven't requested a matrix in the last week or so but are on the list are skipped and removed.  
*/
