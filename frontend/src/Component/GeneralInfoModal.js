import Modal from 'react-bootstrap/Modal'

import { Button, Container, ToggleButton, ButtonGroup } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { useState } from 'react';

export function GeneralInfoModal({title, content, prefix, ...props})
{
    const [info, setInfo] = useState(0);
    return( 
        <Modal
            {...props}
            size={content.size}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    {content.title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container 
                    fluid
                >
                    <Row className='pb-1'>
                        {content.general}
                    </Row>
                    <Row className='pb-1'>
                        <Col xs={'auto'}>
                            <ButtonGroup>
                                {content.options.map((c, idx) => (
                                    <ToggleButton
                                        value={c.name}
                                        variant={'dark'}
                                        type='radio'
                                        id={`${prefix}-type-radio-${idx}`}
                                        name={`${prefix}-type-radio`}
                                        checked={info === idx}
                                        onChange={(e) => setInfo(idx)}
                                    >
                                        {c.title}
                                    </ToggleButton>
                                ))}
                            </ButtonGroup>
                        </Col>
                    </Row>
                    <Row className='pb-1'>
                        <p>
                            {content.options[info].description}
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