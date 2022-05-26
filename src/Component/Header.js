import React, { useState, useEffect } from 'react';
import { useParams , useLocation} from 'react-router-dom'

import Navbar from 'react-bootstrap/Navbar'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import LinkContainer from 'react-router-bootstrap/LinkContainer';

function ButtonLogo() {
    return (
        <Container fluid>
            <Container className="flex-column">
                <Row className="g0 flex-fill">
                    <Col xs={5} className="d-flex flex-fill" >
                        <Button variant="logobutton-top"/>
                    </Col>
                    <Col xs={5} className="d-flex flex-fill" >
                        <Button variant="logobutton-top"/>
                    </Col>
                    <Col xs={2} className="d-flex flex-fill" >
                        <Row className="g0 flex-fill">
                            <Col xs={2}  className="d-flex flex-fill">
                            </Col>
                            <Col xs={8}  className="d-flex flex-fill">
                                <Button variant="logobutton-rounded"/>                                    
                            </Col>
                            <Col xs={2}  className="d-flex flex-fill">
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row className="g0 flex-fill">
                    <Col xs={5} className="d-flex flex-fill" >
                        <Row className="g0 flex-fill">
                            <Col xs={3} className="d-flex flex-fill">
                            </Col>
                            <Col xs={6} className="d-flex flex-fill">
                                <Button variant="logobutton-bottom"/>                                    
                            </Col>
                            <Col xs={3} className="d-flex flex-fill">
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={5} className="d-flex flex-fill" >
                        <Row className="g0 flex-fill">
                            <Col xs={3} className="d-flex flex-fill">
                            </Col>
                            <Col xs={6} className="d-flex flex-fill">
                                <Button variant="logobutton-bottom"/>                                    
                            </Col>
                            <Col xs={3} className="d-flex flex-fill">
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={2} className="d-flex flex-fill" >
                        <Row className="g0 flex-fill">
                            <Col xs={2} className="d-flex flex-fill">
                            </Col>
                            <Col xs={8} className="d-flex flex-fill">
                                <Button variant="logobutton-rounded"/>                                    
                            </Col>
                            <Col xs={2} className="d-flex flex-fill">
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </Container>

    );
}

export default function Header () {
    // let params = useParams();
    // let classNameId = 0;    
    // if(Object.keys(params).length){
    //     console.log(params);
    // }

    // let location = useLocation();

    // useEffect(() => {
    //     console.log(location);
    //     console.log(params);
    // });

    return (
        <>
            <LinkContainer to="/">
                <Navbar className="thematic0" expand="lg">
                    <ButtonLogo />
                </Navbar>
            </LinkContainer>
        </>
    );
}