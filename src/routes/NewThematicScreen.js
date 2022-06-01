import React, { useState } from 'react';
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
      <Row className="border border-light">
        <Col xxl={4} className={(props.open) ? "border border-light descselected" : "border border-light"}>
          <Button
            onClick={props.callback}
            aria-controls="example-collapse-text"
            aria-expanded={props.open}
            variant={(props.open) ? "descselected": "thematic" + props.id}
          >
            {props.name}
            {
             (props.open) ? <i className="bi bi-x-lg"></i> : <i className="bi bi-plus-lg"></i>
            }
          </Button>
        </Col>
        <ColorFilterColumnWrapper id={props.id} callback={props.cfcallback}/>
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
  const gridSize = 30;
  let content = getContentOfThematic(props.id);
  let episodes = getThematicEpisodes(props.id);
  let numberOfSquares = content.length + episodes.length;
  let numberOfPadding = gridSize - numberOfSquares;
  
  const makeRandomGridOrder = (gridSize) => {
    let allMyIndices = [...Array(gridSize).keys()].map(i => i);
    var r, rand;
    r = [];
    while (allMyIndices.length){
        rand = Math.floor(Math.random()*allMyIndices.length);
        r.push(allMyIndices.splice(rand,1).pop());
    }
    return r;
  }

  const makePaddedGridContent = (content, episodes, numberOfPadding) => {
    let contentArray = [];
    content.map((content, idx) => 
      {
        if(content.type == 'text' & content.subtype == 'quote'){
          contentArray.push(<QuoteSquare filter={props.filter} content={content}/>);
        }else if(content.type == 'img'){
          contentArray.push(<ImageSquare filter={props.filter} content={content}/>);
        }else{
          contentArray.push(<GridSquare filter={props.filter} content={content}/>);
        }
      }
    );
    episodes.map((episodeno, idx) => (
      contentArray.push(<EpisodeSquare thematicid={props.id} epno={episodeno} />)
    ));
    for(let x = 0; x < numberOfPadding; x++){
      contentArray.push(<EmptySquare />);
    }
    return contentArray;
  }

  const filterContent = (content, axis_id) => {
    let newContent = [];
    for(let x = 0; x < content.length; x++){
      if(content[x]._axis_id == axis_id){
        newContent.push(content[x]);
      }
    }
    return newContent;
  }

  let gridOrder = makeRandomGridOrder(gridSize);
  let gridContent = makePaddedGridContent(content, episodes, numberOfPadding);
  let newContent;
  if(props.filter != 'None'){
    newContent = filterContent(content, props.filter);
  }

  return(
    <>
      <Container>
        <Row className="border border-light">
          {gridContent}
        </Row>
      </Container>
    </>
  );
}

function GridSquare(props){
  return(
    <>
      <Col xxl={2} className="border border-light gridsquare m-0 p-0">
        <Card className={(props.filter == props.content._axis_id) || (props.filter == 'None') ? "border-light gridsquare axis" + props.content._axis_id : "empty"}>
          <Card.Body 
            className={(props.filter == props.content._axis_id) || (props.filter == 'None') ? "axis" + props.content._axis_id : "empty"}
            as="button"
            disabled={(props.filter == props.content._axis_id || props.filter == 'None') ? false: true}
            >
          </Card.Body>
        </Card>
      </Col>
    </>
  );
}

function EpisodeSquare(props){
  let myEpisodeColors = getAxisColors(props.epno);
  let myGradientString = "linear-gradient(";
  for(let i = 0; i < myEpisodeColors.length; i++){
    console.log(AllAxesColors[myEpisodeColors[i] - 1]);
    myGradientString = myGradientString + AllAxesColors[myEpisodeColors[i] - 1] + " " + i*15 +"%, ";
  }
  myGradientString = myGradientString + AllThematicColors[props.thematicid - 1] + " " + myEpisodeColors.length*15 + "%)" ;
  console.log(myGradientString);

  return(
    <>
      <Col xxl={2} className="border border-light gridsquare m-0 p-0">
        <Card className="gridsquare episode-tile-new border-light">
          <Card.Body style={{backgroundImage: myGradientString}}
            className="episode-tile-new"
            as="button">
            <Link to={`/${props.thematicid}/episodes/${props.epno}`} style={{color: "black", textDecoration: "none"}}>
              Επεισόδιο {props.epno}
            </Link>
          </Card.Body>
        </Card>
      </Col>
    </>
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

function QuoteModal(props) {
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <CloseButton onClick={props.onHide} variant="white"/>
      <Modal.Body className="modal-quote">
        {props.text}
      </Modal.Body>
    </Modal>
  );
}

function QuoteSquare(props){
  const [quoteVisible, setQuoteVisible] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [cardClassName, setCardClassName] = useState("gridsquare border-light m-0 p-0 axis" + props.content._axis_id);
  const [quoteClassName, setQuoteClassName] = useState("quote-truncate empty");

  const showQuote = () => {
    setQuoteVisible(true);
    setCardClassName("gridsquare border-light m-0 p-0 quote");
    setQuoteClassName("quote-truncate");
  }

  const hideQuote = () => {
    setQuoteVisible(false);
    setCardClassName("gridsquare border-light m-0 p-0 axis" + props.content._axis_id);
    setQuoteClassName("quote-truncate empty");
  }

  return(
    <>
      <Col xxl={2} className="border border-light gridsquare m-0 p-0">
        <Card as="button" 
          className={(props.filter == props.content._axis_id) || (props.filter == 'None') ? cardClassName : "empty"}
          onMouseOver={() => showQuote(true)} 
          onMouseOut={() => hideQuote(false)}
          onClick={() => setModalShow(true)}
          disabled={(props.filter == props.content._axis_id || props.filter == 'None') ? false: true}
          >
          <Card.Body>
            <Card.Text className={quoteClassName}>
              {props.content.desc}
            </Card.Text>
          </Card.Body>
        </Card>
        <QuoteModal show={modalShow} onHide={() => setModalShow(false)} text={props.content.desc}/>
      </Col>
    </>
  )
}

function ImageModal(props) {
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <CloseButton onClick={props.onHide} variant="white"/>
      <Modal.Body className="modal-image">
        <Image src={props.img} alt="Modal image" fluid={true}/>
        {props.desc}
      </Modal.Body>
    </Modal>
  );
}

