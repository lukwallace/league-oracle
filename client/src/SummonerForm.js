import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';


const SummonerForm = ({ changeSummoner, changeForm, visable }) => {
  let component;
  if(visable) {
    component = (
      <div className="SummonerForm">
        <form onSubmit={changeForm}>
          <h1> A name to track. </h1>
          <input type="text" onChange={changeSummoner} /><br/>
          <input className="Submit-btn" type="submit" value="search"/>
        </form>
      </div>
    );
  }

  return (
    <ReactCSSTransitionGroup
      transitionName="SummonerForm"
      transitionEnterTimeout={500}
      transitionLeaveTimeout={300}>
      {component}
    </ReactCSSTransitionGroup>
  );
}

export default SummonerForm;
