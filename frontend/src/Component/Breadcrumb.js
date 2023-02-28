import React, { useState } from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import LinkContainer from 'react-router-bootstrap/LinkContainer';

export default function Breadcrumb(props){
    const [hovered, setHovered] = useState(false);
    // let themPath = "/" + props.themid;
    return(
      <Container fluid>
        <Row className="border border-light">
          <Col xxl={4} className={(hovered) ? "border border-light descselected" : "border border-light"}>
            <LinkContainer to={props.path}>
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