function ImageSquare(props){
  const [imageVisible, setImageVisible] = useState(false);
  const [cardClassName, setCardClassName] = useState("gridsquare border-light m-0 p-0 axis" + props.content._axis_id);
  const [imageClassName, setImageClassName] = useState("my-auto image-square empty");
  const [modalShow, setModalShow] = useState(false);

  const showImage = () => {
    setImageVisible(true);
    // setCardClassName("gridsquare border-light m-0 p-0 episode-tile-new");
    // setImageClassName("my-auto image-square");
    setImageClassName("my-auto h-100");
  }

  const hideImage = () => {
    setImageVisible(false);
    setCardClassName("gridsquare border-light m-0 p-0 axis" + props.content._axis_id);
    setImageClassName("empty");
  }

  return(
    <>
      <Col xxl={2} className="border border-light gridsquare m-0 p-0">
        <Card
          className={(props.filter == props.content._axis_id) || (props.filter == 'None') ? cardClassName : "empty"}>
          <Card.Body as="button" 
          onMouseOver={() => showImage(true)} 
          onMouseOut={() => hideImage(false)}
          onClick={() => setModalShow(true)}
          className={(props.filter == props.content._axis_id) || (props.filter == 'None') ? cardClassName : "empty"} 
          disabled={(props.filter == props.content._axis_id || props.filter == 'None') ? false: true}>
            <Card.Img src={props.content.path} alt="Card Image" className={imageClassName}/>
          </Card.Body>
        </Card>
        <ImageModal show={modalShow} onHide={() => setModalShow(false)} img={props.content.path} desc={props.content.desc}/>
      </Col>
    </>
  )
}

function ColorFilter(props){
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState('None');
  let axisnames = getAxisNames();

  return (
    <>
      <DropdownButton id="dropdown-item-button" variant={(expanded) ? "descselected" : "thematic" + props.id } onClick={() => setExpanded(!expanded)} title="Φίλτρα">
        {axisnames.map((name, idx) => 
          <Dropdown.Item key={idx} as="button" className={"filter" + (++idx)} onMouseOver={() => setHovered(idx)} onMouseOut={() => setHovered('None')} onClick={() => props.callback((idx))}>
            <p style={{visibility: (hovered == idx) ? "visible": "hidden"}}>
              {name}
            </p>
          </Dropdown.Item>)}
      </DropdownButton>    
    </>
  );
}

function ClearFilter(props){
  return (
    <>
      <Button variant="descselected" onClick={() => props.callback()}> 
        Πίσω
        <i className="bi bi-arrow-left"></i>
      </Button>
    </>
  );
}

function ColorFilterColumnWrapper(props){
  const [filterChosen, setFilterChosen] = useState(false);
  const [colorChosen, setColorChosen] = useState('None');

  const clearFilterCallback = () => {
    setFilterChosen(!filterChosen);
    setColorChosen('None');
    props.callback('None');
  }

  const filterCallback = (id) => {
    setFilterChosen(!filterChosen);
    setColorChosen(id);
    props.callback(id);
  }
  console.log('filterchosen: ' + filterChosen);
  console.log('colorchosen: ' + colorChosen);
  return (
    <>
      <Col xxl={4} className={(filterChosen) ? "border border-light descselected" : "border border-light"}>
      {
        (filterChosen) ?  <ClearFilter callback={clearFilterCallback}/> : <ColorFilter id={props.id} callback={filterCallback} />
      }
      </Col>
    </>
  );
}

function ThematicGrid(props) {
  let newClassName="thematic" + props.id;
  document.body.className=newClassName;
  let content = getThematics();
  content = content[props.id - 1];

  const [open, setOpen] = useState(false);
  const descButtonCallback = () => {
    console.log(open);
    setOpen(!open);
  }

  const [filteredAxis, setFilteredAxis] = useState('None');
  const colorFilterCallback = (val) => {
    setFilteredAxis(val);
  }
  console.log('filteredAxis: ' + filteredAxis);
  return (
    <Container fluid>
      <Container className="flex-column">
        <Row>
          <Description id={props.id} desc={content.desc} open={open}/>
        </Row>
        <Row>
          <ThematicGridHeader name={content.name} desc={content.desc} id={props.id} callback={descButtonCallback} cfcallback={colorFilterCallback} open={open}/>
        </Row>
        <Row>
          <ThematicGridBody id={props.id} filter={filteredAxis}/>
        </Row>
      </Container>
    </Container>
  );  
}