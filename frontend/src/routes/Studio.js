import React, { useContext, useEffect, useState } from 'react'
import { Outlet, useParams, useSearchParams } from 'react-router-dom'

import { fetchSceneMaterial } from '../api/calls';
import { Container } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { DataContext } from '../context/DataContext';
import { thematics_alt } from './Thematics';

export default function Studio(){
    let {thematicID, axisID, episodeID} = useParams();
    const [params] = useSearchParams();
    const epid = params.get('epid');
    const sessID = params.get('sessid');

    // The data for sonification and visualization are loaded here
    // So we can avoid reload every time we change the sonification/visualization given
    // Here we store the axes and the file paths/names for the sketch
    const [color, setColor] = useState(null);
    const [data, setData] = useState(null);
    
    
    // This runs just once, when the component renders
    useEffect(() => {
        fetchSceneMaterial(thematicID, sessID, epid, axisID)
            .then((ret) => {
                setColor(ret.color);
                setData(ret.material);
            })
            .catch((err) => console.error(err));
    }, []);

    const url = `${process.env.REACT_APP_MENTOR_BASE_URL}${thematics_alt[thematicID-1]}/axis-${axisID}/episode-${episodeID}`;

    return(
        <Container fluid>
            <Row className='px-2'>
                <Col xs={'auto'}>
                    <h1 class="h2">
                        <a href={url} target="_blank">Episode {episodeID}</a>
                    </h1>
                </Col>
            </Row>
            <DataContext.Provider value={{color, data}}>
                {data && <Outlet />}
            </DataContext.Provider>
        </Container>
    );
}