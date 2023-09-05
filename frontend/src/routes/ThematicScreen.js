import React from 'react';
import { useLoaderData, useParams, useNavigate } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Button from 'react-bootstrap/Button'

function Episode({axisID, axisColor, id, colors}){
  const navigate = useNavigate();
  let gradientString, isGradient = false;
  if(colors){
    isGradient = true;
    const percent = 100/(colors.length + 1);
    gradientString = `linear-gradient(to right, ${axisColor} 0%, `;
    colors.map((color, idx) => { gradientString += `${color} ${(idx+1)*percent}%, `; });
    gradientString = gradientString.slice(0, -2);
    gradientString += `, ${axisColor} 100%)`;
    console.log('gradientString: ', gradientString);
  }

  const style = {
    color: 'black',
    ...(isGradient ? {backgroundImage: gradientString} : {backgroundColor: axisColor}),
    ...(isGradient ? {borderColor: 'transparent'}: {borderColor: axisColor}),
  }

  return (
      <Button                    
        style={style}
        onClick={() => navigate(`axes/${axisID}/episodes/${id}/visualizations`)}
      >
        Episode {id}
      </Button>
  )

}

function Axis({axis})
{
  const {thematicName} = useParams();
  const axisID = axis.axis_id_in_thematic;
  const axisColor = axis.color;
  const url = `${process.env.REACT_APP_MENTOR_BASE_URL}${thematicName.toLowerCase()}/axis-${axisID}/`;

  return(
    <Card 
      style={{
        backgroundColor: axisColor, 
        borderColor: axisColor
      }} 
      className='shadow'
    >
      <Card.Body>
        <Card.Title>
          <a href={url} className='h4'>Axis {axisID}: {axis.title}</a>
        </Card.Title>
        <Container fluid className='p-0'>
          <Row className='justify-content-center align-items-center'>
            <ButtonGroup 
              size='lg'
              className='shadow'
            >
              {
                Array(axis.scene_count).fill(0).map((_, idx) => {
                  const episodeID = idx + 1;
                  const scene = axis.sharedScenes.find((x) => x.order == episodeID);
                  const colors = scene !== undefined ? scene.colors: undefined;
                  return <Episode id={episodeID} colors={colors} axisColor={axisColor} axisID={axisID}/>
                })
              }
            </ButtonGroup>
          </Row> 
        </Container>
      </Card.Body>
    </Card>
  );
}

export default function ThematicGrid() {
  const {thematicName} = useParams();
  
  const data = useLoaderData();
  const leftHandColumns = data.slice(0, 4);
  const rightHandColumns = data.slice(4);
  let orderedColumns = [];
  for(let i = 0; i < leftHandColumns.length; i++){
    orderedColumns.push(leftHandColumns[i]);
    orderedColumns.push(rightHandColumns[i]);
  }
  
  return (
    <Container fluid>
      <Row key={0} className="mb-0 p-0 justify-content-center">
        <Col xs={'auto'}>
          <h1 className='h3'>
            {thematicName}
          </h1>
        </Col>
      </Row>
      <Row key={1}>
        {
          orderedColumns.map((axis, idx ) => {
            return <Col md={6} key={idx} className='pb-1'><Axis axis={axis}/></Col>
          })
        }
      </Row>
    </Container>
  );  
}