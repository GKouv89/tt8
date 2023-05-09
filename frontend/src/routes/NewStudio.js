import React, { useContext, useEffect, useState } from 'react'
import { Outlet, useParams, useSearchParams } from 'react-router-dom'

import { fetchSceneMaterial } from '../api/calls';
import { Container } from 'react-bootstrap';
import { ParticipantContext } from '../context/ParticipantContext';

export default function Studio(){
    console.log('hi from studio');
    let {thematicID, sessionID, episodeID} = useParams();
    const [searchParams] = useSearchParams();
    const axis = searchParams.get('axis');

    // The data for sonification and visualization are loaded here
    // So we can avoid reload every time we change the sonification/visualization given
    // Here we store the axes and the file paths/names for the sketch
    const [color, setColor] = useState(null);
    const [data, setData] = useState(null);
    
    // This runs just once, when the component renders
    useEffect(() => {
        fetchSceneMaterial(thematicID, sessionID, episodeID, axis)
            .then((ret) => {
                // const material = ret.material.map((mat, idx) => {mat.path = mat.path.replace('https://transitionto8.athenarc.gr/', ''); return mat;});
                setColor(ret.color);
                setData(ret.material);
            })
            .catch((err) => console.error(err));
    }, []);

    const [participant, setParticipant] = useState(null);

    return(
        <Container fluid>
            <ParticipantContext.Provider value={{color, participant, setParticipant, data}}>
                {data && <Outlet />}
            </ParticipantContext.Provider>
        </Container>
    );
}