import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import Collapse from 'react-bootstrap/Collapse'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Modal from 'react-bootstrap/Modal'
import Image from 'react-bootstrap/Image'

import { getThematics, getAxisNames, getContentOfThematic, getThematicEpisodes, getAxisColors, AllAxesColors, AllThematicColors } from '../data.js'
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from "react-router-dom"
import { CloseButton } from 'react-bootstrap';

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

function ThematicGridBody(props){
  const [data, setData] = useState(null);
  const [contentArray, setContentArray] = useState(null);

  useEffect(() => {
    fetchThematicScenes(props.id, [1, 2])
    .then((ret) => setData(ret))
    .catch(err => console.error(err));
  }, []);

  const createContentArray = () => {
    let content = [];
    data[0].scenes.map((scene, idx) => { 
        content.push(<EpisodeSquare key={idx} thematicid={props.id} epno={scene.episode_id_in_session} />);
    });  
    return content;
  }

  useEffect(() => { 
    if(data){
      setContentArray(createContentArray());
    }
  }, [data]);
  
  return(
        <Container>
          <Row className="border border-light">
            {contentArray}
          </Row>
        </Container>    
  );
}

function EpisodeSquare(props){
  const [mouseOver, setMouseOver] = useState(false);

  // let myEpisodeColors = getAxisColors(props.epno);
  // let myGradientString = "linear-gradient(";
  // for(let i = 0; i < myEpisodeColors.length; i++){
  //   console.log(AllAxesColors[myEpisodeColors[i] - 1]);
  //   myGradientString = myGradientString + AllAxesColors[myEpisodeColors[i] - 1] + " " + i*15 +"%, ";
  // }
  // myGradientString = myGradientString + AllThematicColors[props.thematicid - 1] + " " + myEpisodeColors.length*15 + "%)" ;
  // console.log(myGradientString);

  return(
      <Col xxl={2} className="border border-light gridsquare m-0 p-0">
        <Card className="gridsquare episode-tile-new border-light">
          <Card.Body
          // <Card.Body style={(mouseOver) ? {backgroundColor: "white"} : {backgroundImage: myGradientString}}
            className="episode-tile-new"
            as="button"
            onMouseOver={() => setMouseOver(true)}
            onMouseOut={() => setMouseOver(false)}
            >
            <Link to={`/${props.thematicid}/episodes/${props.epno}`} style={{color: "black", textDecoration: (mouseOver) ? "underline" : "none"}}>
              Επεισόδιο {props.epno}
            </Link>
          </Card.Body>
        </Card>
      </Col>
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

function ThematicGrid(props) {
  let newClassName="thematic" + props.id;
  document.body.className=newClassName;
  let content = getThematics();
  content = content[props.id - 1];

  return (
    <Container fluid>
      <Container className="flex-column">
        <Row>
          <ThematicGridHeader name={content.name} id={props.id}/>
        </Row>
        <Row>
          <ThematicGridBody id={props.id}/>
        </Row>
      </Container>
    </Container>
  );  
}