import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import Collapse from 'react-bootstrap/Collapse'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

import { getThematics, getAxisNames, getContentOfThematic, getThematicEpisodes, getAxisColors, AllAxesColors, AllThematicColors } from '../data.js'
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from "react-router-dom"

import { fetchThematicScenes } from '../api/calls';

export default function ThematicScreenWrapper(props){
    let {thematicID} = useParams();
    return (
      <ThematicGrid {...props}
      id={thematicID}
      />
    );
}

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

function ThematicGridHeader(props){
  return(
    <Container>
      <Row className="border border-light justify-content-between">
        <Col xxl={4}>
          <Button variant={"thematic" + props.id}>
            {props.name}
          </Button>
        </Col>
        <Col xxl={4}>
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

function ThematicGridBody( {id, sessionData, startingKey} ){  
  const [contentArray, setContentArray] = useState(null);

  const createContentArray = () => {
    let content = [];
    sessionData.scenes.map((scene, idx) => { 
        content.push(<EpisodeSquare key={startingKey++} cardKey={startingKey++} thematicid={id} sessionid={sessionData.session} epno={scene.episode_id_in_session} axes={scene.axis} />);
    });  
    return content;
  }

  useEffect(() => { 
      setContentArray(createContentArray());
  }, []);

  return(
        <Container className="justify-content-start">
          <Row className="justify-content-start">
            <Col><h1 align="left">Συνεδρία {sessionData.session}</h1></Col>
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
          <Card.Title>Επεισόδιο {props.epno} </Card.Title>
          {
              props.axes.map((axis, idx) => {
              return <>
                <Link key={idx} style={{'color': 'black'}} to={`/${props.thematicid}/sessions/${props.sessionid}/episodes/${props.epno}/studio?axis=${axis.axis_id_in_thematic}`}>
                  <Card.Text style={{'color': 'black'}}>Άξονας {axis.axis_id_in_thematic}</Card.Text>
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

function ThematicGrid(props) {
  let newClassName="thematic" + props.id;
  document.body.className=newClassName;
  let content = getThematics();
  content = content[props.id - 1];

  const [data, setData] = useState(null);

  const sortData = (arr) =>  {
    return arr.sort((a, b) => a.episode_id_in_session - b.episode_id_in_session);
  }

  useEffect(() => {
    fetchThematicScenes(props.id, [1, 2])
    .then((ret) => {
      let sortedRet = [
        {'session': ret[0].session, 'scenes': sortData(ret[0].scenes)}, 
        {'session': ret[1].session, 'scenes': sortData(ret[1].scenes)}
      ]; 
      setData(sortedRet);})
    .catch(err => console.error(err));
  }, []);

  return (
    <>
      {
        data &&   
        <Container fluid>
          <Container className="flex-column">
            <Row>
              <ThematicGridHeader name={content.name} id={props.id}/>
            </Row>
            <Row>
              <ThematicGridBody id={props.id} sessionData={data[0]} startingKey={0}/>
            </Row>
          </Container>
        </Container>
      }
    </>
  );  
}