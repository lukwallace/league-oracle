
/* Parses through match data object returned by Riot; Assumes the match is ranked, so all champion values are unique */
const parseMatch = (match, matrix, championIndex) => {
  const { playedAs, participants, teams } = match;
  const winner = teams[0].winner ? teams[0].teamId : teams[1].teamId;
  const losingTeam = [];
  const winningTeam = [];
  const yourPick = championIndex[playedAs].name;
  if(matrix[yourPick] === undefined) {
    matrix[yourPick] = {};
  }
  let youWin = undefined;
  let enemyTeam = undefined;
  
  /* Parse through partcipants to determine if you've won and champions on the enemy team */
  participants.forEach(participant => {
    const { teamId, championId } = participant;
    if(championId === playedAs) {
      youWin = teamId === winner;
      return;
    }

    if(teamId === winner) {
      winningTeam.push(championId);
    } else {
      losingTeam.push(championId);
    }
  });

  /* Update matrix entry */
  enemyTeam = youWin ? losingTeam : winningTeam;
  enemyTeam.forEach(championId => {
    const opponent = championIndex[championId].name;
    if(matrix[yourPick][opponent] === undefined) {
      matrix[yourPick][opponent] = { wins: 0, total: 0 };
    }
    matrix[yourPick][opponent].total++;
    if(youWin) {
      matrix[yourPick][opponent].wins++
    }
  });
};

/* Used to sanitize names, wanked out in case we want to change later */
const sanitize = (string) => {
  return string.toLowerCase().replace(/\s+/g, '');
};

module.exports = { 
  parseMatch,
  sanitize
};
