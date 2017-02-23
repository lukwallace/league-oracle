// Retrieves env variables from .env file
require('dotenv').config();

const request = require('request');
const Promise = require('bluebird');

const base = {
  qs: {
    api_key: process.env.RIOT_API_KEY
  }
};

const getChampionIndex = () => {

}();

const getSummonerId = (region, name) => {
  const addOn = {
    baseUrl: `https://${region}.api.pvp.net`,
    uri: `api/lol/${region}/v1.4/summoner/by-name/${name}`,
  }
  const options = Object.assign(base, addOn);
  return new Promise(function(resolve, reject) {
    request(options, (err, res, body) => {
      if(!err && res.statusCode === 200) {
        resolve(body);
      } else {
        reject(body);
      }
    });
  });
};

const getMatchRefs = (region, summonerId) => {
  const addOn = {
    baseUrl: `https://${region}.api.pvp.net`,
    uri: `/api/lol/${region}/v2.2/matchlist/by-summoner/${summonerId}`,
  }
  const options = Object.assign(base, addOn);
  return new Promise(function(resolve, reject) {
    request(options, (err, res, body) => {
      if(!err && res.statusCode === 200) {
        resolve(body);
      } else {
        reject(body);
      }
    });
  });
};

const getMatch = (matchRef) => {};

getSummonerId('na', 'wallace')
.then(jsonStr => {
  const summonerId = JSON.parse(jsonStr)['wallace'].id;
  return getMatchRefs('na', summonerId);
})
.then(jsonStr => {
  console.log(JSON.parse(jsonStr));
})
.catch(body => console.log('Error', body));

module.exports = { 
  getMatch,
  getSummonerId,
  getMatchRefs
};