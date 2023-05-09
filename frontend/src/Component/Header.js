// import React from 'react';
import { Outlet, matchPath, useLocation, useNavigate } from 'react-router-dom'

import Navbar from 'react-bootstrap/Navbar'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Breadcrumb from './Breadcrumbs';
import { useContext } from 'react';

import { CleanupContext } from '../context/CleanupContext'

function ButtonLogo() {
    return (
        <Container fluid>
            <Container className="flex-column">
                <Row className="g0 flex-fill">
                    <Col xs={5} className="d-flex flex-fill" >
                        <Button 
                            variant="logobutton-top"
                        />
                    </Col>
                    <Col xs={5} className="d-flex flex-fill" >
                        <Button 
                            variant="logobutton-top"
                        />
                    </Col>
                    <Col xs={2} className="d-flex flex-fill" >
                        <Row className="g0 flex-fill">
                            <Col xs={2}  className="d-flex flex-fill">
                            </Col>
                            <Col xs={8}  className="d-flex flex-fill">
                                <Button 
                                    variant="logobutton-rounded"
                                />                                    
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
                                <Button 
                                    variant="logobutton-bottom"
                                />                                    
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
                                <Button 
                                    variant="logobutton-bottom"
                                />                                    
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
                                <Button 
                                    variant="logobutton-rounded"
                                />                                    
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
    const navigate = useNavigate();
    const {setCleanUp, setCleanUpPath} = useContext(CleanupContext);
    const matchPathResult = matchPath(
    {       
        path: ":thematicID/sessions/:sessionID/episodes/:episodeID/sonifications/:participantID",
    }, useLocation().pathname);
    
    function onClickHandler(){
        if(matchPathResult !== null){
            setCleanUpPath("/");
            setCleanUp(true);
        }else{
            navigate("/");
        }
    }

    return (
        <>
            <Navbar 
                className="thematic0" 
                expand="lg" 
                onClick={() => onClickHandler()}>
                <ButtonLogo/>
            </Navbar>
            <Breadcrumb />
            <Outlet />
        </>
    );
}
