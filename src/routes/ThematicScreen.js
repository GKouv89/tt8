import React, { useState } from 'react';
import Breadcrumb from 'react-bootstrap/Breadcrumb'
import { useParams } from 'react-router-dom'
import LinkContainer from 'react-router-bootstrap/LinkContainer'
import { getColors } from '../data'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';


export default function ThematicScreen () {
  return (
    <>
      <Container fluid>
        <Row>
          <Col>
            <ABreadcrumb />
          </Col>
          <Col>
            <ColorFilter />
          </Col>
        </Row>
      </Container>
    </>
  );
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
  const [radioValue, setRadioValue] = useState('None');

  let filters = getColors();

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
            style={{backgroundColor: (radioValue === color) || (radioValue === 'None') ? color : "#FFFFFF", borderColor: color}}
            onChange={(e) => setRadioValue(e.currentTarget.value)}
          />                
        )}
      </ButtonGroup>
    </>
  );
}