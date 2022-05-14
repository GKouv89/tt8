import React, { Component, useState } from 'react'
import { useParams } from 'react-router-dom'
import Breadcrumb from 'react-bootstrap/Breadcrumb'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import LinkContainer from 'react-router-bootstrap/LinkContainer'
import Card from 'react-bootstrap/Card'
import CardGroup from 'react-bootstrap/CardGroup'

import { getEpisodeContent } from '../data'


export default function EpisodeScreenWrapper(props){
    let {thematicID, episodeID} = useParams();
    return (
      <EpisodeScreen {...props}
      epid={episodeID}
      themid={thematicID}
      />
    );
}

function EpisodeScreen(props) {
    return (
        <>
            <Container fluid>
                <Row>
                    <Col xxl="auto">
                        <ABreadcrumb themid={props.themid} epid={props.epid}/>
                    </Col>
                </Row>
            </Container>
            <EpisodeGrid epid={props.epid}/>
        </>
    );
}

class EpisodeGrid extends Component{
  constructor(props){
    super(props);
  }

  render(){
    const epContent = getEpisodeContent(this.props.epid);
    console.log(epContent);

    let elements = [];
    epContent.map((content, idx) => {
      if(content.type == "img"){
        elements.push(<ImageTile key={idx} idx={idx} content={content}/>);
      }else{
        elements.push(<ContentTile key={idx} idx={idx} content={content}/>);
      }
    })

    return(
      <>
        <Container>
          <Row className="g-0 justify-content-center row-eq-height">
            {elements}
          </Row>
        </Container>
      </>
    );
  }
}

function ContentTile(props){
  return(
    <Col key={props.idx} xxl={2}>
      <Card style={{backgroundColor: props.content._axis_id, borderColor: props.content._axis_id}} className="h-100">
        <Card.Body>
          <Card.Title>{props.content.name}</Card.Title>
          <Card.Text>{props.content.desc}</Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
}

function ImageTile(props){
  return(
    <Col key={props.idx} xxl={2}>
      <Card className="h-100">
        <Card.Img src={props.content.path} /*style={{width: "auto", height: "auto"}}*/ alt="Card Image" />
        {/* <Card.ImgOverlay>
          <Card.Text>{props.content.path}</Card.Text>
        </Card.ImgOverlay> */}
      </Card>
    </Col>
  )
}

function ABreadcrumb (props) {
    let themPath = "/" + props.themid;
    return (
      <>
        <Breadcrumb>
          <LinkContainer to = "/">
            <Breadcrumb.Item> Αρχική Σελίδα </Breadcrumb.Item>
          </LinkContainer>
          <LinkContainer to = {themPath}>
              <Breadcrumb.Item> Θεματική Ενότητα {props.themid} </Breadcrumb.Item>
          </LinkContainer>
          <Breadcrumb.Item active> Επεισόδιο {props.epid} </Breadcrumb.Item>
        </Breadcrumb>
      </>
    );
  }