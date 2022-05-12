import React, { Component, useState } from 'react'
import Breadcrumb from 'react-bootstrap/Breadcrumb'
import { useParams } from 'react-router-dom'
import LinkContainer from 'react-router-bootstrap/LinkContainer'
import { getContentColors, getContentOfThematic, getAxisColors } from '../data'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Card from 'react-bootstrap/Card'
import ToggleButton from 'react-bootstrap/ToggleButton'
import OverlayTrigger  from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover'

export default function ThematicScreenWrapper(props){
  let {thematicID} = useParams();
  return (
    <ThematicScreen {...props}
    id={thematicID}
    />
  );
}

export class ThematicScreen extends Component{
  constructor(props){
    super(props);
    let content = getContentOfThematic(this.props.id);
    let contentSize = content.length;
    let colors = getContentColors(content);
    let padding = this.props.gridSize-contentSize;
    let elemOrder = this.makeRandomGridOrder(this.props.gridSize);
    console.log(elemOrder);
    console.log(this.props.id);
    this.state = { 
      content: content,
      colors: colors,
      gridSize: this.props.gridSize,
      padding: padding,
      elemOrder: elemOrder,
      enabledColor: 'All'
    };
  }

  handleFilter = (newColor) => {
    let newState = {
      enabledColor: newColor
    }
    this.setState(newState);
  }
  
  makeRandomGridOrder(gridSize){
    let allMyIndices = [...Array(gridSize).keys()].map(i => i);
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
    const paddedColors = this.addPadding(this.state.colors);
    const colorsForFilter = getAxisColors();

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
          content={this.state.content}
          order={this.state.elemOrder} 
          enabledColor={this.state.enabledColor} />
      </>
    );
  }
}

class CuratedContentGrid extends Component{
  render () {
    const elements = [];
    this.props.order.map((order, idx) => 
      {
        if(this.props.colors[order] !== "None"){
          elements.push(<GridElement key={idx} idx={idx} enabledColor={this.props.enabledColor}
          color={this.props.colors[order]}  
          content={this.props.content[order]}
          />);
        }else{
          elements.push(<DudElement key={idx} idx={idx}/>);
        }
      }
    );

    return (
      <>
        <Container>
          <Row className="g-0 justify-content-center">
            {elements}
          </Row>
        </Container>
      </>
    );
  }
}

class GridElement extends Component{
  constructor(props){
    super(props);
    this.state = {
      clicked: false
    }
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({clicked: !this.state.clicked});
  }
  
  render() {
    const popover = (
      <Popover id="popover-position-top">
        <Popover.Header as="h3">{this.props.content.name}</Popover.Header>
        <Popover.Body>
          {this.props.content.desc}
        </Popover.Body>
      </Popover>
    );

    return(
      <>
        <Col xxl={1} key={this.props.idx}>
          <Card>
            <OverlayTrigger trigger="click" placement="top" overlay={popover}>
              <Card.Body 
                style = {{
                  backgroundColor: this.props.color,
                  borderColor: this.props.color,
                  visibility: ((this.props.enabledColor === this.props.color) || (this.props.enabledColor === 'All')) ? "visible" : "hidden",
                }}
                as="button" 
                disabled={ (this.props.enabledColor === this.props.color) || (this.props.enabledColor === 'All') ? false : true }
                onClick={this.handleClick}
                >
              </Card.Body>
            </OverlayTrigger>
          </Card>
        </Col>
      </>
    );  
  }
}

function DudElement(props) {
  return(
    <>
      <Col xxl={1} key={props.idx}>
        <Card>
          <Card.Body 
            style={{ visibility: "hidden"}}
            as="button"
            disabled={true}>
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
