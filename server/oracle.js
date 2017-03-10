const Promise = require('bluebird');
const { getChampionIndex, getSummonerId, getMatchRefs, getMatch } = require('./requests');
const { parseMatch, sanitize } = require('./helpers');

/* Singleton Object for the webserver  -- for now all data is stored in local 
Will keep track of the summoners it has served in the local memory for now. Will later be uprooted by whatever database is deemed fit. Right now considering MongoDB for matricies, and Redis for summoner id and lastMatch */
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
    this.summoners[name].lastMatch = matchRefs[0].timestamp + 1;
    const matches = [];
    matchRefs.forEach(matchRef => {
      const { champion, matchId } = matchRef;
      matches.push(getMatch(region, matchId, champion));
    })
    return Promise.all([Promise.all(matches), championIndexPromise]);
  })
  .spread((matches, championIndex)  => {
    matches.forEach(match => parseMatch(match, matrix, championIndex))
    console.log(matrix);
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


const o = new Oracle();
o.generateMatrix('wallace');
