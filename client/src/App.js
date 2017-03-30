import React, { Component } from 'react';
import SummonerForm from './SummonerForm.js';
import MatchupForm from './MatchupForm.js';
import Matchup from './Matchup.js';
import './App.css';

const mockData = { 
  Ekko: {
    Shaco: { wins: 1, total: 1 },
    Lucian: { wins: 1, total: 1 },
    Zac: { wins: 1, total: 1 },
    Malzahar: { wins: 1, total: 1 },
    Jayce: { wins: 1, total: 1 },
    Ahri: { wins: 0, total: 1 },
    Akali: { wins: 0, total: 1 },
    Thresh: { wins: 0, total: 1 },
    Ezreal: { wins: 0, total: 1 },
    'Xin Zhao': { wins: 0, total: 1 },
    Galio: { wins: 0, total: 1 },
    Lulu: { wins: 0, total: 2 },
    Garen: { wins: 0, total: 1 },
    Graves: { wins: 0, total: 1 },
    Caitlyn: { wins: 0, total: 1 },
    'Kog\'Maw': { wins: 0, total: 1 },
    Riven: { wins: 0, total: 1 },
    Gangplank: { wins: 0, total: 1 },
    Fizz: { wins: 0, total: 1 }
  },
  Braum: {
    Ekko: { wins: 0, total: 1 },
    Lucian: { wins: 0, total: 1 },
    Jax: { wins: 0, total: 1 },
    Rammus: { wins: 0, total: 1 },
    Janna: { wins: 0, total: 1 } 
  } 
};

/* https://github.com/fisshy/react-scroll/blob/master/modules/mixins/smooth.js */
const ease = (x) => {
  if(x < 0.5) {
    return Math.pow(x*2, 2)/2;
  }
  return 1-Math.pow((1-x)*2, 2)/2;
};

/* Function for animating vertical scroll */
const scrollScreen = (duration) => {
  const startPos = document.body.scrollTop;
  const delta = window.innerHeight;
  let start = null;

  const step = (timestamp) => {
    if(!start) {
      start = timestamp;
    }
    const progress = timestamp - start;
    const percent = progress >= duration ? 1 : ease(progress / duration);
    const currPos = startPos + Math.ceil(delta * percent);

    window.scrollTo(0, currPos);
    if(percent < 1) {
      window.requestAnimationFrame(step);
    }
  };

  window.requestAnimationFrame(step);
};


class App extends Component {
  state = {
    displaySummonerForm: true,
    displayMatchupForm: false,
    summoner: '',
    matrix: mockData,
    playedAs: '',
    versus: '',
  }


  handleSubmit = (event) => {
    event.preventDefault();
    scrollScreen(650);
  }

  handleChange = (key) => (event) => {
    const newState = {};
    newState[key] = event.target.value;
    this.setState(newState);
  }

  changeForm = (event) => {
    event.preventDefault();
    this.setState({
      displaySummonerForm: false,
      displayMatchupForm: true
    });
  }

  render() {
    const { handleChange, handleSubmit, changeForm, state } = this;
    const { displaySummonerForm, displayMatchupForm } = state;

    return (
      <div className="App">
        <SummonerForm
          visable={displaySummonerForm}
          changeSummoner={handleChange('summoner')}
          changeForm={changeForm}
        />
        <MatchupForm
          visable={displayMatchupForm}
          changePlayedAs={handleChange('playedAs')}
          changeVersus={handleChange('versus')}
          handleSubmit={handleSubmit}
        />
        <Matchup />
      </div>
    );
  }
}

export default App;
