import React, { Component, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import Breadcrumb from '../Component/Breadcrumb';
import ContentSquare, { EmptySquare, SpecialUseSquare } from '../Component/ContentSquare';
import { ReactP5Wrapper } from 'react-p5-wrapper';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import { getStudioContent, getAxisColorsAndNames } from '../data';
import * as single from '../sketches/singularParticipantSketch'

export default function StudioWrapper(){
    let {thematicID, episodeID} = useParams();
    return(
        <>
            <Studio themid={thematicID} epid={episodeID}/>
        </>
    );
}

function sketchChoice(chosenViz, axes){
    switch(chosenViz){
        case 0: // Screen no. 0 is the sonification/visualization of a signle participant's biometric data.
            // Either one of his biometrics, or an average of all of them, can be chosen.
            return <ReactP5Wrapper sketch={single.sketch} axes={axes}/>
        default:
            break;
    }
}

function Studio(props){
    const [chosenViz, setChosenViz] = useState(0); 
    // Integer state for chosenViz is which 'screen' we're currently at
    const [sketch, setSketch] = useState(null)
    const [axes, setAxes] = useState(null)
    const [loadedData, setLoadedData] = useState(false)

    // Setting paths for breadcrumb buttons
    const newClassName = "thematic" + props.themid; 
    document.body.className = newClassName; // CSS class for background color
    const eppath = `/${props.themid}/episodes/${props.epid}`;

    // Loading data, this will be a fetch call in the near future
    useEffect(() => {
        setAxes(getAxisColorsAndNames(props.epid))
        setLoadedData(true)
    }, [])

    // If the data has loaded, then we can set the sketch, with the given data
    useEffect(() => {
        if(loadedData)
            setSketch(sketchChoice(chosenViz, axes))
    }, [loadedData])

    // If the data has loaded, and the 'screen' changes, then we can set the sketch anew
    useEffect(() => {
        if(loadedData)
            setSketch(sketchChoice(chosenViz, axes))
    }, [chosenViz])

    return(
        <Container fluid>
            <Container className="flex-column" fluid>
                <Row>
                    <Breadcrumb path={eppath} themid={props.themid}/>                
                </Row>
                {
                    loadedData && sketch != null ? sketch : <></>
                }
            </Container>
        </Container>
    );
}