import React, { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

import { fetchSceneMaterial } from '../api/calls';
import Visualization from '../Component/Studio/Visualization';
import Sonification from '../Component/Studio/Sonification';
import { Container } from 'react-bootstrap';

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
            })
            .catch((err) => console.error(err));
    }, []);

    const [component, setComponent] = useState('visualization');

    return(
        <Container fluid>
            {
                component == 'visualization' ? <Visualization files={files} color={color} callback={() => setComponent('sonification')}/> : <Sonification callback={() => setComponent('visualization')}/>
            }
        </Container>
    );
}