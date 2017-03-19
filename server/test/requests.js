const { getChampionIndex, getSummonerId, getMatchRefs, getMatch } = require('../requests');

/* Tests */
getChampionIndex('na')
.then(json => {
  console.log(json);
  return getSummonerId('na', 'wallace');
})
.then(id => {
  console.log(id);
  return getMatchRefs('na', id);
})
.then(matches => {
  console.log(matches);
  return getMatch('na', matches[0].matchId);
})
.then(json => {
  console.log(json);
})
.catch(body => console.log('Error', body));
