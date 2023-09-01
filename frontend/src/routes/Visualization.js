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
import { BiosignalInfoModal } from '../Component/BiosignalInfoModal.js';

import * as graph from '../sketches/newSketches/graphSketch.js';
import * as gradient from '../sketches/newSketches/colorVisSketch.js';
import { ViewContext } from '../context/ViewContext.js'
import { Link, useParams } from 'react-router-dom';

import { fetchSceneMaterial } from '../api/calls.js';
import { GeneralInfoModal } from '../Component/GeneralInfoModal.js';

function VisualizationRow({sketch, id, sonification_link, biosignal, ...props}){
    const {thematicName, axisID, episodeID} = useParams();
    const {view} = useContext(ViewContext);
    const fileName = `${thematicName}_Axis${axisID}_Episode${episodeID}_Participant${id}.csv`;

    // TO DO: EDIT so it can work with TWO FILES
    // OR DISCUSS WITH GIRLS ON WHAT TO DO
    const downloadFile = () => {
        const a = document.createElement('a');
        a.download = fileName;
        a.href = props.files;
        a.textContent = 'download the participant\'s raw data';
        document.body.appendChild(a);
        a.click();
        a.remove();
    }

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
                <Container 
                    fluid
                    className="flex-direction-column"
                >
                    <Row className='justify-content-center my-1'>
                        <Col xs={'auto'}>
                            <Link to={sonification_link}>
                                <Button 
                                    variant='dark'
                                >
                                    <i class="bi bi-volume-up-fill">&nbsp;Sonify</i>
                                </Button>
                            </Link>
                        </Col>
                    </Row>
                    <Row className='justify-content-center my-1'>
                        <Col xs={'auto'}>
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
    );
}

const visualizations = {
    title: 'What am I seeing?', 
    size: 'lg',
    general: <>
        <p>
            Here, you can see how the biosignals of a participant in a certain episode changed during an episode. 
        </p>
        <p>
        Each scene is part of a greater task that the sociodramatists assigned to the participants. A scene is a part of a
            task where intense biometric activity occured for one or more participants, in one or more biometrics. You can either choose to view
            the scene's data in the context of the task they're a part of (in which case, the scene's data is highlighted),
            or you can choose to zoom in on the scene's data.
        </p>
        <p>
            Two distinct ways of visualizing these changes are offered. Click on the buttons below to learn more.
        </p>
    </>,
    options: [
        {
            name: 'graph', 
            title: 'Graphs', 
            description: 
                <p>
                    A standard mathematical plot that shows how each participant's biometrics changed during a task or scene.
                    The colors of the lines have the following meaning:
                    <ul>
                        <li>
                            A blue line denotes data from the task that does not belong in the scene.
                        </li>
                        <li>A pink line denotes data from the scene, for a participant that does not have intense biometric activity.</li>
                        <li>A red line denotes data from the scene, for a participant that <em>does have</em> intense biometric activity.</li>
                    </ul>
                </p>}
        ,
        {
            name: 'color', 
            title: 'Color gradients',
            description: 
                <>
                    <p>
                        This more artistic representation is equivalent to the graph.
                        The length of each image from left to right represents time. The changes in the color's brightness
                        represent a change in the biosignal's measurement. A lighter shade represents a higher value, while
                        the darker the color, the lower the value.                    
                    </p>
                    <p>
                        When viewing the entire task's data, the part of the visualization that corresponds to the scene is surrounded
                        by two white lines.
                    </p>
                </>
        }
    ]
}

function VisualizationLayout({sonification_prefix, response}){
    const [biosignal, setBiosignal] = useState('HR');
    const [active, setActive] = useState('graph');
    const [view, setView] = useState(response.scene.is_superepisode ? 'task' : 'scene');
    // BiosignalInfoModal is the first of the array
    // VisualizationInfo is the second
    const [showModal, setShowModal] = useState([false, false]);

    const color = response.color;
    const {peak_meta, bio_meta, files, ...scene_meta} = response.scene;

    const content=[
        null,
        visualizations
    ]    

    const components = {
        BiosignalInfoModal,
        GeneralInfoModal
    };


    return(
        <Container fluid>
            {[...Array(2).keys()].map((a) => {
                const MyComponent = a === 0 ? components.BiosignalInfoModal : components.GeneralInfoModal;
                return (<MyComponent 
                    show={showModal[a]}
                    onHide={() => {
                        const newShowModal = showModal.map((modal, idx) => {
                            if(idx === a)
                                return false;
                            else
                                return modal;
                        });
                        setShowModal(newShowModal);
                    }}
                    content={content[a]}
                />);
            })}
            <Row className="justify-content-start">
                <Col xs={'auto'}>
                    <h2 class="h3">
                        Visualizations
                    </h2>
                </Col>
                <Col xs={'auto'}>
                    <Button 
                        variant='outline-dark'
                        onClick={() => {
                            const newShowModal = showModal.map((modal, idx) => {
                                if(idx === 1)
                                    return true;
                                else
                                    return modal;
                            });
                            setShowModal(newShowModal);
                        }}
                    >
                        <i class="bi bi-info-circle" /> What am I seeing?
                    </Button>
                </Col>
            </Row>
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
                                variant='outline-dark'
                                key={0}
                                id={`view-radio-0`}
                                type="radio"
                                name="view-radio"
                                value='task'
                                checked={view === 'task'}
                                onChange={(e) => {setView(e.currentTarget.value);}}
                                disabled={!scene_meta.is_superepisode}
                            >
                                Task
                            </ToggleButton>
                            <ToggleButton
                                variant='outline-dark'
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
                        <div class='vr'></div>
                    </Col>
                    <Col xs={'auto'}>
                        <BiosignalToggle biosignal={biosignal} callback={setBiosignal}/>
                    </Col>
                    <Col xs={'auto'}>
                        <Button
                            variant="dark"
                            onClick={() => {
                                const newShowModal = showModal.map((modal, idx) => {
                                    if(idx === 0)
                                        return true;
                                    else
                                        return modal;
                                });
                                setShowModal(newShowModal);
                            }}
                        >
                            <i class="bi bi-info-circle" />&nbsp; Learn More
                        </Button>
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
                                                        peak_meta={peak_meta===undefined ? undefined: peak_meta.find((x) => x.participant == file.participant)}
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
        </Container>
    );
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
