import { useState, useEffect } from 'react';

import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import BiosignalToggle from '../Component/BiosignalToggle.js';
import { ButtonGroup, ToggleButton } from 'react-bootstrap';
import ProgressBar from 'react-bootstrap/ProgressBar';

import { useContext } from 'react';
import { CleanupContext } from '../context/CleanupContext';

import { ReactP5Wrapper } from 'react-p5-wrapper';

import { thematics_alt } from './Thematics.js';

import * as son from '../sketches/newSketches/sonificationSketch.js';
import { useNavigate, useParams } from 'react-router-dom';
import { BiosignalInfoModal } from '../Component/BiosignalInfoModal.js';
import { GeneralInfoModal } from '../Component/GeneralInfoModal.js';
import { fetchParticipantInSceneMaterial } from '../api/calls.js';

const variant = "dark";

function HeartRateGUI({sound, setSound}) {
    const sounds = [
        {name: 'Heart Sound', value: 'heart'},
        {name: 'Drum Kick', value: 'drum'},
    ];

    return(
        <Row>
            <Col xs={'auto'}>
                <ButtonGroup>
                    {sounds.map((s, idx) => (
                        <ToggleButton
                            key={idx}
                            variant={variant}
                            id={`sound-radio-${idx}`}
                            type="radio"
                            name="soundRadio"
                            value={s.value}
                            checked={sound === s.value}
                            onChange={(e) => {setSound(e.currentTarget.value);}}
                        >
                            {s.name}
                        </ToggleButton>                            
                    ))}
                </ButtonGroup>
            </Col>
        </Row>
    );
}

function GSRTempGUI({sound, setSound}){
    const oscillators = [
        {name: 'Sine', value: 'sine'},
        {name: 'Square', value: 'square'},
        {name: 'Sawtooth', value: 'sawtooth'},
        {name: 'Triangle', value: 'triangle'},
    ];

    return(
        <Row>
            <Col xs={'auto'}>
                <h3 class='h4'>Oscillators:</h3>
            </Col>
            <Col xs={'auto'}>
                <ButtonGroup>
                    {oscillators.map((osc, idx) => (
                        <ToggleButton
                            key={idx}
                            variant={variant}
                            id={`osc-radio-${idx}`}
                            type="radio"
                            name="oscRadio"
                            value={osc.value}
                            checked={sound === osc.value}
                            onChange={(e) => {setSound(e.currentTarget.value);}}
                        >
                            {osc.name}
                        </ToggleButton>            
                    ))}
                </ButtonGroup>
            </Col>
        </Row>
    );
}

function PlayerGUI({modalCallback, file, biosignal, setBiosignal, sound, setSound, playing, setPlaying, canStop, setCanStop, toReset, setToReset, setDownloadRequested}){
    const {thematicName, axisID, episodeID, participantID} = useParams();

    const fileName = `${thematicName}_Axis${axisID}_Episode${episodeID}_Participant${participantID}.csv`;
    
    const downloadFile = () => {
        const a = document.createElement('a');
        a.download = fileName;
        a.href = file;
        a.textContent = 'download the participant\'s raw data';
        document.body.appendChild(a);
        a.click();
        a.remove();
    }

    const callback = (val) => {
        const old_biosignal = biosignal;
        setBiosignal(val);
        if(old_biosignal !== 'HR' && val !== 'HR'){
            // When changing between GSR and Temperature,
            // there is no reason to change the type of the oscillator
            return;
        }
        if(val == 'HR'){
            setSound('heart');
        }else{
            setSound('sine');
        }
    }

    return(
        <>
            <Col xs={6}>
                <Container>
                    <Row>
                        <Col xs={'auto'}>
                            <h2 class='h3'>Choose Biosignal</h2>
                        </Col>
                    </Row>
                    <Row className='pb-2'>
                        <Col xs={'auto'}>
                            <BiosignalToggle biosignal={biosignal} callback={callback}/>
                        </Col>
                        <Col xs={'auto'}>
                            <Button
                                variant="dark"
                                onClick={modalCallback}
                            >
                                <i class="bi bi-info-circle" />&nbsp; Learn More
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={'auto'}>
                            <h2 class='h3'>Choose your sound</h2>
                        </Col>
                    </Row>
                    {biosignal === 'HR' ? <HeartRateGUI sound={sound} setSound={setSound}/> : <GSRTempGUI sound={sound} setSound={setSound}/>}
                    <hr></hr>
                    <Stack gap={3}>
                        <Row>
                            <Col xs={'auto'}>
                                <Button
                                    variant={variant}
                                    onClick={() => {
                                        if(!playing){
                                            setCanStop(true);
                                        }
                                        setPlaying(!playing);
                                    }}
                                    // disabled when toReset is true makes sure there won't be a race condition
                                    // when the sketch is cleaning up after itself.
                                    disabled={toReset}
                                >
                                    {!playing ? <i class="bi bi-play-fill"></i> : <i class="bi bi-pause-fill"></i>}
                                </Button>
                            </Col>
                            <Col xs={'auto'}>
                                <Button 
                                    variant={variant}
                                    disabled={!canStop}
                                    onClick={() => {
                                        // If the sonification is stopped from the click of this button,
                                        // then the sketch must be 'notified' to clean up the sonification.
                                        // (stop the sound)
                                        // If the sonification were to naturally end, the reset state variable
                                        // need not be modified.
                                        setToReset(true);
                                    }}
                                >
                                    <i class="bi bi-stop-fill"></i>
                                </Button>
                            </Col>
                            <Col xs={'auto'}>
                                <Button 
                                    variant={variant}
                                    onClick={() => setDownloadRequested(true)}
                                >
                                    <i class="bi bi-download"></i>  
                                    {/* &nbsp;{sound.charAt(0).toUpperCase() + sound.slice(1)} sound (WAV) */}
                                    &nbsp; Current sonification (WAV)
                                </Button>
                            </Col>
                            <Col xs={'auto'}>
                                {/* <Button
                                    variant={variant}
                                    onClick={() => downloadFile()}
                                >
                                    <i class="bi bi-download"></i>
                                    &nbsp;Raw
                                </Button> */}
                                <Button
                                    variant={variant}
                                    onClick={() => downloadFile()}
                                >
                                    <i class="bi bi-filetype-csv">&nbsp;Data</i>
                                </Button>
                            </Col>
                        </Row>
                    </Stack>
                </Container>
            </Col>
        </>
    );
}

