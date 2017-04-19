import React, { Component } from 'react';
import SummonerForm from './SummonerForm.js';
import MatchupForm from './MatchupForm.js';
import Matchup from './Matchup.js';
import { fetchChampionList, fetchMatrix } from './requests.js'
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
    matrix: mockData,
    summonerName: '',
    playedAs: '',
    versus: '',
    matchup: null,
    championIndex: null
  }

  componentDidMount = () => {
    fetchChampionList()
    .then(data => {
      const sorted = data.sort((a, b) => a.label < b.label ? -1 : a.label > b.label ? 1 : 0);
      this.setState({ championIndex: sorted })
    })
    .catch(err => {
      console.log('Error', err);      
    });
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

    fetchMatrix(this.state.summonerName).
    then(matrix => {

      /* Wait until summonerForm is removed. */
      setTimeout(() => {
        this.setState({
          matrix,
          displayMatchupForm: true
        });
      }, 300);
    });
  }

  render() {
    const { showStats, handleChange, handleSelect, submitSummoner, state } = this;
    const { displaySummonerForm, displayMatchupForm, versus, playedAs, championIndex, matrix } = state;

    return (
      <div className="App">
        <div className="block">
          <SummonerForm
            visable={displaySummonerForm}
            changeSummoner={handleChange('summonerName')}
            handleSubmit={submitSummoner}
          />
          <MatchupForm
            visable={displayMatchupForm}
            playedAs={playedAs}
            versus={versus}
            options={championIndex}
            changePlayedAs={handleSelect('playedAs')}
            changeVersus={handleSelect('versus')}
          />
        </div>
        <Matchup
          matrix={matrix}
          playedAs={playedAs}
          versus={versus}
        />
      </div>
    );
  }
}

export default App;
