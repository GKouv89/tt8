import React, { useContext, useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

import { fetchSceneMaterial } from '../api/calls';
import Visualization from '../Component/Studio/Visualization';
import Sonification from '../Component/Studio/Sonification';
import { Container } from 'react-bootstrap';
import { ParticipantContext } from '../context/ParticipantContext';

export default function Studio(){
    let {thematicID, sessionID, episodeID} = useParams();
    const [searchParams] = useSearchParams();
    const axis = searchParams.get('axis');

    // The data for sonification and visualization are loaded here
    // So we can avoid reload every time we change the sonification/visualization given
    // Here we store the axes and the file paths/names for the sketch
    const [color, setColor] = useState(null);
    const [files, setFiles] = useState(null);
    
    // Loading data, this will be a fetch call in the near future
    // This runs just once, when the component renders
    useEffect(() => {
        fetchSceneMaterial(thematicID, sessionID, episodeID, axis)
            .then((ret) => {
                // const material = ret.material.map((mat, idx) => {mat.path = mat.path.replace('https://transitionto8.athenarc.gr/', ''); return mat;});
                setColor(ret.color);
                setFiles(ret.material);
                setData(ret.material);
            })
            .catch((err) => console.error(err));
    }, []);

    const [participant, setParticipant] = useState(null);
    const [data, setData] = useState(null);
    const chooseData = (participant) =>{
        if(participant){
            files.forEach(file => {
                if(file.participant === participant)
                {
                    setData(file.path);
                }
            });
        }else{
            setData(files);
        }
    }

    return(
        <Container fluid>
            <ParticipantContext.Provider value={{color, participant, setParticipant, data, chooseData}}>
                <SonVizWrapper />
            </ParticipantContext.Provider>
        </Container>
    );
}

function SonVizWrapper(){
    const {participant} = useContext(ParticipantContext);

    return(
        <>
        {
            participant ? <Sonification/> : <Visualization />
        }
        </>
    );
}