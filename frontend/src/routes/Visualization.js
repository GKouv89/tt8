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
import BiosignalToggle from '../Component/BiosignalToggle.js';

import * as graph from '../sketches/newSketches/graphSketch.js';
import * as gradient from '../sketches/newSketches/colorVisSketch.js';
import { ViewContext } from '../context/ViewContext.js'
import { Link, useParams } from 'react-router-dom';

import { fetchSceneMaterial } from '../api/calls.js';

function VisualizationRow({sketch, id, sonification_link, biosignal, ...props}){
    const {view} = useContext(ViewContext);

    const sketchChoice = () => {
        const state = {
            id: id,
            ...props            
        }
        switch(sketch){
            case 'graph':
                return <ReactP5Wrapper immutable={state} biosignal={biosignal} view={view} sketch={graph.sketch}/>
            case 'color':
                return <ReactP5Wrapper immutable={state} biosignal={biosignal} view={view} sketch={gradient.sketch}/>
            default:
                console.log('whyyyyyy');
                break;
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
                <Link to={sonification_link}>
                    <Button 
                        variant='dark'
                    >
                        Sonify
                    </Button>
                </Link>
            </Col>
        </Row>
    );
}

function VisualizationLayout({sonification_prefix, response}){
    const [biosignal, setBiosignal] = useState('HR');
    const [active, setActive] = useState('graph');
    const [view, setView] = useState('task');

    const color = response.color;
    const {peak_meta, bio_meta, files, ...scene_meta} = response.scene;

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
                        <Nav.Item>
                            <Nav.Link eventKey="color">Color</Nav.Link>
                        </Nav.Item>
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
                        {
                            ["graph", "color"].map((sketch) => {
                                return <Tab.Pane eventKey={sketch}>
                                    <Container 
                                        id={`rowContainer-${sketch}`}
                                        fluid
                                    >
                                        {
                                            files && files.map((file, idx) => {
                                                return <VisualizationRow 
                                                    id={idx + 1}
                                                    sonification_link={`${sonification_prefix}/${file.participant}`}
                                                    key={idx + 1} 
                                                    files={file.paths}
                                                    scene_meta={scene_meta}
                                                    bio_meta={bio_meta}
                                                    peak_meta={peak_meta.find((x) => x.participant == file.participant)}
                                                    color={color}
                                                    biosignal={biosignal}
                                                    sketch={sketch}
                                                />
                                            })
                                        }
                                    </Container>
                                </Tab.Pane>
                            })
                        }
                    </Tab.Content>
                </ViewContext.Provider>
            </Row>
        </Tab.Container>
    );

    // return(<></>);
}

export default function Visualization(){
    // This component is essentially a data fetching wrapper
    let {thematicName, axisID, episodeID} = useParams();
    const [response, setResponse] = useState(null);
    // This runs just once, when the component renders
    useEffect(() => {
        console.log('in useEffect');
        fetchSceneMaterial(thematicName, axisID, episodeID)
            .then((ret) => {
                setResponse(ret);
            })
            .catch((err) => console.error(err));
    }, []);

    return(<>{response && <VisualizationLayout sonification_prefix={`/${thematicName}/axes/${axisID}/episodes/${episodeID}/sonifications`} response={response}/>}</>);
}
