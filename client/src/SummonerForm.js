import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';


class SummonerForm extends Component {
  componentDidMount () {
    const { visable } = this.props;
    if(visable) {
      this.inputRef.focus();
    }
  }

  render () {
    const { changeSummoner, handleSubmit, visable } = this.props;
    let component;
    if(visable) {
      component = (
        <div className="SummonerForm">
          <form onSubmit={handleSubmit}>
            <h1> A name to track. </h1>
            <input ref={input => this.inputRef = input}type="text" onChange={changeSummoner} /><br/>
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
}

export default SummonerForm;
