import React from 'react';
// import ReactCSSTransitionGroup from 'react-addons-css-transition-group';


const SummonerForm = ({ changeSummoner, changeForm, visable }) => {
  let component;
  if(visable) {
    component = (
      <div className='block SummonerForm'>
        <form onSubmit={changeForm}>
          <h1> A name to track. </h1>
          <input type='text' onChange={changeSummoner} /><br/>
          <input className='Submit-btn' type='submit' value='search'/>
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

export default SummonerForm;
