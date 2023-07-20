import { useState, useEffect } from 'react';
import { ReactP5Wrapper } from 'react-p5-wrapper';
import { useContext } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';
import { ToggleButton } from 'react-bootstrap';
import { ButtonGroup } from 'react-bootstrap';
import BiosignalToggle from './BiosignalToggle.js';

import * as graph from '../../sketches/newSketches/graphSketch.js';
import * as gradient from '../../sketches/newSketches/colorVisSketch.js';
import { DataContext } from '../../context/DataContext.js';
import { ViewContext } from '../../context/ViewContext.js'
import { Link } from 'react-router-dom';

function VisualizationRow({sketch, id, biosignal, ...props}){
    const {color} = useContext(DataContext);
    const {view} = useContext(ViewContext);

    const sketchChoice = () => {
        const state = {
            id: id,
            color: color,
            ...props            
        }
        switch(sketch){
            case 'graph':
                return <ReactP5Wrapper immutable={state} biosignal={biosignal} view={view} sketch={graph.sketch}/>
            // case 'color':
            //     return <ReactP5Wrapper {...state} sketch={gradient.sketch}/>
            // default:
            //     console.log('whyyyyyy');
            //     break;
        }
    }

    return(
        <Row 
            id={`myRow-${sketch}-${id}`} 
            className="align-items-center m-0 px-0 py-2 ">
            <Col xs={11} id={`visColumn-${sketch}-${id}`} className="m-0 p-0">
                {sketchChoice()}
            </Col>
            <Col xs={1} id={`sonifyColumn-${sketch}-${id}`} className="m-0 p-0">
                {/* <Link to={`../sonifications/${id}?${searchParams}`}> */}
                    <Button 
                        variant='dark'
                    >
                        Sonify
                    </Button>
                {/* </Link> */}
            </Col>
        </Row>
    );
}

function Content({sketch, biosignal}) {
    const {data} = useContext(DataContext);
    const bio_meta = data[0]['task']['bio_meta'];
    let task_meta = structuredClone(data[0]);
    delete task_meta['task'];
    // Handling for case when more than one task belongs to a file is NOT YET complete    
    return(
        <Container 
            id={`rowContainer-${sketch}`}
            fluid
        >
            {
                data[0]['task']['files'] && data[0]['task']['files'].map((file, idx) => {
                    return <VisualizationRow 
                        id={idx + 1} 
                        key={idx + 1} 
                        biosignal={biosignal} 
                        sketch={sketch} 
                        file={file.path}
                        task_meta={task_meta}
                        bio_meta={bio_meta}
                        peak_meta={file['participant']['scene_peaks_meta']}
                    />
                })
            }
        </Container>
    );
}

export default function Visualization(){
    const [biosignal, setBiosignal] = useState('HR');
    const [active, setActive] = useState('graph');
    const [view, setView] = useState('task');

    return(
        <Tab.Container 
            defaultActiveKey="graph"
            activeKey={active}
            onSelect={(k) => setActive(k)}
        >
            <Row style={{'align-items': 'center'}}>
                <Col>
                    <Nav variant="tabs">
                        <Nav.Item>
                            <Nav.Link eventKey="graph">Graph</Nav.Link>
                        </Nav.Item>
                        {/* <Nav.Item>
                            <Nav.Link eventKey="color">Color</Nav.Link>
                        </Nav.Item> */}
                    </Nav>
                </Col>
                <Col xs={'auto'}>
                    Choose view:
                </Col>
                <Col xs={'auto'}>
                    <ButtonGroup>
                        <ToggleButton
                            variant='dark'
                            key={0}
                            id={`view-radio-0`}
                            type="radio"
                            name="view-radio"
                            value='task'
                            checked={view === 'task'}
                            onChange={(e) => {setView(e.currentTarget.value);}}
                        >
                            Task
                        </ToggleButton>
                        <ToggleButton
                            variant='dark'
                            key={1}
                            id={`view-radio-1`}
                            type="radio"
                            name="view-radio"
                            value='scene'
                            checked={view === 'scene'}
                            onChange={(e) => {setView(e.currentTarget.value);}}
                        >
                            Scene
                        </ToggleButton>                           
                    </ButtonGroup>
                </Col>
                <Col xs={'auto'}>
                    <BiosignalToggle biosignal={biosignal} callback={setBiosignal}/>
                </Col>
             </Row>
             <Row>
                <ViewContext.Provider value={{view}}>
                    <Tab.Content>
                        <Tab.Pane eventKey="graph">
                            <Content sketch={"graph"} biosignal={biosignal} active={active}/>
                        </Tab.Pane>
                        {/* <Tab.Pane eventKey="color">
                            <Content sketch={"color"} biosignal={biosignal} active={active}/>
                        </Tab.Pane> */}
                    </Tab.Content>
                </ViewContext.Provider>
            </Row>
        </Tab.Container>
    );
}
