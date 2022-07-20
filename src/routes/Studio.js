import React, { Component, useState } from 'react'
import { useParams } from 'react-router-dom'

import Breadcrumb from '../Component/Breadcrumb';
import ContentSquare, { EmptySquare, SpecialUseSquare } from '../Component/ContentSquare';
import VizWrapper from '../Component/VizWrapper';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import { getStudioContent } from '../data';

export default function StudioWrapper(){
    let {thematicID, episodeID} = useParams();
    return(
        <>
            <Studio themid={thematicID} epid={episodeID}/>
        </>
    );
}

function Studio(props){
    const [chosenViz, setChosenViz] = useState('None');
    const visCallback = (id='None') => {
        setChosenViz(id);
    }
    const newClassName = "thematic" + props.themid;
    document.body.className = newClassName;
    const eppath = `/${props.themid}/episodes/${props.epid}`;
    console.log('Chosen Viz: ', chosenViz);
    return(
        <Container fluid>
            <Container className="flex-column" fluid>
                <Row>
                    <Breadcrumb path={eppath} themid={props.themid}/>                
                </Row>
                <Row>
                    <ButtonGrid epid={props.epid} callback={visCallback}/>                    
                </Row>
                {chosenViz == 'None' 
                    ? <></>
                    :
                    <Row>
                        <VizWrapper id={chosenViz} />
                    </Row>
                }
            </Container>
        </Container>
    );
}

function ButtonGrid(props){
    const studioContent = getStudioContent(props.epid);
    let contentSquares = [];
    for(let i = 0; i < studioContent.length; i++){
        contentSquares.push(<ContentSquare {...props} content={studioContent[i]} linksElsewhere={false} callback={props.callback}/>);
    }
    contentSquares.push(<SpecialUseSquare {...props} linksElsewhere={false} callback={props.callback} text={'Καθαρισμός'}/>);
    let nearestDiv = (studioContent.length + 1)/6 + 1;
    let remainder = nearestDiv*6 - (studioContent.length + 1)*2;
    for(let i = 0; i < remainder; i++){
        contentSquares.push(<EmptySquare />);
    }
    return contentSquares;
}