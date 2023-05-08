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
import { useContext } from 'react';
import {ParticipantContext} from '../../context/ParticipantContext';
import { SoundContext } from '../../context/SoundContext';
import { ReactP5Wrapper } from 'react-p5-wrapper';

import * as son from '../../sketches/newSketches/sonificationSketch.js';

function PlaybackRecToasts(){
    const [showPlayToast, setShowPlayToast] = useState(true);
    const [showRecToast, setRecToast] = useState(true);

    return(
        <ToastContainer>
            <Toast key={0} show={showPlayToast} bg={'warning'} onClose={() =>setShowPlayToast(false)}>
                <Toast.Header style={{'justifyContent': 'space-between'}}>
                    <strong>Playback</strong>
                </Toast.Header>
                <Toast.Body>
                    <small>
                        Playback is paused when the current browser tab is switched or minimized.
                    </small>
                </Toast.Body>
            </Toast>
            <Toast key={1} show={showRecToast} onClose={() => setRecToast(false)} bg={'danger'}>
                <Toast.Header style={{'justifyContent': 'space-between'}}>
                    <strong>Recording</strong>
                </Toast.Header>
                <Toast.Body>
                    <small>
                        Recording is reset when the current browser tab is switched or minimized.
                        Don't worry, you can restart again.
                    </small>
                </Toast.Body>
            </Toast>
        </ToastContainer>
    );
}

function HeartRateGUI() {
    const [asset, setAsset] = useState('heart');

    const sounds = [
        {name: 'Heart Sound', value: 'heart'},
        {name: 'Drum Kick', value: 'drum'},
    ];

    const {setSound, playing} = useContext(SoundContext);

    // Setting default sound on component render.
    useEffect(() => {
        setSound('heart');
    }, []);

    useEffect(() => {
        setSound(asset);
    }, [asset]);

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
                            checked={asset === s.value}
                            onChange={(e) => {setAsset(e.currentTarget.value);}}
                            disabled={playing}
                        >
                            {s.name}
                        </ToggleButton>                            
                    ))}
                </ButtonGroup>
            </Col>
        </Row>
    );
}

function GSRTempGUI(){
    const [oscillator, setOscillator] = useState('sine');

    const oscillators = [
        {name: 'Sine', value: 'sine'},
        {name: 'Square', value: 'square'},
        {name: 'Sawtooth', value: 'sawtooth'},
        {name: 'Triangle', value: 'triangle'},
    ];

    const {setSound, playing} = useContext(SoundContext);

    // Setting default sound on component render.
    useEffect(() => {
        setSound('sine');
    }, []);

    useEffect(() => {
        setSound(oscillator);
    }, [oscillator]);

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
                            checked={oscillator === osc.value}
                            onChange={(e) => {setOscillator(e.currentTarget.value);}}
                            disabled={playing}
                        >
                            {osc.name}
                        </ToggleButton>            
                    ))}
                </ButtonGroup>
            </Col>
        </Row>
    );
}

function Player(){
    const {participant, data} = useContext(ParticipantContext);
    // This state variable was used to avoid a possible race condition
    // when the sketch wrapper directly accepted the data variable as a prop.
    const [file, setFile] = useState(data);

    // These props are related to the toggle button groups and
    // are also passed as props to the sketch, so it changes its sound appropriately.
    const [biosignal, setBiosignal] = useState('HR');
    const [sound, setSound] = useState(null);
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
    // const [recording, setRecording] = useState(false);

    const stopSonificationCallback = () => {
        // This is called either on the click of the stop Button
        // or when the sonification naturally ends inside the sketch after
        // running its complete course (passed as a callback, hence the name).
        setPlaying(false);
        setCanStop(false);
    }

    return(
        <>
            <Col xs={6}>
                <Stack gap={3}>
                    <h2>Participant {participant}</h2>
                    {file && <ReactP5Wrapper sketch={son.sketch} biosignal={biosignal} file={file} sound={sound} toPlay={playing} toReset={toReset} setToReset={setToReset} hasEnded={stopSonificationCallback}/>}
                </Stack>
            </Col>
            <Col xs={6}>
                <Container>
                    <Row>
                        <Col xs={'auto'}>
                            <h2>Choose Biosignal</h2>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={'auto'}>
                            <BiosignalToggle biosignal={biosignal} callback={setBiosignal}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={'auto'}>
                            <h2>Choose your sound</h2>
                        </Col>
                    </Row>
                    <SoundContext.Provider value={{sound, setSound, playing}}>
                        {biosignal === 'HR' ? <HeartRateGUI /> : <GSRTempGUI />}
                    </SoundContext.Provider>
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
                                >
                                    {!playing ? <i class="bi bi-play-fill"></i> : <i class="bi bi-pause-fill"></i>}
                                </Button>
                            </Col>
                            <Col xs={'auto'}>
                                <Button 
                                    disabled={!canStop}
                                    onClick={() => {
                                        stopSonificationCallback();
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
                                <Button><i class="bi bi-record-fill"></i></Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={'auto'}>
                                <Button>
                                    <i class="bi bi-download"></i>  
                                    &nbsp;Download Recording
                                </Button>
                            </Col>
                        </Row>
                    </Stack>
                </Container>
            </Col>
        </>
    )
}

export default function Sonification(){
    const {setParticipant, chooseData} = useContext(ParticipantContext);
    return (
        <>
            <PlaybackRecToasts />
            <Container fluid>
                <Row>
                    <Col xs={'auto'}>
                        <Button 
                            onClick={() => {setParticipant(null); chooseData(null);}}>
                            <i class="bi bi-arrow-left"></i>
                            &nbsp; Back to collective visualization
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Player />
                </Row>
            </Container>
        </>
    );
}