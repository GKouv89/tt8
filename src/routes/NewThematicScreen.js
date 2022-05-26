import React, { useState } from 'react';
import { useParams } from 'react-router-dom'
import Collapse from 'react-bootstrap/Collapse'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'

import { getThematics, getAxisNames } from '../data.js'
import { LinkContainer } from 'react-router-bootstrap';

export default function ThematicScreenWrapper(props){
    let {thematicID} = useParams();
    return (
      <ThematicGrid {...props}
      id={thematicID}
      />
    );
}

function Description(props){
  return (
  <>
    <Collapse in={props.open} className={"thematic" + props.id}>
      <Card>
          <Card.Body >
              <Card.Text>
              {props.desc}
              </Card.Text>
          </Card.Body>
      </Card>
    </Collapse>
  </>
  );
}

function ThematicGridHeader(props){
  return(
    <Container>
      <Row className="border border-light">
        <Col xxl={4} className={(props.open) ? "border border-light descselected" : "border border-light"}>
          <Button
            onClick={props.callback}
            aria-controls="example-collapse-text"
            aria-expanded={props.open}
            variant={(props.open) ? "descselected": "thematic" + props.id}
          >
            {props.name}
            {
             (props.open) ? <i className="bi bi-x-lg"></i> : <i className="bi bi-plus-lg"></i>
            }
          </Button>
        </Col>
        <Col xxl={4}>
          <ColorFilter id={props.id}/>
        </Col>
        <Col xxl={4}>
            <LinkContainer to="/">
              <Button variant='light' className="rounded-0">
                Πίσω στις θεματικές
              </Button>
            </LinkContainer>
        </Col>
      </Row>
    </Container>
  );
}

function ColorFilter(props){
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState('None');
  let axisnames = getAxisNames();
  return (
    <>
      {/* <ButtonGroup>
        {props.filters.map((color, idx) => 
          <ToggleButton key={idx} 
            id={idx}
            type="radio"
            name="radio"
            value={color}
            checked={radioValue === color}
            style={{backgroundColor: (radioValue === color) || (radioValue === 'All') ? color : "#FFFFFF", borderColor: color}}
            onChange={(e) => {
              props.callback(parseInt(e.currentTarget.id) + 1);
              setRadioValue(e.currentTarget.value);
            }}
          />                
        )}
      </ButtonGroup>
      <ToggleButton 
          key={props.filters.length} 
          id={`${props.filters.length}`}
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
      </ToggleButton> */}
      <DropdownButton id="dropdown-item-button" variant={(expanded) ? "thematic" + props.id : "descselected"} onClick={() => setExpanded(!expanded)} title="Φίλτρα">
        {axisnames.map((name, idx) => 
          <Dropdown.Item key={idx} as="button" className={"axis" + (++idx)} onMouseOver={() => setHovered(idx)} onMouseOut={() => setHovered('None')}>
            <p style={{visibility: (hovered == idx) ? "visible": "hidden"}}>
              {name}
            </p>
          </Dropdown.Item>)}
      </DropdownButton>
    </>
  );
}

function ThematicGrid(props) {
  let newClassName="thematic" + props.id;
  document.body.className=newClassName;
  let content = getThematics();
  content = content[props.id - 1];

  const [open, setOpen] = useState(false);
  const descButtonCallback = () => {
    console.log(open);
    setOpen(!open);
  }

  return (
    <Container fluid>
      <Container className="flex-column">
        <Row>
          <Description id={props.id} desc={content.desc} open={open}/>
        </Row>
        <Row>
          <ThematicGridHeader name={content.name} desc={content.desc} id={props.id} callback={descButtonCallback} open={open}/>
        </Row>
      </Container>
    </Container>
  );  
}