import React, { useState } from 'react';
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import LinkContainer from 'react-router-bootstrap/LinkContainer';
import { useParams } from 'react-router-dom';

function CustomToggle({ children, eventKey, class_id, handleClick, activeKey}) {
  const decoratedOnClick = useAccordionButton(eventKey, () => {
      handleClick(eventKey);
    }
  );
  return (
    <Button 
      size="lg" 
      variant={(activeKey == eventKey) ? "thematic" + class_id + " stressed": "thematic" + class_id}
      onClick={decoratedOnClick}
      className="w-100 d-flex justify-content-between align-items-center"
    >
      <span>{children}</span>
      <i className={`bi ${(activeKey == eventKey) ? "bi-x-lg" : "bi-plus-lg"}`}></i>
    </Button>
  );
}

export default function Thematic(props){ 
  const {cityName, _} = useParams();
  const learnMoreUrl = `${process.env.REACT_APP_MENTOR_BASE_URL}` + cityName.toLowerCase() + `/` + props.thematic.name.toLowerCase();
  return( 
    <Card className={`border-0 shadow-sm thematic${props.thematicColorId}`} >
      <Card.Header className={`p-3 thematic${props.thematicColorId}`}>
        <CustomToggle 
          eventKey={props.eventKey} 
          class_id={props.thematicColorId} 
          handleClick={props.handleClick} 
          activeKey={props.activeKey}
        >
          {props.thematic.name}
        </CustomToggle>
      </Card.Header>
      
      <Accordion.Collapse eventKey={props.eventKey}>
        <Card.Body className='p-4'>
          <Container fluid>            
            <Row className="align-items-center">
              <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                <p className="mb-0 text-muted">
                  {props.thematic.description != null ? props.thematic.description : 'Oops! Descriptions will be available shortly'}
                </p>
                <div className="mt-3">
                  <small className="text-muted">
                    <a href={learnMoreUrl} target="_blank" rel="noopener noreferrer">Learn More</a>
                  </small>
                </div>
              </Col>
              <Col xs={4} sm={4} md={4} lg={4} xl={4} className="text-end">
                <LinkContainer to={`${props.thematic.name}`}>
                  <Button variant="outline-dark" className="px-4 border-2">
                    Browse Scenes by Axis
                  </Button>
                </LinkContainer>
              </Col>
            </Row>
          </Container>
        </Card.Body>
      </Accordion.Collapse>
    </Card>
  );
}