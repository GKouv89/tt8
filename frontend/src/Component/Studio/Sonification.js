import { useEffect, useState } from 'react';

import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import BiosignalToggle from './BiosignalToggle';
import { ButtonGroup, ToggleButton } from 'react-bootstrap';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Form from 'react-bootstrap/Form';

import { useContext } from 'react';
import { ParticipantContext } from '../../context/ParticipantContext';
import { CleanupContext } from '../../context/CleanupContext';

import { ReactP5Wrapper } from 'react-p5-wrapper';

import * as son from '../../sketches/newSketches/sonificationSketch.js';
import { useNavigate, useParams } from 'react-router-dom';
import { ReminderContext } from '../../context/ReminderContext';

function PlaybackRecToasts(){
    const toasts = [
        {
            'key': 0, 
            'heading': 'Playback' ,
            'variant': 'warning',
            'body': 'Playback is paused when the current browser tab is switched or minimized. \
                    This limitation, if not enforced, would give a false duration to the playbacks and recordings\
                    produced, due to most browsers\' power saving settings.'
        },
        {
            'key': 1, 
            'heading': 'Pause when recording' ,
            'variant': 'info',
            'body': 'You can freely pause when recording, but the pause won\'t be audible in the sound file produced!\
                    This allows us to keep recording your sound file even if you accidentaly switch tabs or minimize your browser.'
        },
    ];

    const {showReminders} = useContext(ReminderContext);
    const [visibleToasts, setVisibleToasts] = useState(toasts.map((toast) => {return parseInt(toast.key)}));
    
    return(
        <>
            {
                showReminders ? 
                    <ToastContainer>
                        {
                            toasts.map((toast) => 
                                (<Toast 
                                    key={toast.key} 
                                    show={visibleToasts.includes(toast.key)} 
                                    bg={toast.variant} 
                                    onClose={() => {
                                        setVisibleToasts(
                                            visibleToasts.filter(t =>
                                                t !== toast.key
                                            )
                                        );
                                    }}>
                                    <Toast.Header style={{'justifyContent': 'space-between'}}>
                                        <strong>{toast.heading}</strong>
                                    </Toast.Header>
                                    <Toast.Body>
                                        <small>{toast.body}</small>
                                    </Toast.Body>
                                </Toast>
                            ))
                        }
                    </ToastContainer>
                : <></> 
            }
        </>
    );
}

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
    // setSound('sine');

    const oscillators = [
        {name: 'Sine', value: 'sine'},
        {name: 'Square', value: 'square'},
        {name: 'Sawtooth', value: 'sawtooth'},
        {name: 'Triangle', value: 'triangle'},
    ];

    return(
        <Row>
            <Col xs={'auto'}>
                <h3>Oscillators:</h3>
            </Col>
            <Col xs={'auto'}>
                <ButtonGroup>
                    {oscillators.map((osc, idx) => (
                        <ToggleButton
                            key={idx}
                            id={`osc-radio-${idx}`}
                            type="radio"
                            name="oscRadio"
                            value={osc.value}
                            checked={sound === osc.value}
                            onChange={(e) => {setSound(e.currentTarget.value);}}
                            // disabled={playing}
                        >
                            {osc.name}
                        </ToggleButton>            
                    ))}
                </ButtonGroup>
            </Col>
        </Row>
    );
}

