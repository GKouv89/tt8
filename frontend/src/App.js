import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Header from './Component/Header';
import { 
  createBrowserRouter,
  Route, 
  createRoutesFromElements,
  RouterProvider,
  NavLink} from 'react-router-dom';

import ThematicGrid from './routes/NewThematicScreen.js';
import Thematics from './routes/Thematics.js';
import StudioWrapper from './routes/Studio';

import { getThematics } from './data';
import ThemeProvider from 'react-bootstrap/ThemeProvider';

import { fetchThematicScenes } from './api/calls';
import Col from 'react-bootstrap/Col';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Header />}>
      <Route 
        index
        element={<Thematics thematics={getThematics()}/>} 
      />
      <Route 
        path=":thematicID" 
        element={<ThematicGrid colCount={12} gridSize={120}/>} 
        loader = {async ({ params }) => {
          return fetchThematicScenes(params.thematicID, [1, 2]);
        }}
        handle ={{
          crumb: (params) => [
            <NavLink className='crumb' to="/">Αρχική</NavLink>,
            <NavLink className='current' to={params.thematicID}>{getThematics()[params.thematicID - 1].name}</NavLink>
          ],
        }}
      />
      <Route 
        path=":thematicID/sessions/:sessionID/episodes/:episodeID/studio" 
        element={<StudioWrapper />}
        handle = {{
          crumb: (params) => 
            [
            <NavLink className='crumb' to="/">Αρχική</NavLink>,
            <NavLink className='crumb' to={`${params.thematicID}`}>{getThematics()[params.thematicID - 1].name}</NavLink>,
            <NavLink className='current' to={`${params.thematicID}/sessions/${params.sessionID}/episodes/${params.episodeID}/studio`}>Episode {params.episodeID}</NavLink>]
          ,
        }}
      />
    </Route> 
  )
);

class App extends Component {
  render() {
    return (
      <ThemeProvider breakpoints={['xs', 'xxl']}>
        <div className="App d-flex flex-column">
            <RouterProvider router={router} />
        </div>
      </ThemeProvider>
    );
  }
}

export default App;
