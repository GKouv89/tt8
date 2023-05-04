import { useState } from 'react';

import { ReactP5Wrapper } from 'react-p5-wrapper';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

import * as graph from '../../sketches/newSketches/graphSketch.js';
import * as gradient from '../../sketches/newSketches/colorVisSketch.js';
import BiosignalToggle from './BiosignalToggle.js';
import { ParticipantContext } from '../../context/ParticipantContext.js';
import { useContext } from 'react';

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

export default function Visualization(){
    const [biosignal, setBiosignal] = useState('HR');

    const {participant, setParticipant, color, data, chooseData} = useContext(ParticipantContext);

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
                            color && data ? <SketchComponent color={color} files={data} sketch={'graph'} biosignal={biosignal}/> : <></>                                
                        }
                        </Tab>
                        <Tab eventKey="color" title="Color">
                        {
                            color && data ? <SketchComponent color={color} files={data} sketch={'color'} biosignal={biosignal}/> : <></>
                        }
                        </Tab>
                    </Tabs> 
                </Col>
                <Col xs={'auto'}>
                        <div class="d-flex flex-column justify-content-evenly" style={{'height': '100%'}}>
                            <div class="d-flex">
                                <BiosignalToggle biosignal={biosignal} callback={setBiosignal}/>
                            </div>
                            {
                                data && data.map((d, idx) => (
                                    <div class="row">
                                        <Button 
                                            key={idx}
                                            // onClick={() => {callback(); participant = file.participant}}
                                            onClick = {() => {setParticipant(d.participant); chooseData(d.participant);}}
                                        >
                                            Participant {d.participant} Sonification
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