function PlayerGUI({biosignal, setBiosignal, sound, setSound, playing, setPlaying, canStop, setCanStop, toReset, setToReset, recording, setRecording, download, setDownload}){
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
        <Col xs={6}>
            <Container>
                <Row>
                    <Col xs={'auto'}>
                        <h2>Choose Biosignal</h2>
                    </Col>
                </Row>
                <Row>
                    <Col xs={'auto'}>
                        <BiosignalToggle biosignal={biosignal} callback={callback}/>
                    </Col>
                </Row>
                <Row>
                    <Col xs={'auto'}>
                        <h2>Choose your sound</h2>
                    </Col>
                </Row>
                {biosignal === 'HR' ? <HeartRateGUI sound={sound} setSound={setSound}/> : <GSRTempGUI sound={sound} setSound={setSound}/>}
                <hr></hr>
                <Stack gap={3}>
                    <Row>
                        <Col xs={'auto'}>
                            <Button
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
                                disabled={!canStop}
                                onClick={() => {
                                    // If the sonification is stopped from the click of this button,
                                    // then the sketch must be 'notified' to clean up the sonification.
                                    // (stop the sound, perhaps a running recording and what not)
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
                                onClick={() => setRecording(!recording)}
                            ><i class="bi bi-record-fill" style={{color: recording ? 'red' : 'white'}}></i></Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={'auto'}>
                            <Button 
                                disabled={download === 'empty'}
                                onClick={() => setDownload('downloading')}
                            >
                                <i class="bi bi-download"></i>  
                                &nbsp;Download Recording
                            </Button>
                        </Col>
                        <Col xs={'auto'}>
                            <Button 
                                variant="outline-dark" 
                                disabled={download === 'empty'}
                                onClick={() => {setDownload('empty')}}
                            >
                                <i class="bi bi-trash3"></i>
                            </Button>
                        </Col>
                    </Row>
                </Stack>
            </Container>
        </Col>
    );
}

function Sketch({playing, setPlaying, ...props}){ 
    // the parameters are packed into an object
    // which the sketch uses to name the downloaded WAV files appropriately
    const {thematicID, sessionID, episodeID, participantID} = useParams();
    const namingData = {
        'thematicID': thematicID,
        'sessionID': sessionID,
        'episodeID': episodeID,
        'participant': participantID
    }

    const navigate = useNavigate();
    
    const {participant, data, setParticipant} = useContext(ParticipantContext);

    // This state variable was used to avoid a possible race condition
    // when the sketch wrapper directly accepted the data variable as a prop.
    const [file, _] = useState(participant ? data.find(element => element.participant === participant).path : null);

    const {cleanUp, setCleanUp, cleanUpPath} = useContext(CleanupContext);

    function cleanUpCode(){
        setParticipant(null); 
        setCleanUp(false);
        // once we're done cleaning up, navigate back to the proper component
        navigate(cleanUpPath);
    }

    return(
        <>
            <h2>Participant {participant}</h2>
            {file && <ReactP5Wrapper 
                {...props}
                sketch={son.sketch} 
                file={file} 
                toPlay={playing}
                setToPlay={setPlaying}
                cleanUp={cleanUp} 
                cleanUpCode={cleanUpCode}
                namingData = {namingData}
            />}
        </>
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

function ShowToastsToggle(){
    const {showReminders, setShowReminders} = useContext(ReminderContext);

    return (
        <Form>
          <Form.Switch 
            label="Show reminders."
            checked={showReminders}
            onChange={() => {
                setShowReminders(!showReminders);
            }}
          />
        </Form>
      );
}

function Player(){
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

    const [recording, setRecording] = useState(false);

    // Possible state values
    // empty (means that download and clear button are disabled)
    // available (makes download and clear button available)
    // downloading (becomes active on click)
    const [download, setDownload] = useState('empty');

    const stopSonificationCallback = () => {
        // This is called either on the click of the stop Button
        // or when the sonification naturally ends inside the sketch after
        // running its complete course (passed as a callback, hence the name).
        setPlaying(false);
        setCanStop(false);
    }

    return(
        <Row>
            <Col xs={6}>
                <Stack gap={3}>
                    <SketchAndProgress 
                        biosignal={biosignal}
                        sound={sound}
                        playing={playing}
                        setPlaying={setPlaying}
                        toReset={toReset}
                        setToReset={setToReset}
                        stopSonificationCallback={stopSonificationCallback}
                        recording={recording}
                        setRecording={setRecording}
                        download={download}
                        setDownload={setDownload}
                    />
                </Stack>
            </Col>
            <PlayerGUI 
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
                recording={recording}
                setRecording={setRecording}
                download={download}
                setDownload={setDownload}
            />
        </Row>
    )
}

export default function Sonification(){
    const {setCleanUp, setCleanUpPath} = useContext(CleanupContext);

    const [showReminders, setShowReminders] = useState((window.localStorage.showToasts === 'true'));
    
    if(window.localStorage.getItem("showToasts") === null){
        window.localStorage.setItem("showToasts", true);        
        setShowReminders(true);
    }else{
        window.localStorage.setItem("showToasts", showReminders);
    }

    return (
        <>
            <ReminderContext.Provider value={{showReminders, setShowReminders}}>
                <PlaybackRecToasts />
                <Container fluid>
                    <Row style={{'justify-content': 'space-between'}}>
                        <Col xs={'auto'}>
                            <Button 
                                onClick={() => {
                                    setCleanUpPath('../visualizations');
                                    setCleanUp(true);
                                }}>
                                <i class="bi bi-arrow-left"></i>
                                &nbsp; Back to collective visualization
                            </Button>
                        </Col>
                        <Col xs={'auto'}>
                            <ShowToastsToggle />
                        </Col>
                    </Row>
                    <Player />
                </Container>
            </ReminderContext.Provider>
        </>
    );
}