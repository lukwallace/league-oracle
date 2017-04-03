import React from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';


const MatchupForm = ({ playedAs, versus, changePlayedAs, changeVersus, handleSubmit, visable }) => {
  let component;
  if(visable) {
    component = (
      <div className="MatchupForm">
        <form onSubmit={handleSubmit}>
          <h1> Gimme some matchups. </h1>
          <Select 
          value={playedAs ? playedAs : ''}
          options={[
            { value: 'one', label: 'One' },
            { value: 'two', label: 'Two' }
          ]}
          onChange={changePlayedAs} />
          <Select 
          value={versus ? versus : ''}
          options={[
            { value: 'one', label: 'One' },
            { value: 'two', label: 'Two' }
          ]}
          onChange={changeVersus} />
          <input className="Submit-btn" type="submit" value="Go"/>
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