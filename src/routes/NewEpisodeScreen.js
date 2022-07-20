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
import ContentSquare, { EmptySquare, SpecialUseSquare } from '../Component/ContentSquare'

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
  let count = 0;
  let visSonCount = 0;
  for(x = 0; x < content.length; x++){
    if(content[x].type != "visualization" && content[x].type != "sonification"){
      console.log(content[x]);
      contentSquares.push(<ContentSquare themid={props.themid} epid={props.epid} content={content[x]} linksElsewhere={true}/>);
      count++;
    }else{
      visSonCount++;
    }
  }
  if(visSonCount){
    contentSquares.push(<SpecialUseSquare themid={props.themid} epid={props.epid} linksElsewhere={true} text={'Οπτικοποιήσεις και Ηχοποιήσεις Επεισοδίου'}/>);
  }
  for(x = 0; x < gridSize - count - 1; x++){
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

