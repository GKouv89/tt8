import React, { Component, useState } from 'react';
import Breadcrumb from 'react-bootstrap/Breadcrumb'
import { useParams } from 'react-router-dom'
import LinkContainer from 'react-router-bootstrap/LinkContainer'
import { getContentColors, getContent } from '../data'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Card from 'react-bootstrap/Card';
import ToggleButton from 'react-bootstrap/ToggleButton';

export default class ThematicScreen extends Component{
  constructor(props){
    super(props);
    let contentSize = getContent().length;
    let padding = this.props.gridSize-contentSize;
    let elemOrder = this.makeRandomGridOrder(this.props.gridSize);
    console.log(elemOrder);
    this.state = { 
      gridSize: this.props.gridSize,
      padding: padding,
      elemOrder: elemOrder,
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
  
  makeRandomGridOrder(gridSize){
    console.log(gridSize);
    let allMyIndices = [...Array(gridSize).keys()].map(i => i);
    console.log(allMyIndices.length);
    var r, rand;
    r = [];
    while (allMyIndices.length){
        rand = Math.floor(Math.random()*allMyIndices.length);
        r.push(allMyIndices.splice(rand,1).pop());
    }
    return r;
  }

  addPadding(colors){
    let paddedColors  = colors.slice();
    for(let x = 0; x < this.state.padding; x++){
      paddedColors.push("None");
    }
    return paddedColors;
  }

  makeFilterColors(col){
    let colors = col.filter((v, i, a) => a.indexOf(v) === i);
    return colors;
  }
  
  render() {
    const colors = getContentColors();
    const paddedColors = this.addPadding(colors);
    const colorsForFilter = this.makeFilterColors(colors);

    return (
      <>
        <Container fluid>
          <Row>
            <Col xxl="auto">
              <ABreadcrumb />
            </Col>
            <Col xxl="auto">
              <ColorFilter filters={colorsForFilter} callback={this.handleFilter.bind(this)}/>
            </Col>
          </Row>
        </Container>
        <CuratedContentGrid 
          colCount={this.props.colCount} 
          dudCount={this.state.padding}
          colors={paddedColors} 
          order={this.state.elemOrder} 
          enabledColor={this.state.enabledColor} 
          handleClick={this.handleClick}/>
      </>
    );
  }
}

function CuratedContentGrid(props) {
  return (
    <>
      <Container>
        <Row className="g-0 justify-content-center" xxl={props.colCount}>
          {props.order.map((order, idx) => 
            <Col key={idx}>
              <GridElement
              enabledColor={props.enabledColor}
              color={props.colors[order]}
              handleClick={props.handleClick} />
            </Col>)}
        </Row>
      </Container>
    </>
  );
}

function GridElement(props) {
  return(
    <>
      <Card>
        <Card.Body 
          style = {{
            backgroundColor: (props.color !== "None") ? props.color : undefined,
            borderColor: (props.color !== "None") ? props.color : undefined,
            visibility: ((props.enabledColor === props.color) || (props.enabledColor === 'All')) && (props.color !== "None") ? "visible" : "hidden"
          }}
          as="button" 
          disabled={ (props.enabledColor === props.color) || (props.enabledColor === 'All') ? false : true }
          onClick={props.handleClick}>
        </Card.Body>
      </Card>
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
