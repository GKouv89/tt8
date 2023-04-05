import React, { useState, useEffect } from 'react';
import { useLoaderData, Link, useParams } from 'react-router-dom'
import Collapse from 'react-bootstrap/Collapse'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

import { getThematics } from '../data.js'
import { LinkContainer } from 'react-router-bootstrap';

import { fetchThematicScenes } from '../api/calls';
import SessionTabs from '../Component/SessionTabs.js';
import ScrollSpy from "react-ui-scrollspy";

function Description(props){
  return (
  <>
    <Collapse in={props.open} className={"thematic" + props.id}>
      <Card>
          <Card.Body >
              <Card.Text>
              {props.desc}
              </Card.Text>
          </Card.Body>
      </Card>
    </Collapse>
  </>
  );
}

function ThematicGridBody( {id, sessionData, startingKey} ){  
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

  useEffect(() => { 
      setContentArray(createContentArray());
  }, []);

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

function EpisodeSquare(props){
  const [mouseOver, setMouseOver] = useState(false);
  const [gradient, setGradient] = useState(false);
  const [myGradientString, setMyGradientString] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const myEpisodeColors = props.axes.map((axis) => axis.color);
    let tempString;
    if(myEpisodeColors.length > 1){
      setGradient(true);
      const percent = 100/myEpisodeColors.length;
      tempString = "linear-gradient(";
      myEpisodeColors.map((color, idx) => { tempString += `${color} ${idx*percent}%, `; });
      tempString = tempString.slice(0, -2);
      tempString += ")";
    }else{
      tempString = myEpisodeColors[0];
    }
    setMyGradientString(tempString);
  }, []);

  useEffect(() => {
    myGradientString && setLoaded(true);
  }, [myGradientString]);

  return(<>
    {
    loaded && 
    <Col key={props.cardKey} xxl={2} className="border border-light gridsquare m-0 p-0">
      <Card className="gridsquare episode-tile-new border-light">
        <Card.Body style={gradient ? {backgroundImage: myGradientString} : {backgroundColor: myGradientString}}
          className="episode-tile-new"
          as="button"
          onMouseOver={() => setMouseOver(true)}
          onMouseOut={() => setMouseOver(false)}
          >
          <Card.Title>Episode {props.epno} </Card.Title>
          {
              props.axes.map((axis, idx) => {
              return <>
                <Link key={idx} style={{'color': 'black'}} to={`sessions/${props.sessionid}/episodes/${props.epno}/studio?axis=${axis.axis_id_in_thematic}`}>
                  <Card.Text style={{'color': 'black'}}>Axis {axis.axis_id_in_thematic}</Card.Text>
                </Link>
              </>
            })
          }
        </Card.Body>
      </Card>
    </Col>
    }
  </>);
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

export default function ThematicGrid(props) {
  let {thematicID} = useParams();

  let newClassName="thematic" + thematicID;
  document.body.className=newClassName;
  let content = getThematics();
  content = content[thematicID - 1];

  const data = useLoaderData();

  return (
    <Container fluid>
      <Container className="flex-column">
        <Row key={0}>
          <SessionTabs />
        </Row>
        <ScrollSpy>
          <Row key={1} id="first">
            <ThematicGridBody key={0} id={thematicID} sessionData={data[0]} startingKey={0}/>
          </Row>
          <Row key={2} id="second">
            <ThematicGridBody key={1} id={thematicID} sessionData={data[1]} startingKey={data[0].length}/>
          </Row>
        </ScrollSpy>
      </Container>
    </Container>
  );  
}