import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Header from './Component/Header';
import { 
  BrowserRouter,
  Routes,
  Route } from 'react-router-dom';

import ThematicScreenWrapper from './routes/ThematicScreen.js';
import Thematics from './routes/Thematics.js';

import { getThematics } from './data';
import ThemeProvider from 'react-bootstrap/ThemeProvider';

import EpisodeScreenWrapper from './routes/EpisodeScreen.js';
import ContentWrapper from './routes/EpisodeContent';

import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'


class App extends Component {
  render() {
    return (
      <ThemeProvider breakpoints={['xxl']}>
        <div className="App d-flex flex-column">
          <BrowserRouter>
            <Header />
            <Routes>
              <Route path="/" element={<Thematics thematics={getThematics()}/>} />
              <Route path=":thematicID" element={<ThematicScreenWrapper colCount={12} gridSize={120}/>} />
              <Route path=":thematicID/episodes/:episodeID" element={<EpisodeScreenWrapper colCount={12} gridSize={120}/>} />
              <Route path=":thematicID/episodes/:episodeID/content/:contentID" element={<ContentWrapper />} />
            </Routes>            
          </BrowserRouter>
        </div>
      </ThemeProvider>
    );
  }
}

export default App;
