import React from 'react';

import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import LinkContainer from 'react-router-bootstrap/LinkContainer';

export function OldThematic(props) {
  return (
      <Accordion.Item eventKey={props.eventKey} className="flex-fill">
        <Accordion.Header>
          <Accordion.Button className="thematic-header">
            {props.thematic.name}
          </Accordion.Button>        
        </Accordion.Header>
        <Accordion.Body>
          <Container fluid>
            <Row>
              <Col xxl={6}>
                <Row className="h-100">
                  <Col xxl={12} className="align-self-center">
                    {props.thematic.desc}
                  </Col>
                  <Col xxl={12} className="align-self-center">
                    <Button size="lg" variant="dark">Περισσότερα</Button>
                  </Col>
                </Row>
              </Col>
              <Col xxl={6}>
                <img src={props.thematic.img_path} width={"100%"} alt="Thematic Picture"/>
              </Col>
            </Row>
          </Container>
        </Accordion.Body>
      </Accordion.Item>
  );
}

function CustomToggle({ children, eventKey, class_id }) {
  const decoratedOnClick = useAccordionButton(eventKey, () =>
    console.log('totally custom!')
  );
  console.log(class_id)
  return (
    <Button size="lg" variant="thematic1"
    onClick={decoratedOnClick}>
    {children}
    </Button>
  );
}


export default function Thematic(props){ 
  return(
    <Card className="flex-fill">
      <Card.Header as="div" style={{ backgroundColor: "white", borderColor:"white"}}>
        <Container fluid>
          <Row className="g0 align-items-start">
            <Col xxl={2}>
              <CustomToggle eventKey={props.eventKey} class_id={props.thematic._id}>{props.thematic.name}</CustomToggle>
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