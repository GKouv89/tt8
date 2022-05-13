import React, { Component, useState } from 'react'
import { useParams } from 'react-router-dom'
import Breadcrumb from 'react-bootstrap/Breadcrumb'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import LinkContainer from 'react-router-bootstrap/LinkContainer'


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
        </>
    );
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