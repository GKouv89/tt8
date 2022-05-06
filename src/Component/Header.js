import React, { useState } from 'react';
import Navbar from 'react-bootstrap/Navbar'
import Offcanvas from 'react-bootstrap/Offcanvas';
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import logo from '../assets/logo.png'

export default function Header () {
    const [show, setShow] = useState(false);
          
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <Navbar bg="light" expand="lg">
            <Container fluid>
                <Navbar.Brand href="#home">
                    <img src={logo} alt="Logo of Transition to 8" width="25%" height="25%" className="d-inline-block" style={{float: 'left'}}/>
                </Navbar.Brand>                
                {/* <Navbar.Toggle aria-controls="offcanvasNavbar-expand-false" /> */}
                <Button variant="primary" onClick={handleShow}>
                </Button>      
                <Offcanvas show={show} onHide={handleClose} placement='end'>
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>Offcanvas</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        Some text as placeholder. In real life you can have the elements you
                        have chosen. Like, text, images, lists, etc.
                    </Offcanvas.Body>
                </Offcanvas>
            </Container>
        </Navbar>
    );
}