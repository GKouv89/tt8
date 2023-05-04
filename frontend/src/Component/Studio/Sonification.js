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

function HeartRateGUI() {
    const [asset, setAsset] = useState('heart');

    const sounds = [
        {name: 'Heart Sound', value: 'heart'},
        {name: 'Drum Kick', value: 'drum'},
    ];

    const {setSound} = useContext(SoundContext);

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

    const {setSound} = useContext(SoundContext);

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
    const [biosignal, setBiosignal] = useState('HR');
    const {participant} = useContext(ParticipantContext);
    const [sound, setSound] = useState(null);

    useEffect(() => {
        console.log('sound: ', sound);
    }, [sound]);

    return(
        <>
            <Col xs={6}>
                <Stack gap={3}>
                    <h2>Participant {participant}</h2>
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
                    <SoundContext.Provider value={{sound, setSound}}>
                        {biosignal === 'HR' ? <HeartRateGUI /> : <GSRTempGUI />}
                    </SoundContext.Provider>
                    <hr></hr>
                    <Stack gap={3}>
                        <Row>
                            <Col xs={'auto'}>
                                <Button><i class="bi bi-play-fill"></i></Button>
                            </Col>
                            <Col xs={'auto'}>
                                <Button><i class="bi bi-pause-fill"></i></Button>
                            </Col>
                            <Col xs={'auto'}>
                                <Button><i class="bi bi-stop-fill"></i></Button>
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