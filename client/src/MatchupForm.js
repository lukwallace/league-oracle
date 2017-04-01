import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';


const MatchupForm = ({ changePlayedAs, changeVersus, handleSubmit, visable }) => {
  let component;
  if(visable) {
    component = (
      <div className="MatchupForm">
        <form onSubmit={handleSubmit}>
          <h1> Gimme some matchups. </h1>
          <input type="text" onChange={changePlayedAs} /><br/>
          <input type="text" onChange={changeVersus} /><br/>
          <input className="Submit-btn" type="submit" value="Go!"/>
        </form>
      </div>
    );
  }

  return (
    <ReactCSSTransitionGroup
      transitionName="MatchupForm"
      transitionEnterTimeout={500}
      transitionLeaveTimeout={300}>
      {component}
    </ReactCSSTransitionGroup>
  );
}

export default MatchupForm;