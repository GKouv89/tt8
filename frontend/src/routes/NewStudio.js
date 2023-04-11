import React, { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

import { ReactP5Wrapper } from 'react-p5-wrapper';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

import { fetchSceneMaterial } from '../api/calls';

import * as graph from '../sketches/newSketches/graphSketch.js';
import { ToggleButton } from 'react-bootstrap';

export default function Studio(){
    let {thematicID, sessionID, episodeID} = useParams();
    const [searchParams] = useSearchParams();
    const axis = searchParams.get('axis');

    // The data for sonification and visualization are loaded here
    // So we can avoid reload every time we change the sonification/visualization given
    // Here we store the axes and the file paths/names for the sketch
    const [color, setColor] = useState(null);
    const [files, setFiles] = useState(null);
    const [showPlayToast, setShowPlayToast] = useState(true);
    const [showRecToast, setRecToast] = useState(true);

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

    return(
        <>
            <ToastContainer>
                <Toast key={0} show={showPlayToast} bg={'warning'} onClose={() =>setShowPlayToast(false)}>
                    <Toast.Header style={{'justifyContent': 'space-between'}}>
                        <strong>Playback</strong>
                    </Toast.Header>
                    <Toast.Body>
                        <small>
                            Playback is paused when the current browser tab is switched or minimized.
                        </small>
                    </Toast.Body>
                </Toast>
                <Toast key={1} show={showRecToast} onClose={() => setRecToast(false)} bg={'danger'}>
                    <Toast.Header style={{'justifyContent': 'space-between'}}>
                        <strong>Recording</strong>
                    </Toast.Header>
                    <Toast.Body>
                        <small>
                            Recording is reset when the current browser tab is switched or minimized.
                            Don't worry, you can restart again.
                        </small>
                    </Toast.Body>
                </Toast>
            </ToastContainer>
            <Container fluid>
                <Container className="flex-column" fluid>
                    <Row>
                        <Tabs
                            defaultActiveKey="graph"
                        >
                            <Tab eventKey="graph" title="Graph">
                            {
                                color && files ? <SketchComponent color={color} files={files}/> : <></>                                
                            }
                            </Tab>
                            <Tab eventKey="waveform" title="Waveform" disabled>
                            </Tab>
                            <Tab eventKey="color" title="Color" disabled>
                            </Tab>
                        </Tabs> 
                    </Row>
                </Container>
            </Container>
        </>
    );
}

function SketchComponent({color, files}){
    const [biosignal, setBiosignal] = useState('HR');

    const biosignals = [
        {name: 'Heart Rate', value: 'HR'},
        {name: 'Galvanic Skin Response', value: 'GSR'},
        {name: 'Temperature', value: 'Temp'},
    ];

    return(
        <Container>
            <Row className='justify-content-between'>
                <Col xs={'auto'} id='parent_col'>
                    <ReactP5Wrapper sketch={graph.sketch} color={color} files={files} biosignal={biosignal}/>
                </Col>
                <Col xs={'auto'}>
                    <ButtonGroup>
                        {/* <Button key={0} active>Heart Rate</Button>
                        <Button key={1}>Galvanic Skin Response</Button>
                        <Button key={2}>Temperature</Button> */}
                        {biosignals.map((signal, idx) => (
                            <ToggleButton
                                key={idx}
                                id={`radio-${idx}`}
                                type="radio"
                                name="radio"
                                value={signal.value}
                                checked={biosignal === signal.value}
                                onChange={(e) => setBiosignal(e.currentTarget.value)}
                            >
                                {signal.name}
                            </ToggleButton>                            
                        ))}
                    </ButtonGroup>
                </Col>
            </Row>
        </Container>
    )
}