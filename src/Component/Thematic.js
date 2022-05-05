import React from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'


function Thematic(props) {
    return (
        <Card /*style={{ width: '33vw'}} */>
        <Card.Header as="h2" /*style={{ "font-size": '3vw'}}*/>Θεματική Ενότητα {props.id}</Card.Header>
        <Card.Img style={{ padding: '2.5%', border: '1px solid #999'}} variant="top" src={props.img_path} alt="This is where a picture will go."/>
          <Card.Body>
            <Card.Title as="h3" /*style={{ "font-size": '3vw'}}*/>{props.name}</Card.Title>
            <Card.Text >{props.desc}</Card.Text>
          </Card.Body>
        </Card>
    );
}

export default function Thematics(props){
  return(
    <Container>
      <Row>
          {props.thematics.map(function (thematic) {
              return <Col key={thematic._id}>
                        <Thematic key={thematic._id} id={thematic._id} name={thematic.name} desc={thematic.desc} />                
                    </Col>
          })}
      </Row>
    </Container>
  );
}
