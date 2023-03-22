import React, { useEffect, useState, createContext, useContext } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

import Breadcrumb from '../Component/Breadcrumb';
import { ReactP5Wrapper } from 'react-p5-wrapper';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

import { getAxisColorsAndNames, getAllEpisodeBiometrics } from '../data';
import * as single from '../sketches/singularParticipantSketch'
import * as episode from '../sketches/episodeSketch'
import { fetchSceneMaterial } from '../api/calls';

const IDContext = createContext({});

export default function StudioWrapper(){
    let {thematicID, sessionID, episodeID} = useParams();
    const [searchParams] = useSearchParams();
    const axis = searchParams.get('axis');

    return(
        <>
            <Studio themid={thematicID} epid={episodeID} sessionID={sessionID} axis={axis}/>
        </>
    );
}

function sketchChoice(chosenViz, color, files){
    // According to which sketch is used, a different row/column layout is preferred
    // and is returned bundled with the sketch wrapper        
    switch(chosenViz){
        case 0: // Screen no. 0 is the sonification/visualization of a signle participant's biometric data.
            // Either one of his biometrics, or an average of all of them, can be chosen.
            return(
                <Container>
                    <Row className='align-items-center'>
                        <Col id="sketch-canvas-container">
                            <ReactP5Wrapper sketch={single.sketch} color={color} files={files}/>
                        </Col>
                        <Col id="sketch-gui-container"></Col> 
                    </Row>
                </Container>
            );
        case 1: // Screen no. 1 is the sonification/visualization of all biometrics of all episode participants.
            return(
                <Container className='flex-column'>
                    <Row id="sketch-ribbon-container"></Row>
                    <Row id="sketch-canvas-container-large">
                        <ReactP5Wrapper sketch={episode.sketch} color={color} files={files}/>
                    </Row>
                </Container>
            );
        default:
            break;
    }
}

function Studio({themid, epid, sessionID, axis}){
    // The data for sonification and visualization are loaded here
    // So we can avoid reload every time we change the sonification/visualization given
    // Here we store the axes and the file paths/names for the sketch
    const [color, setColor] = useState(null);
    const [files, setFiles] = useState(null);
    const [showPlayToast, setShowPlayToast] = useState(true);
    const [showRecToast, setRecToast] = useState(true);

    // Setting paths for breadcrumb buttons
    const newClassName = "thematic" + themid; 
    document.body.className = newClassName; // CSS class for background color
    const eppath = `/${themid}`;

    // Loading data, this will be a fetch call in the near future
    // This runs just once, when the component renders
    useEffect(() => {
        fetchSceneMaterial(themid, sessionID, epid, axis)
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
                        <Breadcrumb path={eppath} themid={themid}/>
                    </Row>
                    {
                        color && files ? <SketchComponent color={color} files={files}/> : <h1>Προς το παρόν, δεν υπάρχουν οπτικοποιήσεις και ηχοποιήσεις για αυτό το επεισόδιο.</h1>
                    }
                </Container>
            </Container>
        </>
    );
}

function SketchComponent({color, files}){
    // Integer state for chosenViz is which 'screen' we're currently at
    const [chosenViz, setChosenViz] = useState(0); 
    // Here we store a reference (?) to the ReactP5Wrapper object of the chosen sketch
    // so when that changes, the component is rerendered
    const [sketch, setSketch] = useState(null)

    // If the 'screen' changes, then we can also set the sketch anew
    // This is called also on the 1st render of the component to show the 1st sketch
    useEffect(() => {
        setSketch(sketchChoice(chosenViz, color, files))
    }, [chosenViz])

    // The 3rd column is space for the GUI that will be created from the sketch, hence its emptiness
    return(
        <>
            <Spinner id="p5_loading" animation="border"/>
            <Row className='align-items-center fluid'>
                <Col xs="auto">
                    <Button variant='light' className='rounded-circle' style={{'visibility': chosenViz !== 0 ? 'visible' : 'hidden'}} onClick={() => setChosenViz(chosenViz-1)}>
                        <i className="bi bi-arrow-left"></i>
                    </Button>
                </Col>
                {sketch && <Col>{sketch}</Col>}
                <Col xs="auto">
                    {/* <Button variant='light' className='rounded-circle' style={{'visibility': chosenViz !== 1 ? 'visible' : 'hidden'}} onClick={() => setChosenViz(chosenViz+1)}>
                        <i className="bi bi-arrow-right"></i>
                    </Button> */}
                </Col>
            </Row>
        </>
    )
}