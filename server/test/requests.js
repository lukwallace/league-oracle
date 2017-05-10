const { getChampionIndex, getAccountId, getMatchRefs, getMatch } = require('../requests');
const Promise = require('bluebird');

/* Tests */
getChampionIndex('na1')
.then(json => {
  return getAccountId('na1', 'wallace');
})
.then(id => {
  return getMatchRefs('na1', id);
})
.then(matchRefs => {
  const matches = [];
  matchRefs.forEach(matchRef => {
    matches.push(getMatch('na1', matchRef));
  });
  return Promise.all(matches);
})
.then(matches => {
  console.log('done');
})
.catch(body => console.log('Error', body));
