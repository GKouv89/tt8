import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ReactP5Wrapper } from 'react-p5-wrapper';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';

import * as graph from '../../sketches/newSketches/graphSketch.js';
import * as gradient from '../../sketches/newSketches/colorVisSketch.js';
import BiosignalToggle from './BiosignalToggle.js';
import { ParticipantContext } from '../../context/ParticipantContext.js';
import { useContext } from 'react';
import { Link } from 'react-router-dom';

function VisualizationRow({participant, sketch, ...props}){
    const [searchParams] = useSearchParams();
    const {setParticipant, color} = useContext(ParticipantContext);

    const sketchChoice = () => {
        const state = {
            participant: participant,
            color: color,
            ...props            
        }
        switch(sketch){
            case 'graph':
                return <ReactP5Wrapper {...state} sketch={graph.sketch}/>
            case 'color':
                return <ReactP5Wrapper {...state} sketch={gradient.sketch}/>
            default:
                console.log('whyyyyyy');
                break;
        }
    }

    return(
        <Container fluid className="m-0 p-0">
            <Row id={`myRow-${sketch}-${participant}`} className="align-items-center m-0 p-0 flex-nowrap">
                <Col id={`visColumn-${sketch}-${participant}`} xs={11} className="m-0 p-0">
                    {sketchChoice()}
                </Col>
                <Col xs={1} className="sonButtonColumn m-0 p-0">
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
    );
}

function Content({sketch, biosignal, active}) {
    const {data} = useContext(ParticipantContext);

    return(
        <Stack gap={2}>
            {
                data && data.map((d, idx) => {
                    return <VisualizationRow key={idx + 1} id={idx + 1} biosignal={biosignal} sketch={sketch} participant={d.participant} file={d.path} active={active}/>
                })
            }
        </Stack>
    );
}

export default function Visualization(){
    const [biosignal, setBiosignal] = useState('HR');
    const [active, setActive] = useState('graph');

    return(
        <Tab.Container 
            defaultActiveKey="color"
            activeKey={active}
            onSelect={(k) => setActive(k)}
        >
            <Row>
                <Col>
                    <Nav variant="tabs">
                        <Nav.Item>
                            <Nav.Link eventKey="graph">Graph</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="color">Color</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Col>
                <Col xs={'auto'}>
                    <BiosignalToggle biosignal={biosignal} callback={setBiosignal}/>
                </Col>
            </Row>
            <Row>
                <Tab.Content>
                    <Tab.Pane eventKey="graph">
                        <Content sketch={"graph"} biosignal={biosignal} active={active}/>
                    </Tab.Pane>
                    <Tab.Pane eventKey="color">
                        <Content sketch={"color"} biosignal={biosignal} active={active}/>
                    </Tab.Pane>
                </Tab.Content>
            </Row>
        </Tab.Container>
    );
}
