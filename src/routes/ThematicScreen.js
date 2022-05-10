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
              <ColorFilter filters={colors.filter((v, i, a) => a.indexOf(v) === i)} callback={this.handleFilter.bind(this)}/>
            </Col>
          </Row>
        </Container>
        <CuratedContentGrid colors={colors} enabledColor={this.state.enabledColor} handleClick={this.handleClick}/>
      </>
    );
  }
}

function CuratedContentGrid(props) {
  
  function createDuds(){
    const duds = [];
    for(let x = 0; x < 20 - (props.colors.length % 20); x++){
      duds.push(<DudElement key={x}/>);
    }
    return duds;
  }

  return (
    <>
      <Container>
        <Row className="g-0 justify-content-center" xxl={20}>
          {props.colors.map((color, idx) => <GridElement key={idx} enabledColor={props.enabledColor} color={color} handleClick={props.handleClick} /*order={Math.floor(Math.random() * 20) + 1}*/ /> )}
          {createDuds()}
        </Row>
      </Container>
    </>
  );
}

function GridElement(props) {
  return(
    <>
      <Col xxl={{ order: props.order }}>
        <Card>
          <Card.Body 
            style={{ backgroundColor: props.color, borderColor: props.color, visibility: (props.enabledColor === props.color) || (props.enabledColor === 'All') ? "visible" : "hidden" }} 
            as="button" 
            disabled={ (props.enabledColor === props.color) || (props.enabledColor === 'All') ? false : true }
            onClick={props.handleClick}>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
}

function DudElement(props){
  return(
    <>
      <Col>
        <Card>
          <Card.Body as="button" disabled={true}>
          </Card.Body>
        </Card>
      </Col>
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
