import React, { Component, useState } from 'react';
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


export default class ThematicScreen extends Component{
  constructor(props){
    super(props);
    this.state = { 
      gridHeight: 1, // Number of rows to render
      gridWidth: 7, // Number of columns to render
      enabledColor: 'All'
    };
  }

  handleClick() {
    console.log('I clicked');
  }

  handleFilter = (newColor) => {
    let newState = {
      enabledColor: newColor
    }
    this.setState(newState);
  }
  
  render() {
    const colors = getContentColors();
    console.log('Selected axis is: ' + this.state.enabledColor);
    return (
      <>
        <Container fluid>
          <Row>
            <Col xxl="auto">
              <ABreadcrumb />
            </Col>
            <Col xxl="auto">
              <ColorFilter filters={colors} callback={this.handleFilter.bind(this)}/>
            </Col>
          </Row>
        </Container>
        <AnotherGrid colors={colors} handleClick={this.handleClick}/>
      </>
    );
  }
}

function AnotherGrid(props) {
  return (
    <>
      <Container>
        <Row className="g-0">
          {props.colors.map((color, idx) =>               
            <Col key={idx}>
              <Card key={idx}>
                <Card.Body style={{ backgroundColor: color, borderColor: color }} as="button" onClick={props.handleClick}>
                </Card.Body>
              </Card>
            </Col>
          )}
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

function ColorFilter (props) {
  const [radioValue, setRadioValue] = useState('All');

  return (
    <>
      <ButtonGroup>
        {props.filters.map((color, idx) => 
          <ToggleButton key={idx} 
            id={`radio-${idx}`}
            type="radio"
            name="radio"
            value={color}
            checked={radioValue === color}
            style={{backgroundColor: (radioValue === color) || (radioValue === 'All') ? color : "#FFFFFF", borderColor: color}}
            onChange={(e) => {
              props.callback(e.currentTarget.value);
              setRadioValue(e.currentTarget.value);
            }}
          />                
        )}
      </ButtonGroup>
      <ToggleButton 
          key={props.filters.length} 
          id={`radio-${props.filters.length}`}
          type="radio"
          name="radio"
          value='All'
          checked={radioValue === 'All'}
          variant="light"
          onChange={(e) => 
            {
              props.callback(e.currentTarget.value);
              setRadioValue(e.currentTarget.value);
            }}
        >
          Καθαρισμός Φίλτρου
      </ToggleButton>
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
          <Col>
            <CardGroup> 
              {colors.map((color, idx) =>               
                <Card key={idx}>
                  <Card.Body style={{ backgroundColor: color }} as="button" onClick={handleClick}>
                  </Card.Body>
                </Card>
              )}
            </CardGroup>
          </Col>
        </Row>
      </Container>
    </>
  )
}
