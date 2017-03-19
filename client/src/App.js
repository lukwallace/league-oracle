import React, { Component } from 'react';
import logo from './logo.svg';
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
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
