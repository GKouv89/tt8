import React from 'react';
import Card from 'react-bootstrap/Card';
import { Link } from "react-router-dom";

export default function Thematic(props) {
    return (
        <Card className="header">
        <Card.Header as="h2">
          <Link to={`${props.id}`}>
            {props.name}
          </Link>       
        </Card.Header>
        <Card.Img style={{ padding: '2.5%', border: '1px solid #999', height: '75%', width: '75%', display: 'block', marginLeft: 'auto', marginRight: 'auto'}} variant="top" src={props.img_path} alt="This is where a picture will go."/>
          <Card.Body>
            <Card.Text >{props.desc}</Card.Text>
          </Card.Body>
        </Card>
    );
}