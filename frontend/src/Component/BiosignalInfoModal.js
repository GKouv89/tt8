import Modal from 'react-bootstrap/Modal'
import BiosignalToggle from './BiosignalToggle';
import { Button, Container, ToggleButton, ButtonGroup } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { useState } from 'react';

const biosignalDescriptions = {
    HR: {
            name: "Heart Rate",
            description: {
                general: `Heart Rate is the frequency of a person's heart beat, measured in beats per minute (BPM). 
                While a person's heart rate can increase for many reasons, a faster heart rate is often an indicator of anxiety and stress.`,
                average: `The normal resting (that is, not during or after exercise) heart rate for adults is between 60 and 100 (BPM).`
            }
        },
    SC: {
            name: "Galvanic Skin Response",
            description: {
                general: `Galvanic Skin Response (GSR) describes changes in the skin electrical properties. 
            GSR is a sensitive measure of the sympathetic nervous system activity, and is used in psychology
            to measure emotional responses such as anxiety, stress, and excitement.`,
                average: `The average measurement for GSR varies, however, a study conducted by Birmingham University 
            suggests that an average GSR measurement for a healthy adult is around 2-3 microsiemens (μS). 
            Generally, GSR can range between 1-20 μS.`
            }
        },
    Temp: 
        {
            name: 'Temperature',
            description: {
                general: `Corresponds to the measurement returned by any body thermometer.
                While many non-psychological factors can affect a person's temperature,
                studies have shown that stress can also increase body temperature, and may even 
                induce fever in some individuals. `,
                average: `A healthy adult's average body temperature ranges between 36.5 and 
                37.1 degrees Celcius (C). Note that the measurements here are from a sensor worn on the wrist. 
                Therefore, the measured values are lower than usual thermometer measurements. `
            }
        }
}

export function BiosignalInfoModal({...props})
{
    const [biosignal, setBiosignal] = useState('HR');
    const [info, setInfo] = useState('general');

    const biosignalCallback = (val) => {
        setBiosignal(val);
        setInfo('general');
    }

    return(
        <Modal
            {...props}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    More About Biosignals
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container 
                    fluid
                >
                    <Row className='pb-2'>
                        <Col xs={'auto'}>
                            <BiosignalToggle biosignal={biosignal} prefix='information' callback={biosignalCallback}/>
                        </Col>
                    </Row>
                    <Row className='pb-1'>
                        <Col xs={'auto'}>
                            <ButtonGroup>
                                <ToggleButton 
                                    value={'general'}
                                    variant={'dark'}
                                    type='radio'
                                    id={'bio-info-type-radio-1'}
                                    name={'bio-info-type-radio'}
                                    checked={info === 'general'}
                                    onChange={(e) => setInfo(e.currentTarget.value)}
                                >
                                    General
                                </ToggleButton>
                                <ToggleButton 
                                    value={'average'}
                                    variant={'dark'}
                                    type='radio'
                                    id={'bio-type-radio-2'}
                                    name={'bio-type-radio'}
                                    checked={info === 'average'}
                                    onChange={(e) => setInfo(e.currentTarget.value)}
                                >
                                    Average Values
                                </ToggleButton>
                            </ButtonGroup>
                        </Col>
                    </Row>
                    <Row className='pb-1'>
                        <p>
                            {
                                info == 'general' ? 
                                    biosignalDescriptions[biosignal]['description']['general'] 
                                    : 
                                    biosignalDescriptions[biosignal]['description']['average']
                            }
                        </p>
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant='dark'
                    onClick={props.onHide}
                >
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}