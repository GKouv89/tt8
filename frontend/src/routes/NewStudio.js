import React, { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

import { ReactP5Wrapper } from 'react-p5-wrapper';

import Stack from 'react-bootstrap/Stack';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

import { fetchSceneMaterial } from '../api/calls';

import * as graph from '../sketches/newSketches/graphSketch.js';
import * as gradient from '../sketches/newSketches/colorVisSketch.js';
import { ToggleButton } from 'react-bootstrap';

function PlaybackRecToasts(){
    const [showPlayToast, setShowPlayToast] = useState(true);
    const [showRecToast, setRecToast] = useState(true);

    return(
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
    );
}

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

    const [biosignal, setBiosignal] = useState('HR');

    const biosignals = [
        {name: 'Heart Rate', value: 'HR'},
        {name: 'Galvanic Skin Response', value: 'GSR'},
        {name: 'Temperature', value: 'Temp'},
    ];

    return(
        <>
            <PlaybackRecToasts />
            <Container fluid>
                <Container className="flex-column" fluid>
                    <Row>
                        <Col id='tabColumn'>
                            <Tabs
                                defaultActiveKey="graph"
                                id='tabs'
                            >
                                <Tab eventKey="graph" title="Graph">
                                {
                                    color && files ? <SketchComponent color={color} files={files} sketch={'graph'} biosignal={biosignal}/> : <></>                                
                                }
                                </Tab>
                                <Tab eventKey="color" title="Color">
                                {
                                    color && files ? <SketchComponent color={color} files={files} sketch={'color'} biosignal={biosignal}/> : <></>
                                }
                                </Tab>
                            </Tabs> 
                        </Col>
                        <Col xs={'auto'}>
                                <div class="d-flex flex-column justify-content-evenly" style={{'height': '100%'}}>
                                    <div class="d-flex">
                                        <ButtonGroup>
                                            {biosignals.map((signal, idx) => (
                                                <ToggleButton
                                                    key={idx}
                                                    id={`radio-${idx}`}
                                                    type="radio"
                                                    name="radio"
                                                    value={signal.value}
                                                    checked={biosignal === signal.value}
                                                    onChange={(e) => {setBiosignal(e.currentTarget.value);}}
                                                >
                                                    {signal.name}
                                                </ToggleButton>                            
                                            ))}
                                        </ButtonGroup>
                                    </div>
                                    {
                                        files && files.map((file, idx) => (
                                            <div class="row">
                                                <Button key={idx}>Participant {file.participant} Sonification</Button>
                                            </div>
                                        ))                                    
                                    }
                                </div>
                        </Col>
                    </Row>
                </Container>
            </Container>
        </>
    );
}

function SketchComponent({color, files, sketch, biosignal}){
    const sketchChoice = () => {
        switch(sketch){
            case 'graph':
                console.log('sketch choice says: graph!');
                return <ReactP5Wrapper sketch={graph.sketch} color={color} files={files} biosignal={biosignal}/>
            case 'color':
                console.log('sketch choice says: color!');
                return <ReactP5Wrapper sketch={gradient.sketch} color={color} files={files} biosignal={biosignal}/>
            default:
                console.log('whyyyyyy');
                break;
        }
    }

    return(
        <Container fluid>
            {
                sketchChoice()        
            }
        </Container>
    );
}