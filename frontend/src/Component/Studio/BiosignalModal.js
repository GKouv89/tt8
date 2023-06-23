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
                general: ``,
                average: ``
            }
        },
    GSR: {
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
                general: ``,
                average: ``
            }
        }
}

export function BiosignalModal(props)
{
    const [biosignal, setBiosignal] = useState('GSR');
    const [info, setInfo] = useState('general');

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
                            <BiosignalToggle biosignal={biosignal} prefix='information' callback={setBiosignal}/>
                        </Col>
                    </Row>
                    <Row className='pb-1'>
                        <Col xs={'auto'}>
                            <ButtonGroup>
                                <ToggleButton 
                                    value={'general'}
                                    variant={'dark'}
                                    type='radio'
                                    id={'info-type-radio-1'}
                                    name={'info-type-radio'}
                                    checked={info === 'general'}
                                    onChange={(e) => setInfo(e.currentTarget.value)}
                                >
                                    General
                                </ToggleButton>
                                <ToggleButton 
                                    value={'average'}
                                    variant={'dark'}
                                    type='radio'
                                    id={'info-type-radio-2'}
                                    name={'info-type-radio'}
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