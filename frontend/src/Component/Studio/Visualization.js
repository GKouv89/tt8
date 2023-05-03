import { useState } from 'react';

import { ReactP5Wrapper } from 'react-p5-wrapper';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

import * as graph from '../../sketches/newSketches/graphSketch.js';
import * as gradient from '../../sketches/newSketches/colorVisSketch.js';
import { ToggleButton } from 'react-bootstrap';

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

export default function Visualization({files, color, callback}){
    const [biosignal, setBiosignal] = useState('HR');

    const biosignals = [
        {name: 'Heart Rate', value: 'HR'},
        {name: 'Galvanic Skin Response', value: 'GSR'},
        {name: 'Temperature', value: 'Temp'},
    ];

    return(
        <Container fluid>
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
                                        <Button 
                                            key={idx}
                                            onClick={callback}
                                        >
                                            Participant {file.participant} Sonification
                                        </Button>
                                    </div>
                                ))                                    
                            }
                        </div>
                </Col>
            </Row>
        </Container>
    );
}