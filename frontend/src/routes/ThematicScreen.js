import React, { useState, useEffect } from 'react';
import { useLoaderData, Link, useParams, useNavigate } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'

import { thematics } from './Thematics'

function EpisodeSquare({episode, axisID, axisColor}){
  const navigate = useNavigate();
  const path = `axes/${axisID}/episodes/${episode}/visualizations`

  let gradientString, isGradient = false;
  // if(episode.colors !== undefined){
  //   isGradient = true;
  //   const percent = 100/episode.colors.length;
  //   gradientString = "linear-gradient(";
  //   episode.colors.map((color, idx) => { gradientString += `${color} ${idx*percent}%, `; });
  //   gradientString = gradientString.slice(0, -2);
  //   gradientString += ")";
  // }

  return(
    <Card className="gridsquare episode-tile-new border-light">
        <Card.Body style={isGradient ? {backgroundImage: gradientString} : {backgroundColor: axisColor}}
          className="episode-tile-new"
          as="button"
          onClick={() => {navigate(path)}}
        >
          <Card.Title>Episode {episode} </Card.Title>
        </Card.Body>
    </Card>
  );
}

function AxisRow({axis}){
  return(
    <Container fluid>
      <Row className="mb-1">
        <Col xs={'auto'}><h1 className="h2">Axis {axis.axis_id_in_thematic}: {axis.title}</h1></Col>
      </Row>
      <Row>
        {
          Array(axis.scene_count).fill(0).map((_, idx) => {
            return (
              <Col key={idx} md={2} className="border border-light gridsquare mx-3 mb-3 p-0">
                <EpisodeSquare episode={idx+1} axisID={axis.axis_id_in_thematic} axisColor={axis.color}/>
              </Col>
            )
          })
        }
      </Row>
    </Container>
  ); 
}

export default function ThematicGrid() {
  const data = useLoaderData();

  return (
    <Container fluid>
      <Container className="flex-column" fluid>
        {
          data.map(((d, idx) => {
            return (
              <Row key={idx}>
                <AxisRow axis={d}/>
              </Row>
            )
          }))
        }
      </Container>
    </Container>
  );  
}