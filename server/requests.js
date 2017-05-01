// Retrieves env variables from .env file
require('dotenv').config();

const request = require('request');
const Promise = require('bluebird');

const qs = {
  api_key: process.env.RIOT_API_KEY
};

/* 
API Limitations:
10 Requests every 10 Seconds (10000)
500 Requests every 10 Minutes (600000)
======================================
1 Request every 1.2 Seconds (1200)
*/

const queue = []; /* Queue as an array may later need to be replaced with a list, b/c shifting takes O(n) */
let requestNum = 0;
let atZero = undefined;
let waitPromise = undefined;

const _riot = (query) => {
  // console.log('Working on query', query.uri);
  return new Promise((resolve, reject) => {
    request(query, (err, res, body) => {
      if(!err && res.statusCode === 200) {
        resolve(JSON.parse(body));
      } else {
        console.log(query.uri, ':Retry After:', res.headers['retry-after']);
        reject(body);
      }
    });
  });
};

const _wait = (time) => {
  // console.log('Waiting for', time);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('Resuming!');
      waitPromise = undefined;
      resolve();
    }, time);
  });
}

const callRiot = (query) => {
  console.log('Contacting Riot . . .', query.uri);

  /* If you're not waiting */
  if(waitPromise === undefined) {

    /* Check the tenth from the last request to see if you can make another */
    if(queue.length >= 10) {
      const timeElapsed10 = Date.now() - queue[queue.length - 10].timestamp;
      const timeElapsed500 = queue.length === 500 ? (Date.now() - queue[0].timestamp) : Infinity;

      const waitTime = Math.max(10000 - timeElapsed10, 600000 - timeElapsed500);
      if(waitTime > 0) {
        waitPromise = _wait(waitTime + 1000);
        return waitPromise.then(() => callRiot(query));
      }
    }
    
    const req = _riot(query);
    const timestamp = Date.now();

    if(queue.length === 500) {
      queue.shift();
    }

    queue.push({ req, timestamp });
    return req;

  } else {
    return waitPromise.then(() => {
      return callRiot(query)
    });
  }
}


const getChampionIndex = (region) => {
  const requestString = {
    baseUrl: `https://global.api.pvp.net`,
    uri: `/api/lol/static-data/${region}/v1.2/champion`,
  }

  const options = Object.assign(qs, {
    dataById: true
  });
  return callRiot(Object.assign({ qs: options }, requestString));
};

const getSummonerId = (region, name) => {
  const requestString = {
    baseUrl: `https://${region}.api.pvp.net`,
    uri: `/api/lol/${region}/v1.4/summoner/by-name/${name}`,
  }
  return callRiot(Object.assign({ qs }, requestString))
  .then(json => json[name].id)
  .catch(error => -1);
};

const getMatchRefs = (region, summonerId, since) => {
  const requestString = {
    baseUrl: `https://${region}.api.pvp.net`,
    uri: `/api/lol/${region}/v2.2/matchlist/by-summoner/${summonerId}`,
  };
  // Attach additional options to the request
  const aux = {};
  if(since === undefined) {
    aux.beginIndex = 0;
    aux.endIndex = 5;
  } else {
    aux.beginTime = since;
  }

  const options = Object.assign(qs, aux);
  return callRiot(Object.assign({ qs: options }, requestString))
  .then(json => json.totalGames === 0 ? [] : json.matches);
};

const getMatch = (region, matchRef) => {
  const { matchId, champion } = matchRef;
  const requestString = {
    baseUrl: `https://${region}.api.pvp.net`,
    uri: `/api/lol/${region}/v2.2/match/${matchId}`,
  };
  return callRiot(Object.assign({ qs }, requestString))
  .then(json => Object.assign({ playedAs: champion }, json));
};

module.exports = { 
  getMatch,
  getSummonerId,
  getMatchRefs,
  getChampionIndex
};



/*
Storage:
For a particular match record out of the Riot API, we will be able discern the five champions a particular user has lost/won
against, and what particular champion he/she was playing as at the time. With that in mind, we would then be interested in a form of 
storage that allows for us to structure our data in a way in which we can discern those champion-specific-win-rates easily.

Ideally, we would have an object matrix -- that would tell is the matchup winrate in constant time, i.e. 
  user.ChampionName.EnemyChampionName = 0.52 || wallace.ekko.anivia = 1

In order to update information properly however would require us also keep track of the number of games:
  user.ChampionName.EnemyChampionName = { wins: 52, total: 100 };

===============================
Mongo -- document based storage
===============================
This kind of data however is hard to translate into a document based store like Mongo because it's not very keen on taking
dynamic keys as a part of the value. Methods of storage are then somewhat inconvienent. We could have an object that looks 
like this: 

Users: {
  lastRecordedMatch: Epoch Timestamp,
  summonerName: String,
  summonerId: Integer
  matchups: [{ 
    championPlayedAs: Integer/String,
    enemyRow: [{
      champion: Integer/String,
      wins: Integer,
      total: Integer
    }]
  }]
}

Retrieving, updating, and maintaining for any one champion choice will cost 2C where C is the number of
champions in the game, we lose direct look up. C^2 if we're interested all of the champion choices of a user.

Simpler:
Compare to simply storing at it's simplest form, every match will generate more records, which is inefficient after the number
of records exceed 2C. Also gets much worst with the complication of multiple users as we'd be dealing with two sources of growth,
the match records generated by current users and new users. Updates will only be 5 inserts per match processed so that's a win
there, but we're not interested in update speed. Retrieval is a scan of all records -- bad bad.

MatchUps: {
  user_id: Integer,
  champion: Integer,
  vs: Integer,
  result: Boolean
}

Users: {
  lastRecordedMatch: Epoch Timestamp,
  summonerName: String,
  summonerId: Integer
}

========================
Redis -- Key-value Store
========================
We could probably map our previous value to a key-value pair:
  "user.ChampionName.EnemyChampionName.wins" = 52
  "user.ChampionName.EnemyChampionName.total" = 100

Retrieval would still be 2C but will be for all matchuips. Updating would be constant. Not super versed in Redis
quite yet. Will have to come back.

==========
Conclusion
==========
For now, I'll just have it cached locally in a JavaScript object and revisit later with proper benchmarking. It's not proper to
do premature optimizations as is. Note to self -- give benchmarkjs a try.

*/
