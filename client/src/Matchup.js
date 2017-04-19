import React from 'react';

const Matchup = ({ matrix, playedAs, versus }) => {
  let component;
  if(playedAs.length !== 0 && versus.length !== 0) {
    component = (<div className="test block"> Display matchup stats here </div>);
  }

  return (
    <div>
      {component}
    </div>
  );
}

export default Matchup;