function Sketch({playing, setPlaying, ...props}){ 
    // the parameters are packed into an object
    // which the sketch uses to name the downloaded WAV files appropriately
    const {thematicName, axisID, episodeID, participantID} = useParams();
    const namingData = {
        'thematicID': thematicName,
        'axisID': axisID,
        'episodeID': episodeID,
        'participant': participantID
    }

    const navigate = useNavigate();
    
    const {cleanUp, setCleanUp, cleanUpPath} = useContext(CleanupContext);
    function cleanUpCode(){
        setCleanUp(false);
        // once we're done cleaning up, navigate back to the proper component
        navigate(cleanUpPath);
    }

    return(
        <ReactP5Wrapper 
            {...props}
            sketch={son.sketch} 
            toPlay={playing}
            setToPlay={setPlaying}
            cleanUp={cleanUp} 
            cleanUpCode={cleanUpCode}
            namingData = {namingData}
        />
    );
}

function Progress({progress}){
    return(
        <ProgressBar id="progress-bar" now={progress} />
    );
}

function SketchAndProgress(props){
    
    // This is the percentage of the progress bar
    const [progress, setProgress] = useState(0);
    
    return(
        <>
            <Sketch
                {...props}
                setProgress={setProgress}
            />
            <Progress progress={progress}/>
        </>
    );
}


