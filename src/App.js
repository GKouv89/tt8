import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Thematics from './Component/Thematic';
import Header from './Component/Header';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header/>
        <Thematics thematics={thematics}/>
      </div>
    );
  }
}

const thematics = [
  { 
    _id: 1,
    name: 'Περιβάλλον',
    desc: 'Η πρώτη περιγραφή'
  },
  { 
    _id: 2,
    name: 'Εργασία',
    desc: 'Η 2η περιγραφή'
  },
  { 
    _id: 3,
    name: 'Μεταναστευτικό',
    desc: 'Η 3η περιγραφή'
  }
];

export default App;
