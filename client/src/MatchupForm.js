import React from 'react';
import Select from 'react-select';
import { scrollScreen } from './scroll.js';
import 'react-select/dist/react-select.css';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';


const MatchupForm = ({ playedAs, versus, changePlayedAs, changeVersus, handleSubmit, visable, options }) => {
  let component;
  if(playedAs.length !== 0 && versus.length !== 0) {
    scrollScreen(650);
  }

  if(visable) {
    component = (
      <div className="MatchupForm">
        <h1> Matchups? </h1>
        <div>
          <div className="column">
            <Select 
            value={playedAs }
            options={options}
            onChange={changePlayedAs} />
          </div>
          <div className="column">
            <Select 
            value={versus}
            options={options}
            onChange={changeVersus} />
          </div>
        </div>
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