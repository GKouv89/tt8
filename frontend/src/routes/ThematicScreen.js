import React, { useState, useEffect } from 'react';
import { useLoaderData, Link, useParams, useNavigate } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'

import { thematics } from './Thematics'

function EpisodeSquare({episode, axisID, axisColor, colors}){
  const navigate = useNavigate();
  const path = `axes/${axisID}/episodes/${episode}/visualizations`

  let gradientString, isGradient = false;
  
  if(colors !== undefined){
    isGradient = true;
    const percent = 100/(colors.length + 1);
    gradientString = `linear-gradient(${axisColor} 0%, `;
    colors.map((color, idx) => { gradientString += `${color} ${(idx+1)*percent}%, `; });
    gradientString = gradientString.slice(0, -2);
    gradientString += ")";
    console.log('gradientString: ', gradientString);
  }

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
  console.log('axis: ', axis.axis_id_in_thematic);
  console.log('sharedScenes: ', axis.sharedScenes);

  return(
    <Container fluid>
      <Row className="mb-1">
        <Col xs={'auto'}><h1 className="h2">Axis {axis.axis_id_in_thematic}: {axis.title}</h1></Col>
      </Row>
      <Row>
        {
          Array(axis.scene_count).fill(0).map((_, idx) => {
            const scene = axis.sharedScenes.find((x) => x.order == idx+1);
            return (
              <Col key={idx} md={2} className="border border-light gridsquare mx-1 mb-3 p-0">
                <EpisodeSquare episode={idx+1} axisID={axis.axis_id_in_thematic} axisColor={axis.color} colors={scene ? scene.colors : undefined}/>
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
  console.log('data: ', data);
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