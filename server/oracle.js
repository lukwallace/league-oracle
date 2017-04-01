const Promise = require('bluebird');
const { getChampionIndex, getSummonerId, getMatchRefs, getMatch } = require('./requests');
const { parseMatch, sanitize } = require('./helpers');

/* Singleton Object for the webserver  -- for now all data is stored locally
Will keep track of the summoners it has served in the local memory for now. Will later be uprooted by whatever database is deemed fit. Right now considering MongoDB for matricies, and Redis for summoner id and lastMatch */

/* 
Scheduling Updates vs. Getting them ad hoc -- for the long term, it might be better to have a system that updates the a summoner's matrix scheduled. Currently, a request for matrix data creates a Riot API request that must check if a player has any new matches. Assuming that a user may want to access matrix data multiple times between matches, there may be a lot of false positives, i.e. there will be a Riot API request on every matrix request even when there isn't any new match data to add to the matrix. Since we won't know if there are any new matches for a user until we actually check, (Riot doesn't have a webhook notifications) scheduling checks proportional to the number of times a matrix is requested seems like a good idea.

Example: 
  Keep a list of users that we get match data for. Every night, update from each user's matrix with match data using the list, if user hasn't had any new matches in the last 3 days, remove from the list. Users that request a matrix will automatically be placed in the list. Users that haven't requested a matrix in the last week or so but are on the list are skipped and removed.  
*/

const Oracle = function() {
  this.summoners = {};
  this.region = 'na';
  this.championIndexPromise = this.loadChampionIndex();
};

/* Methods */
Oracle.prototype.loadChampionIndex = function() {
  return getChampionIndex(this.region)
  .then(json => json.data);
};


Oracle.prototype.storeSummoner = function(name) {
  return getSummonerId(this.region, name)
  .then(id => this.summoners[sanitize(name)] = { id, lastMatch: undefined, matrix: {} });
};

Oracle.prototype.getData = function(name) {
  const { region, summoners, championIndexPromise } = this;
  const { id, lastMatch, matrix } = summoners[name];

  return getMatchRefs(region, id, lastMatch)
  .then(matchRefs => {
    if(matchRefs.length !== 0) {
      this.summoners[name].lastMatch = matchRefs[0].timestamp + 1;
    }
    const matches = [];
    matchRefs.forEach(matchRef => {
      const { champion, matchId } = matchRef;
      matches.push(getMatch(region, matchId, champion));
    })
    return Promise.all([Promise.all(matches), championIndexPromise]);
  })
  .spread((matches, championIndex)  => {
    matches.forEach(match => parseMatch(match, matrix, championIndex))
    return matrix;
  });
}

Oracle.prototype.generateMatrix = function(name) {
  const { summoners } = this;
  let summoner = summoners[name];

  if(summoner === undefined) {
    return this.storeSummoner(name)
    .then(() => this.getData(name));
  }

  return this.getData(name);
};

module.exports = Oracle;

