import React, { Component, useState } from 'react'
import { useParams } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import LinkContainer from 'react-router-bootstrap/LinkContainer'
import Card from 'react-bootstrap/Card'

import { getEpisodeContent, getEpisodeDescription } from '../data'

export default function EpisodeScreenWrapper(props){
    let {thematicID, episodeID} = useParams();
    return (
      <EpisodeScreen {...props}
      epid={episodeID}
      themid={thematicID}
      />
    );
}

function EpisodeGridHeader(props){
  const [hovered, setHovered] = useState(false);
  let themPath = "/" + props.themid;
  return(
    <Container>
      <Row className="border border-light">
        <Col xxl={4} className={(hovered) ? "border border-light descselected" : "border border-light"}>
          <LinkContainer to={themPath}>
            <Button
              onMouseOver={() => setHovered(true)}
              onMouseOut={() => setHovered(false)}
              variant={(hovered) ? "descselected": "thematic" + props.themid}
            >
              Πίσω
              <i className="bi bi-arrow-left"></i>
            </Button>
          </LinkContainer>
        </Col>
        <Col xxl={4} className={"border border-light"}/>          
        <Col xxl={4} className={"border border-light"}>
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

function Description(props){
  return (
  <>
    <Card className={"text-start thematic" + props.classid} style={{color: "white"}}>
      <Card.Body>
        {props.desc}
      </Card.Body>
    </Card>
  </>
  );
}

function ContentSquare(props){
  let contentPath = "/" + props.themid + "/episodes/"+ props.epid + "/content/" + props.content._id;
  return(
    <>
      <Col xxl={2} className="border border-light gridsquare m-0 p-0">
        <Card className={"border border-light gridsquare axis" + props.content._axis_id}>
          <Card.Body className={"border border-light gridsquare axis" + props.content._axis_id}>
            <LinkContainer to={contentPath}>
              <Card.Title>
                <Card.Link className="quote-truncate" style={{color: "black", fontSize: "small"}}>
                  {props.content.name}
                </Card.Link>
              </Card.Title>
            </LinkContainer>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
}

function EmptySquare(){
  return(
    <>
      <Col xxl={2} className="border border-light gridsquare m-0 p-0">
        <Card className="gridsquare border-light empty">
          <Card.Body 
            className="empty"
            as="button"
            disabled={true}>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
}

function EpisodeScreen(props) {
  let newClassName="thematic" + props.themid;
  document.body.className=newClassName;
  let desc = getEpisodeDescription(props.epid - 1);
  
  return (
    <>
      <Container fluid>
        <Container className="flex-column">
          <Row>
            <EpisodeGridHeader themid={props.themid}/>
          </Row>
          <Row xxl={2}>
            <Description classid={props.themid} desc={desc}/>
          </Row>
          <Row xxl={2}></Row>
          <Row>
          </Row>
          <Row>
            <EpisodeGrid themid={props.themid} epid={props.epid} />
          </Row>
        </Container>
      </Container>
    </>
  );
}


function EpisodeGrid(props) {
  let content = getEpisodeContent(props.epid); 

  let gridSize = 24;
  let contentSquares = [];
  let x;

  console.log(props.epid);
  console.log(content);
  for(x = 0; x < content.length; x++){
    contentSquares.push(<ContentSquare themid={props.themid} epid={props.epid} content={content[x]}/>);
  }
  for(x = 0; x < gridSize - content.length ; x++){
    contentSquares.push(<EmptySquare />);
  }

  return (
    <Container>
      <Row className="border border-light">
        {contentSquares}
      </Row>
    </Container>
  );  
}

