import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Header from './Component/Header';
import { 
  BrowserRouter,
  Routes,
  Route } from 'react-router-dom';

import ThematicScreenWrapper from './routes/NewThematicScreen.js';
import Thematics from './routes/Thematics.js';

import { getThematics } from './data';
import ThemeProvider from 'react-bootstrap/ThemeProvider';

import StudioWrapper from './routes/Studio';

class App extends Component {
  render() {
    return (
      <ThemeProvider breakpoints={['xs', 'xxl']}>
        <div className="App d-flex flex-column">
          <BrowserRouter>
            <Header />
            <Routes>
              <Route path="/" element={<Thematics thematics={getThematics()}/>} />
              <Route path=":thematicID" element={<ThematicScreenWrapper colCount={12} gridSize={120}/>} />
              <Route path=":thematicID/sessions/:sessionID/episodes/:episodeID/studio" element={<StudioWrapper />}/>
            </Routes>            
          </BrowserRouter>
        </div>
      </ThemeProvider>
    );
  }
}

export default App;
