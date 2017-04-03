import React, { Component } from 'react';
import { scrollScreen } from './scroll.js';
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


class App extends Component {
  state = {
    displaySummonerForm: true,
    displayMatchupForm: false,
    summoner: '',
    matrix: mockData,
    playedAs: '',
    versus: '',
  }

  componentDidMount = () => {
    fetch('http://localhost:8080/champions')
    .then(res => res.json())
    .then(data => {
      console.log(data);
    })
    .catch(err => {
      console.log('Error', err);      
    });
  }

  submitMatchup = (event) => {
    event.preventDefault();
    scrollScreen(650);
  }

  handleSelect = (key) => (option) => {
    const newState = {};
    if(option) {
      newState[key] = option.value;
    } else {
      newState[key] = '';
    }
    this.setState(newState);
  }

  handleChange = (key) => (event) => {
    const newState = {};
    newState[key] = event.target.value;
    this.setState(newState);
  }

  submitSummoner = (event) => {
    event.preventDefault();
    this.setState({
      displaySummonerForm: false
    });

    /* Wait until summonerForm is removed. */
    setTimeout(() => {
      this.setState({
        displayMatchupForm: true
      });
    }, 500);
  }

  render() {
    const { handleChange, handleSelect, submitMatchup, submitSummoner, state } = this;
    const { displaySummonerForm, displayMatchupForm, versus, playedAs } = state;

    return (
      <div className="App">
        <div className="block">
          <SummonerForm
            visable={displaySummonerForm}
            changeSummoner={handleChange('summoner')}
            handleSubmit={submitSummoner}
          />
          <MatchupForm
            visable={displayMatchupForm}
            playedAs={playedAs}
            versus={versus}
            changePlayedAs={handleSelect('playedAs')}
            changeVersus={handleSelect('versus')}
            handleSubmit={submitMatchup}
          />
        </div>
        <Matchup />
      </div>
    );
  }
}

export default App;
