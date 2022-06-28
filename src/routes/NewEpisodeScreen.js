import React, { Component, useState } from 'react'
import { useParams } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import LinkContainer from 'react-router-bootstrap/LinkContainer'
import Card from 'react-bootstrap/Card'

import { getEpisodeContent, getEpisodeDescription, getPieceOfContent } from '../data'
import Breadcrumb from '../Component/Breadcrumb'

export default function EpisodeScreenWrapper(props){
    let {thematicID, episodeID} = useParams();
    return (
      <EpisodeScreen {...props}
      epid={episodeID}
      themid={thematicID}
      />
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

// function choosePath(id, themid, epid, type, subtype){
//   switch(type){
//     case "visualization":
//       return "/visualizations/" + subtype + "/" + getPieceOfContent(id - 1).fileID;
//     case "sonification":
//       return "/sonifications/" + subtype + "/" + getPieceOfContent(id - 1).fileID;
//     default:
//       return "/" + themid + "/episodes/"+ epid + "/content/" + id;
//   }
// }

function ContentSquare(props){
  // let path = choosePath(props.content._id, props.themid, props.epid, props.content.type, props.content.subtype);
  let path = `/${props.themid}/episodes/${props.epid}/content/${props.content._id}`;
  return(
    <>
      <Col xxl={2} className="border border-light gridsquare m-0 p-0">
        <Card className={"border border-light gridsquare axis" + props.content._axis_id}>
          <Card.Body className={"border border-light gridsquare axis" + props.content._axis_id}>
            <LinkContainer to={path}>
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

// function fetchMyFile() {
//   let path = "http://" + window.location.hostname + "/images/data.csv";
//   fetch(path)
//     .then((response) => console.log(response.text()));
//     // .then(() => console.log(response)); 
// }

function EmptySquare(){
  // fetchMyFile();
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
  let thempath = "/" + props.themid;
  return (
    <>
      <Container fluid>
        <Container className="flex-column">
          <Row>
            <Breadcrumb path={thempath} themid={props.themid}/>
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

