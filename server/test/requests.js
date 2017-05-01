const { getChampionIndex, getSummonerId, getMatchRefs, getMatch } = require('../requests');
const Promise = require('bluebird');

/* Tests */
getChampionIndex('na')
.then(json => {
  return getSummonerId('na', 'wallace');
})
.then(id => {
  return getMatchRefs('na', id);
})
.then(matchRefs => {
  const matches = [];
  matchRefs.forEach(matchRef => {
    matches.push(getMatch('na', matchRef));
  });
  return Promise.all(matches);
})
.then(matches => {
  console.log('done');
})
.catch(body => console.log('Error', body));
