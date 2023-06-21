import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { ReactP5Wrapper } from 'react-p5-wrapper';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';

import * as graph from '../../sketches/newSketches/graphSketch.js';
import * as gradient from '../../sketches/newSketches/colorVisSketch.js';
import BiosignalToggle from './BiosignalToggle.js';
import { DataContext } from '../../context/DataContext.js';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { thematics } from '../../routes/Thematics.js';

function VisualizationRow({sketch, id, file, ...props}){
    const {thematicID, axisID, episodeID} = useParams();
    const [searchParams] = useSearchParams();
    const {color} = useContext(DataContext);

    const thematicName = thematics[thematicID-1].name;
    const fileName = `${thematicName}_Axis${axisID}_Episode${episodeID}_Participant${id}.csv`;

    const downloadFile = () => {
        const a = document.createElement('a');
        a.download = fileName;
        a.href = file;
        a.textContent = 'download the participant\'s raw data';
        document.body.appendChild(a);
        a.click();
        a.remove();
    }

    const sketchChoice = () => {
        const state = {
            id: id,
            color: color,
            file: file,
            ...props            
        }
        switch(sketch){
            case 'graph':
                return <ReactP5Wrapper {...state} sketch={graph.sketch}/>
            case 'color':
                return (
                    <ReactP5Wrapper {...state} sketch={gradient.sketch}/>
                )
            default:
                console.log('whyyyyyy');
                break;
        }
    }

    return(
        <Container
            fluid
            className='m-0 pt-1 pb-0 px-0'
        >
            {
                sketch == 'color' ? 
                        <Row>
                            <Col xs={'auto'}>
                                <h2 class="h5">Participant {id}</h2>
                            </Col>
                        </Row>
                    :
                        <></>
            }
            <Row 
                id={`myRow-${sketch}-${id}`} 
                className="align-items-center m-0 px-0 py-1">
                <Col 
                    xs={11} 
                    id={`visColumn-${sketch}-${id}`} 
                    className="m-0 p-0"
                >
                    {sketchChoice()}
                </Col>
                <Col 
                    xs={1} 
                    id={`sonifyColumn-${sketch}-${id}`} 
                    className="m-0 p-0"
                >
                    <Container 
                        fluid
                        className="flex-direction-column"
                    >
                        <Row className='justify-content-center my-1'>
                            <Col xs={'auto'}>
                                <Link to={`../sonifications/${id}?${searchParams}`}>
                                    <Button 
                                        variant='dark'
                                    >
                                        <i class="bi bi-volume-up-fill"></i>
                                    </Button>
                                </Link>
                            </Col>
                        </Row>
                        <Row className='justify-content-center my-1'>
                            <Col xs={'auto'}>
                                {/* <Button
                                    variant='dark'
                                >
                                    <i class="bi bi-download">&nbsp;Raw</i>
                                </Button> */}
                                <Button
                                    variant='dark'
                                    onClick={() => {downloadFile();}}
                                >
                                    <i class="bi bi-filetype-csv">&nbsp;Data</i>
                                </Button>
                            </Col>
                        </Row>                    
                    </Container>
                </Col>
            </Row>
        </Container>
    );
}

function Content({sketch, biosignal}) {
    const {data} = useContext(DataContext);

    return(
        <Container 
            id={`rowContainer-${sketch}`}
            fluid
        >
            {
                data && data.map((d, idx) => {
                    return <VisualizationRow id={idx + 1} key={idx + 1} biosignal={biosignal} sketch={sketch} file={d.path}/>
                })
            }
        </Container>
    );
}

export default function Visualization(){
    const [biosignal, setBiosignal] = useState('HR');
    const [active, setActive] = useState('graph');

    return(
        <Tab.Container 
            defaultActiveKey="graph"
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
