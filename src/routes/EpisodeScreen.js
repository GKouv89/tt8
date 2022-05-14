import React, { Component, useState } from 'react'
import { useParams } from 'react-router-dom'
import Breadcrumb from 'react-bootstrap/Breadcrumb'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import LinkContainer from 'react-router-bootstrap/LinkContainer'
import Card from 'react-bootstrap/Card'

import { getEpisodeContent } from '../data'

import EpisodeContent from './EpisodeContent'

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
            <EpisodeGrid themid={props.themid} epid={props.epid}/>
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
        elements.push(<ImageTile key={idx} idx={idx} content={content} themid={this.props.themid} epid={this.props.epid}/>);
      }else{
        elements.push(<ContentTile key={idx} idx={idx} content={content} themid={this.props.themid} epid={this.props.epid}/>);
      }
    })

    return(
      <>
        <Container>
          <Row className="g-0 justify-content-center row-eq-height">
            {elements}
          </Row>
        </Container>
        {/* <EpisodeContent path={epContent[0].path}/> */}
      </>
    );
  }
}

function ContentTile(props){
  let contentPath = "/" + props.themid + "/episodes/"+ props.epid + "/content/" + props.content._id;

  return(
    <Col key={props.idx} xxl={2}>
      <Card style={{backgroundColor: props.content._axis_id, borderColor: props.content._axis_id}} className="h-100">
        <Card.Body>
          <LinkContainer to={contentPath}>
            <Card.Title>{props.content.name}</Card.Title>
          </LinkContainer>
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
        <Card.Img src={props.content.path} alt="Card Image" />
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