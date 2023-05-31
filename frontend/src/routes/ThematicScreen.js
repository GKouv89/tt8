import React, { useState, useEffect } from 'react';
import { useLoaderData, Link, useParams, useNavigate } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'

import { thematics } from './Thematics'

function ThematicGridBody(){  
  const [contentArray, setContentArray] = useState(null);

  const createContentArray = () => {
    let content = [];
    if(sessionData.scenes.length !== 0){
      sessionData.scenes.map((scene, idx) => { 
        content.push(<EpisodeSquare key={startingKey++} cardKey={startingKey++} thematicid={id} sessionid={sessionData.session} epno={scene.episode_id_in_session} axes={scene.axis} />);
      });  
    }else{
      for(let i = 0; i < 24; i++){
        content.push(<EmptySquare />);
      }
    }
    return content;
  }

  // useEffect(() => { 
  setContentArray(createContentArray());
  // }, []);

  return(
        <Container className="justify-content-start">
          <Row className="justify-content-start">
            <Col><h1 align="left">Session {sessionData.session}</h1></Col>
          </Row>
          <Row className="border border-light">
            {contentArray}
          </Row>
        </Container>    
  );
}

// function EpisodeSquare(props){
//   const [gradient, setGradient] = useState(false);
//   const [myGradientString, setMyGradientString] = useState(null);
//   const [loaded, setLoaded] = useState(false);

//   useEffect(() => {
//     const myEpisodeColors = props.axes.map((axis) => axis.color);
//     let tempString;
//     if(myEpisodeColors.length > 1){
//       setGradient(true);
//       const percent = 100/myEpisodeColors.length;
//       tempString = "linear-gradient(";
//       myEpisodeColors.map((color, idx) => { tempString += `${color} ${idx*percent}%, `; });
//       tempString = tempString.slice(0, -2);
//       tempString += ")";
//     }else{
//       tempString = myEpisodeColors[0];
//     }
//     setMyGradientString(tempString);
//   }, []);

//   useEffect(() => {
//     myGradientString && setLoaded(true);
//   }, [myGradientString]);

//   return(<>
//     {
//     loaded && 
//     <Col key={props.cardKey} xxl={2} className="border border-light gridsquare m-0 p-0">
//       <Card className="gridsquare episode-tile-new border-light">
//         <Card.Body style={gradient ? {backgroundImage: myGradientString} : {backgroundColor: myGradientString}}
//           className="episode-tile-new"
//           as="button"
//           >
//           <Card.Title>Episode {props.epno} </Card.Title>
//           {
//               props.axes.map((axis, idx) => {
//               return <>
//                 <Link key={idx} style={{'color': 'black'}} to={`sessions/${props.sessionid}/episodes/${props.epno}/visualizations?axis=${axis.axis_id_in_thematic}`}>
//                   <Card.Text style={{'color': 'black'}}>Axis {axis.axis_id_in_thematic}</Card.Text>
//                 </Link>
//               </>
//             })
//           }
//         </Card.Body>
//       </Card>
//     </Col>
//     }
//   </>);
// }

function EpisodeSquare({episode, axisID, axisColor}){
  const navigate = useNavigate();
  const path = `axes/${axisID}/episodes/${episode.ep_id}/visualizations?epid=${episode.episode_id_in_session}&sessid=${episode.session}`

  return(
    <Card className="gridsquare episode-tile-new border-light">
        <Card.Body style={{backgroundColor: axisColor}}
          className="episode-tile-new"
          as="button"
          onClick={() => {navigate(path)}}
        >
          <Card.Title>Episode {episode.ep_id} </Card.Title>
        </Card.Body>
    </Card>
  );
}

function EmptySquare(){
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

function AxisRow({axis}){
  return(
    <Container fluid>
      <Row className="mb-1">
        <Col xs={'auto'}><h1 className="h2">Axis {axis.axis_id_in_thematic}: {axis.title}</h1></Col>
      </Row>
      <Row>
        {
          axis.episodes.map((episode, idx) => {
            return (
              <Col key={idx} md={2} className="border border-light gridsquare mx-3 mb-3 p-0">
                <EpisodeSquare episode={episode} axisID={axis.axis_id_in_thematic} axisColor={axis.color}/>
              </Col>
            )
          })
        }
      </Row>
    </Container>
  ); 
}

export default function ThematicGrid() {
  let {thematicID} = useParams();

  const currThematic = thematics[thematicID - 1];

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