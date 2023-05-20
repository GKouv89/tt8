import React, { useContext, useEffect, useState } from 'react'
import { Outlet, useParams, useSearchParams } from 'react-router-dom'

import { fetchSceneMaterial } from '../api/calls';
import { Container } from 'react-bootstrap';
import { DataContext } from '../context/DataContext';

export default function Studio(){
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
                setColor(ret.color);
                setData(ret.material);
            })
            .catch((err) => console.error(err));
    }, []);

    return(
        <Container fluid>
            <DataContext.Provider value={{color, data}}>
                {data && <Outlet />}
            </DataContext.Provider>
        </Container>
    );
}