import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Header from './Component/Header';
import { 
  BrowserRouter,
  Routes,
  Route } from 'react-router-dom';

import ThematicScreen from './routes/ThematicScreen.js';
import Thematics from './routes/Thematics.js';

import { getThematics } from './data';

class App extends Component {
  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Header />
          <Routes>
              <Route path="/" element={<Thematics thematics={getThematics()}/>} />
              <Route path=":thematicID" element={<ThematicScreen />} />
          </Routes>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
