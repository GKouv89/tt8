import React from 'react';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup'

function Thematic(props) {
    return (
        <Card>
        <Card.Header as="h2">Θεματική Ενότητα {props.id}</Card.Header>
        <Card.Img style={{ padding: '2.5%', border: '1px solid #999', height: '75%', width: '75%', display: 'block', marginLeft: 'auto', marginRight: 'auto'}} variant="top" src={props.img_path} alt="This is where a picture will go."/>
          <Card.Body>
            <Card.Title as="h3">{props.name}</Card.Title>
            <Card.Text >{props.desc}</Card.Text>
          </Card.Body>
        </Card>
    );
}

export default function Thematics(props){
  return(
    <CardGroup>
          {props.thematics.map(function (thematic) {
              return <Thematic key={thematic._id} id={thematic._id} name={thematic.name} desc={thematic.desc} img_path={thematic.img_path}/>                
          })}
    </CardGroup>
  );
}