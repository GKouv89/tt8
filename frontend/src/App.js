import React, { useState, useContext } from 'react';
import './App.css';

import './fonts/AeonikPro-Regular.woff';
import './fonts/AeonikPro-Regular.woff2';

import 'bootstrap/dist/css/bootstrap.min.css';

import Header from './Component/Header';
import { 
  createBrowserRouter,
  Route, 
  createRoutesFromElements,
  RouterProvider,
  NavLink,
  useLocation,
  useNavigate,
  matchPath
} from 'react-router-dom';

import ThematicGrid from './routes/ThematicScreen.js';
import Thematics, { thematics } from './routes/Thematics.js';
import Studio from './routes/Studio';
import Sonification from './Component/Studio/Sonification';

import ThemeProvider from 'react-bootstrap/ThemeProvider';
import Button from 'react-bootstrap/Button';

import { fetchThematicEpisodes } from './api/calls';

import { CleanupContext } from './context/CleanupContext';
import Visualization from './Component/Studio/Visualization';

function MyCustomNavlink({className, to, children}){
  const navigate = useNavigate();
  const {setCleanUp, setCleanUpPath} = useContext(CleanupContext);
  const matchPathResult = matchPath(
  {       
      path: ":thematicID/axes/:axisID/episodes/:episodeID/sonifications/:participantID",
  }, useLocation().pathname);
  
  function onClickHandler(){
      if(matchPathResult !== null){
        setCleanUpPath(to);
        setCleanUp(true);
      }else{
        navigate(to);
      }
  }

  return(
    <Button variant="outline-dark" size="sm" onClick={() => onClickHandler()} disabled={className === 'current'}>{children}</Button>
  );
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Header />}>
      <Route 
        index
        element={<Thematics/>} 
      />
      <Route 
        path=":thematicName" 
        element={<ThematicGrid/>} 
        loader = {async ({ params }) => {
          return fetchThematicEpisodes(params.thematicName);
        }}
        handle ={{
          crumb: (params) => [
            <MyCustomNavlink className='crumb' to="/">Index</MyCustomNavlink>,
            <MyCustomNavlink className='current' to={`/${params.thematicName}`}>{params.thematicName}</MyCustomNavlink>
          ],
        }}
      />
      <Route
        path=":thematicName/axes/:axisID/episodes/:episodeID" 
        element={<Studio />}
        handle = {{
          crumb: (params) => 
            [
            <MyCustomNavlink className='crumb' to="/">Index</MyCustomNavlink>,
            <MyCustomNavlink className='crumb' to={`/${params.thematicName}`}>{params.thematicName}</MyCustomNavlink>,
            <MyCustomNavlink className='current' to={`/${params.thematicName}/axes/${params.axisID}/episodes/${params.episodeID}/studio`}>Axis {params.axisID} - Episode {params.episodeID}</MyCustomNavlink>]
          ,
        }}
      >
        <Route
          path="visualizations"
          element={<Visualization />}
        />
        <Route
          path="sonifications/:participantID"
          element={<Sonification />}
        />
      </Route>
    </Route> 
  )
);

function App() {
  const [cleanUp, setCleanUp] = useState(false);
  const [cleanUpPath, setCleanUpPath] = useState("../visualizations");
  return (
    <ThemeProvider breakpoints={['xs', 'md', 'xxl']}>
      <div className="App d-flex flex-column">
          <CleanupContext.Provider value={{cleanUp, setCleanUp, cleanUpPath, setCleanUpPath}}>
            <RouterProvider router={router} />
          </CleanupContext.Provider>
      </div>
    </ThemeProvider>
  );
}

export default App;
