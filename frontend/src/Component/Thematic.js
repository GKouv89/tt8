import React, { useState } from 'react';

import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import LinkContainer from 'react-router-bootstrap/LinkContainer';

function CustomToggle({ children, eventKey, class_id, handleClick, activeKey}) {
  const decoratedOnClick = useAccordionButton(eventKey, () => {
      handleClick(eventKey);
    }
  );
  return (
    <Button size="lg" variant={ (activeKey == eventKey) ? "thematic" + class_id + " stressed": "thematic" + class_id}
    onClick={decoratedOnClick}>
      {children}
      {
        (activeKey == eventKey) ? <i className="bi bi-x-lg"></i> : <i className="bi bi-plus-lg"></i>
      }
    </Button>
  );
}

export default function Thematic(props){ 
  // console.log("hostname: " + );
  return(
    <Card className={"flex-fill thematic" + props.thematic._id} >
      <Card.Header as="div" className={"thematic" + props.thematic._id}>
        <Container fluid>
          <Row className="g0 align-items-start">
            <Col xxl={3}>
              <CustomToggle eventKey={props.eventKey} class_id={props.thematic._id} handleClick={props.handleClick} activeKey={props.activeKey}>{props.thematic.name}</CustomToggle>
            </Col>
          </Row>
        </Container>
      </Card.Header>
      <Accordion.Collapse eventKey={props.eventKey}>
        <Card.Body>
          <Container fluid>
            <Row>
              <Col xxl={6}>
                <Row className="h-100">
                  <Col xxl={12} className="align-self-center">
                    {props.thematic.desc}
                  </Col>
                  <Col xxl={12} className="align-self-center">
                    <LinkContainer to={`${props.thematic._id}`}>
                      <Button size="lg" variant="dark">Περισσότερα</Button>
                    </LinkContainer>
                  </Col>
                </Row>
               </Col>
               <Col xxl={6}>
                 <img src={props.thematic.img_path} width={"100%"} alt="Thematic Picture"/>
               </Col>
            </Row>
          </Container>
        </Card.Body>
      </Accordion.Collapse>
    </Card>
  );
}