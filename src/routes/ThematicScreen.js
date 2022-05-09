import React, { useState } from 'react';
import Breadcrumb from 'react-bootstrap/Breadcrumb'
import { useParams } from 'react-router-dom'
import LinkContainer from 'react-router-bootstrap/LinkContainer'
import { getContentColors } from '../data'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Card from 'react-bootstrap/Card';
import ToggleButton from 'react-bootstrap/ToggleButton';
import { CardGroup } from 'react-bootstrap';


export default function ThematicScreen () {
  return (
    <>
      <Container fluid>
        <Row>
          <Col xxl="auto">
            <ABreadcrumb />
          </Col>
          <Col xxl="auto">
            <ColorFilter />
          </Col>
        </Row>
      </Container>
      {/* <AGrid /> */}
      <AnotherGrid />
    </>
  );
}

function AGrid () {
  const colors = getContentColors();
  
  function handleClick() {
    console.log('I clicked');
  }

  return (
    <>
      <Container>
        <Row>
          {/* <Col> */}
            <CardGroup> 
              {colors.map((color, idx) =>               
                <Card key={idx}>
                  <Card.Body style={{ backgroundColor: color }} as="button" onClick={handleClick}>
                  </Card.Body>
                </Card>
              )}
            </CardGroup>
          {/* </Col> */}
        </Row>
      </Container>
    </>
  )
}

function AnotherGrid () {
  const colors = getContentColors();
  
  function handleClick() {
    console.log('I clicked');
  }

  return (
    <>
      <Container>
        <Row className="g-0">
          {colors.map((color, idx) =>               
            <Col key={idx}>
              <Card key={idx}>
                <Card.Body style={{ backgroundColor: color, borderColor: color }} as="button" onClick={handleClick}>
                </Card.Body>
              </Card>
            </Col>
          )}
        </Row>
      </Container>
    </>
  )
}

function ABreadcrumb () {
  const {thematicID} = useParams();
  return (
    <>
      <Breadcrumb>
        <LinkContainer to = "/">
          <Breadcrumb.Item> Αρχική Σελίδα </Breadcrumb.Item>
        </LinkContainer>
        <Breadcrumb.Item active> Θεματική Ενότητα {thematicID} </Breadcrumb.Item>
      </Breadcrumb>
    </>
  );
}

function ColorFilter () {
  const [radioValue, setRadioValue] = useState('All');

  let filters = getContentColors();

  return (
    <>
      <ButtonGroup>
        {filters.map((color, idx) => 
          <ToggleButton key={idx} 
            id={`radio-${idx}`}
            type="radio"
            name="radio"
            value={color}
            checked={radioValue === color}
            style={{backgroundColor: (radioValue === color) || (radioValue === 'All') ? color : "#FFFFFF", borderColor: color}}
            onChange={(e) => setRadioValue(e.currentTarget.value)}
          />                
        )}
      </ButtonGroup>
      <ToggleButton 
          key={filters.length} 
          id={`radio-${filters.length}`}
          type="radio"
          name="radio"
          value='All'
          checked={radioValue === 'All'}
          variant="light"
          onChange={(e) => setRadioValue(e.currentTarget.value)}
        >
          Καθαρισμός Φίλτρου
      </ToggleButton>
    </>
  );
}