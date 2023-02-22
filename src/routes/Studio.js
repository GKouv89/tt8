import React, { Component, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import Breadcrumb from '../Component/Breadcrumb';
import ContentSquare, { EmptySquare, SpecialUseSquare } from '../Component/ContentSquare';
import { ReactP5Wrapper } from 'react-p5-wrapper';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner';

import { getStudioContent, getAxisColorsAndNames, getAllEpisodeBiometrics } from '../data';
import * as single from '../sketches/singularParticipantSketch'
import * as episode from '../sketches/episodeSketch'
import * as episodeCreative from '../sketches/episodeCreativeSketch'

export default function StudioWrapper(){
    let {thematicID, episodeID} = useParams();
    return(
        <>
            <Studio themid={thematicID} epid={episodeID}/>
        </>
    );
}

function sketchChoice(chosenViz, axes, files){
    // According to which sketch is used, a different row/column layout is preferred
    // and is returned bundled with the sketch wrapper        
    switch(chosenViz){
        case 0: // Screen no. 0 is the sonification/visualization of a signle participant's biometric data.
            // Either one of his biometrics, or an average of all of them, can be chosen.
            return(
                <Container>
                    <Row className='align-items-center'>
                        <Col id="sketch-canvas-container">
                            <ReactP5Wrapper sketch={single.sketch} axes={axes} files={files}/>
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
                        <ReactP5Wrapper sketch={episode.sketch} axes={axes} files={files}/>
                    </Row>
                </Container>
            );
        default:
            break;
    }
}

function Studio(props){
    // The data for sonification and visualization are loaded here
    // So we can avoid reload every time we change the sonification/visualization given
    // Here we store the axes and the file paths/names for the sketch
    const [data, setData] = useState(null)

    // Setting paths for breadcrumb buttons
    const newClassName = "thematic" + props.themid; 
    document.body.className = newClassName; // CSS class for background color
    const eppath = `/${props.themid}/episodes/${props.epid}`;

    // Loading data, this will be a fetch call in the near future
    // This runs just once, when the component renders
    useEffect(() => {
        let axes = getAxisColorsAndNames(props.epid)
        let files = getAllEpisodeBiometrics(props.epid)
        setData({axes: axes, files: files})
    }, [])

    return(
        <Container fluid>
            <Container className="flex-column" fluid>
                <Row>
                    <Breadcrumb path={eppath} themid={props.themid}/>                
                </Row>
                {
                    data && data.files.length ? <SketchComponent axes={data.axes} files={data.files}/> : <h1>Προς το παρόν, δεν υπάρχουν οπτικοποιήσεις και ηχοποιήσεις για αυτό το επεισόδιο.</h1>
                }
            </Container>
        </Container>
    );
}

function SketchComponent({axes, files}){
    // Integer state for chosenViz is which 'screen' we're currently at
    const [chosenViz, setChosenViz] = useState(0); 
    // Here we store a reference (?) to the ReactP5Wrapper object of the chosen sketch
    // so when that changes, the component is rerendered
    const [sketch, setSketch] = useState(null)

    // If the 'screen' changes, then we can also set the sketch anew
    // This is called also on the 1st render of the component to show the 1st sketch
    useEffect(() => {
        setSketch(sketchChoice(chosenViz, axes, files))
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
                    <Button variant='light' className='rounded-circle' style={{'visibility': chosenViz !== 1 ? 'visible' : 'hidden'}} onClick={() => setChosenViz(chosenViz+1)}>
                        <i className="bi bi-arrow-right"></i>
                    </Button>
                </Col>
            </Row>
        </>
    )
}