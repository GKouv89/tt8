import React, { useState } from 'react';
import { useParams } from 'react-router-dom'
import Collapse from 'react-bootstrap/Collapse'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

import { getThematics } from '../data.js'

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
      </Row>
    </Container>
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