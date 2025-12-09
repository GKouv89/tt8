import React from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate, useLoaderData } from 'react-router-dom';
import { Container, Row, Col, Card, Button, ButtonGroup } from 'react-bootstrap';

// Dummy test modes: set to 'multiple' or 'single' to preview layouts, or null to use real data
const TEST_MODE = null; // 'multiple' | 'single' | null

const dummyMultiple = [
  { id: 1, title: 'Negative feelings about the city and its environment', color: '#e74c3c', scene_count: 3 , sharedScenes: []},
  { id: 2, title: 'Positive feelings about the city and its environment', color: '#f39c12', scene_count: 2, sharedScenes: [] },
  { id: 3, title: 'The citizen towards the city', color: '#f1c40f', scene_count: 3, sharedScenes: [] },
  { id: 4, title: 'The city towards the citizen', color: '#00a5d4', scene_count: 4, sharedScenes: [{order: 3, colors: ["#7b1fa2"]}] },
  { id: 5, title: 'Negative industry presence', color: '#7b1fa2', scene_count: 4, sharedScenes: [{order: 4, colors: ["#00a5d4"]}] },
  { id: 6, title: 'Positive industry presence', color: '#2ecc71', scene_count: 3, sharedScenes: [] },
  { id: 7, title: 'The citizen as an individual', color: '#0b6ea6', scene_count: 3, sharedScenes: [] },
  { id: 8, title: 'The citizen as a collective', color: '#ffffff', scene_count: 4, sharedScenes: [] },
];

const dummySingle = [
  { id: 1, title: 'The long single axis with many episodes', color: '#6a1b9a', scene_count: 12 }
];

function Episode({axisID, axisColor, id, colors, onEpisodeClick}){

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
        onClick={() => onEpisodeClick && onEpisodeClick(axisID, id)}
      >
        Episode {id}
      </Button>
  )

}

function AxisCard({axis, onEpisodeClick, axisUrl}) {
  return (
    <Card
       style={{
        backgroundColor: axis.color, 
        borderColor: axis.color
      }} 
      className='shadow'
    >
      <Card.Body className="p-4">
        <Card.Title>
          <a href={axisUrl} className='mb-3 h4'>Axis {axis.axis_id_in_thematic}: {axis.title}</a>
        </Card.Title>
        <Container fluid className='p-0'>
          <Row className='justify-content-center align-items-center'>
            <ButtonGroup 
              size='lg'
              className='shadow'
              style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}
            >
              {
                Array(axis.scene_count).fill(0).map((_, idx) => {
                  const episodeID = idx + 1;
                  const scene = axis.sharedScenes.find((x) => x.order == episodeID);
                  const colors = scene !== undefined ? scene.colors: undefined;
                  return <Episode key={episodeID} id={episodeID} colors={colors} axisColor={axis.color} axisID={axis.axis_id_in_thematic} onEpisodeClick={onEpisodeClick}/>
                })
              }
            </ButtonGroup>
          </Row>
        </Container>
      </Card.Body>
    </Card>
  );
}

function SingleAxisHero({axis, onEpisodeClick, axisUrl}) {
  const perRow = 3;
  const total = axis.scene_count || 0;
  const rows = Math.ceil(total / perRow);
  const rowArray = Array.from({ length: rows });

  return (
    <Card className="mb-4 shadow-sm" style={{ background: axis.color, color: 'black'}}>
      <Card.Body className="p-4">
        <Card.Title>
          <a href={axisUrl} className='mb-3 h2'>Axis {axis.axis_id_in_thematic}: {axis.title}</a>
        </Card.Title>
        <Container fluid className='p-0'>
          {rowArray.map((_, rowIdx) => {
            const start = rowIdx * perRow + 1;
            const end = Math.min(start + perRow - 1, total);
            return (
              <Row key={rowIdx} className='justify-content-center align-items-center mb-2'>
                <ButtonGroup
                  size='lg'
                  className='shadow'
                  style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}
                >
                  {Array.from({ length: end - start + 1 }).map((__, idx) => {
                    const episodeID = start + idx;
                    const scene = (axis.sharedScenes || []).find(x => x.order == episodeID);
                    const colors = scene !== undefined ? scene.colors : undefined;
                    return (
                      <Episode
                        key={episodeID}
                        id={episodeID}
                        colors={colors}
                        axisColor={axis.color}
                        axisID={axis.axis_id_in_thematic}
                        onEpisodeClick={onEpisodeClick}
                      />
                    );
                  })}
                </ButtonGroup>
              </Row>
            );
          })}
        </Container>
      </Card.Body>
    </Card>
  );
}

export default function ThematicGrid({axes: propAxes}) {
  const {cityName, thematicName} = useParams();
  const navigate = useNavigate();
  const loaderData = useLoaderData();

  // select data source: TEST_MODE > loaderData > dummyMultiple
  let axes = propAxes;
  if (!axes) {
    if (TEST_MODE === 'single') axes = dummySingle;
    else if (TEST_MODE === 'multiple') axes = dummyMultiple;
    // else axes = loaderData?.axes || dummyMultiple; // use loader data when TEST_MODE is null
    else axes = loaderData;
  }

  const handleEpisodeClick = (axisID, episode) => {
    // navigate to axis/episode route
    navigate(`axes/${axisID}/episodes/${episode}/visualizations`);
  };

  const axisUrl = (axis) => {
    return `${process.env.REACT_APP_MENTOR_BASE_URL}${cityName.toLowerCase()}/${thematicName.toLowerCase()}/axis-${axis.axis_id_in_thematic}/`;
  }

  // If there's only one axis, show the hero layout (good for many episodes)
  if (axes.length === 1) {
    return (
      <Container fluid className="py-4">
        <Row className="justify-content-center">
          <Col lg={10} xl={10}>
            <SingleAxisHero axis={axes[0]} onEpisodeClick={handleEpisodeClick} axisUrl={axisUrl(axes[0])} />
          </Col>
        </Row>
      </Container>
    );
  }

  // Otherwise render the familiar 2-column card grid (keeps current appearance)
  return (
    <Container fluid className="py-4">
      <Row className="justify-content-center">
        <Col lg={10} xl={10}>
          <h2 className="text-center mb-4">Environment</h2>
          <Row xs={1} md={2} className="g-3">
            {axes.map(axis => (
              <Col key={axis.id}>
                <AxisCard axis={axis} onEpisodeClick={handleEpisodeClick} axisUrl={axisUrl(axis)} />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}