function Player({modalCallback}){
    const {thematicName, axisID, episodeID, participantID} = useParams();
    
    // These props are related to the toggle button groups and
    // are also passed as props to the sketch, so it changes its sound appropriately.
    const [biosignal, setBiosignal] = useState('HR');
    const [sound, setSound] = useState('heart');
    
    // These props control the playback buttons appearance and act as 'signals' to the
    // sketch to start, pause and stop playback.
    const [playing, setPlaying] = useState(false);    
    
    // 'Can stop' indicates that the sonification has at some point started and is either
    // a) actively playing or b) paused. In these two cases, the stop button should be available. 
    const [canStop, setCanStop] = useState(false);
    // This indicator lets the sketch know that the stop button was clicked
    // and it should stop all sonification activities immediately.
    // The setToReset state setter is also passed as a prop, so that the sketch
    // can 'notify' the component of the successful halt of the sonification.
    const [toReset, setToReset] = useState(false);

    // When user clicks download button, the sketch must receive a notification
    // to prepare the offline buffer, encode the file, and download. 
    const [downloadRequested, setDownloadRequested] = useState(false);

    const stopSonificationCallback = () => {
        // This is called either on the click of the stop Button
        // or when the sonification naturally ends inside the sketch after
        // running its complete course (passed as a callback, hence the name).
        setPlaying(false);
        setCanStop(false);
    }

    const [file, setFile] = useState(null);
    // This runs just once, when the component renders
    useEffect(() => {
        console.log('in useEffect');
        fetchParticipantInSceneMaterial(thematicName, axisID, episodeID, participantID)
            .then((ret) => {
                setFile(ret.path);
            })
            .catch((err) => console.error(err));
    }, []);

    return(
        <Row>
            <Col xs={6} id='playerContainer'>
                <Stack gap={3}>
                    {
                        file && <SketchAndProgress 
                            biosignal={biosignal}
                            sound={sound}
                            playing={playing}
                            setPlaying={setPlaying}
                            toReset={toReset}
                            setToReset={setToReset}
                            stopSonificationCallback={stopSonificationCallback}
                            downloadRequested={downloadRequested}
                            setDownloadRequested={setDownloadRequested}
                            file={file}
                        />
                    }
                </Stack>
            </Col>
            {
                file && <PlayerGUI 
                    file={file}
                    biosignal={biosignal}
                    setBiosignal={setBiosignal}
                    sound={sound}
                    setSound={setSound}
                    playing={playing}
                    setPlaying={setPlaying}
                    canStop={canStop}
                    setCanStop={setCanStop}
                    toReset={toReset}
                    setToReset={setToReset}
                    setDownloadRequested={setDownloadRequested}
                    modalCallback={modalCallback}
                />
            }
        </Row>
    )
}

const sonifications = {
    title: 'What am I hearing?', 
    general: `The measured data are used to produce changes in the sound you're hearing. The duration of the 
    sonification is roughly equivalent to the duration of the sociodrama episode, and the changes
    you're hearing happen at the same intervals they did during the episode.`,
    options: [
        {
            name: 'heart',
            title: 'Heart Sound',
            description: `The heart sound is playing on a loop, and becomes faster or slower according to the changes
                        in the participant's heart rate.`
        },
        {
            name: 'kick',
            title: 'Drum kick',
            description: `The kick produces the exact beats per minute of the heart rate's participant. It is an accurate
            representation of their heart rate.` 
        },
        {
            name: 'osc',
            title: 'GSR and Temperature',
            description: `These sounds change according to the measured signal to match a specific note. The higher the note,
            the higher the measured value, and vice versa. The notes are in C Major scale, so the result sounds more harmonic.` 
        }
    ]
    
}

const content=[
    null,
    sonifications
]

export default function Sonification(){
    const {setCleanUp, setCleanUpPath} = useContext(CleanupContext);
    const {thematicName, axisID, episodeID, participantID} = useParams();
    // BiosignalInfoModal is the first of the array
    // SonificationInfo is the second
    const [showModal, setShowModal] = useState([false, false]);

    const components = {
        BiosignalInfoModal,
        GeneralInfoModal
    };

    const url = `${process.env.REACT_APP_MENTOR_BASE_URL}${thematics_alt[thematicName]}/axis-${axisID}/episode-${episodeID}/`;

    return (
        <Container fluid>
            {[...Array(2).keys()].map((a) => {
                const MyComponent = a === 0 ? components.BiosignalInfoModal : components.GeneralInfoModal;
                console.log('MyComponent: ', MyComponent);
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
            <Row className="pb-2">
                <Col xs={'auto'}>
                    <Button 
                        variant={variant}
                        onClick={() => {
                            setCleanUpPath(`/${thematicName}/axes/${axisID}/episodes/${episodeID}/visualizations`);
                            setCleanUp(true);
                        }}>
                        <i class="bi bi-arrow-left"></i>
                        &nbsp; Back to collective visualization
                    </Button>
                </Col>
            </Row>
            <Row className="justify-content-start">
                <Col xs={'auto'}>
                    <h2 class="h3">
                        <a href={url} target="_blank">Axis {axisID} - Episode {episodeID}:</a>
                    </h2>
                </Col>
            </Row>
            <Row className="justify-content-start">
                <Col xs={'auto'}>
                    <h2 class="h3">
                        Participant {participantID} Biosignals' Sonification
                    </h2>
                </Col>
                <Col xs={'auto'}>
                    <Button
                        variant="outline-dark"
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
                        <i class="bi bi-info-circle" /> What am I hearing?
                    </Button>
                </Col>
            </Row>
            <Player
                modalCallback={() => {
                    const newShowModal = showModal.map((modal, idx) => {
                        if(idx === 0)
                            return true;
                        else
                            return modal;
                    });
                    setShowModal(newShowModal);
                }}
            />
        </Container>
    );
}