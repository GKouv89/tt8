import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ReactP5Wrapper } from 'react-p5-wrapper';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

import * as graph from '../../sketches/newSketches/graphSketch.js';
import * as gradient from '../../sketches/newSketches/colorVisSketch.js';
import BiosignalToggle from './BiosignalToggle.js';
import { ParticipantContext } from '../../context/ParticipantContext.js';
import { useContext } from 'react';
import { Link } from 'react-router-dom';

function SketchComponent({sketch, ...props}){
    const sketchChoice = () => {
        switch(sketch){
            case 'graph':
                console.log('sketch choice says: graph!');
                return <ReactP5Wrapper {...props} sketch={graph.sketch}/>
            case 'color':
                console.log('sketch choice says: color!');
                return <ReactP5Wrapper {...props} sketch={gradient.sketch}/>
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

function VisualizationRow({id, biosignal, sketch, participant, file}){
    const [searchParams] = useSearchParams();
    const {setParticipant, color} = useContext(ParticipantContext);

    return(
        <Container fluid className="m-0 p-0">
            <Row id={`myRow-${participant}`} className="align-items-center m-0 p-0 flex-nowrap">
                <Col id={`visColumn-${participant}`} xs={10} className="m-0 p-0">
                    <SketchComponent biosignal={biosignal} sketch={sketch} color={color} file={file} participant={participant}/>                                
                </Col>
                <Col xs={2} className="sonButtonColumn m-0 p-0">
                    <Container fluid>
                        <Row className="justify-content-center">
                            <Col>
                                <h3>{id}</h3>
                            </Col>
                            <Col xs={'auto'}>
                                <Link to={`../sonifications/${participant}?${searchParams}`}>
                                    <Button 
                                        variant='dark'
                                        onClick = {() => {
                                            setParticipant(participant); 
                                        }}
                                    >
                                        Sonify
                                    </Button>
                                </Link>
                            </Col>                    
                        </Row>
                    </Container>
                </Col>
            </Row>
        </Container>
    );
}

export default function Visualization(){
    const [biosignal, setBiosignal] = useState('HR');
    const {data} = useContext(ParticipantContext);

    return(
        <Container fluid>
            <Row>
                <Col>
                    <Tabs
                        defaultActiveKey="color"
                        id='tabs'
                    >
                        {/* <Tab eventKey="graph" title="Graph">
                        {
                            color && data ? <SketchComponent color={color} files={data} sketch={'graph'} biosignal={biosignal}/> : <></>                                
                        }
                        </Tab> */}
                        <Tab eventKey="color" title="Color">
                        {
                            <Container fluid className="p-0" style={{'margin': '10px 0px'}}>
                                <Row key={0} className="p-0 justify-content-between" style={{'margin': '10px 0px'}}>
                                    <Col xs={'auto'}>
                                            <BiosignalToggle biosignal={biosignal} callback={setBiosignal}/>
                                    </Col>
                                    <Col xs={'auto'}>
                                        <h2>Participants</h2>
                                    </Col>
                                </Row>
                                <Stack gap={2}>
                                    {
                                        data && data.map((d, idx) => {
                                            return <VisualizationRow key={idx + 1} id={idx + 1} biosignal={biosignal} sketch={'color'} participant={d.participant} file={d.path} />
                                        })
                                    }
                                </Stack>
                            </Container>
                        }
                        </Tab>
                    </Tabs> 
                </Col>
            </Row>
        </Container>
    );
}