import React from 'react';
// import ReactCSSTransitionGroup from 'react-addons-css-transition-group';


const MatchupForm = ({ changePlayedAs, changeVersus, handleSubmit, visable }) => {
  let component;
  if(visable) {
    component = (
      <div className='block SummonerForm'>
        <form onSubmit={handleSubmit}>
          <h1> Gimme some matchups. </h1>
          <input type='text' onChange={changePlayedAs} /><br/>
          <input type='text' onChange={changeVersus} /><br/>
          <input className='Submit-btn' type='submit' value='Go!'/>
        </form>
      </div>
    );
  }

  return (
    <div>
      {component}
    </div>
  );
}

export default MatchupForm;