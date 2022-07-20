import React, { Component, useState } from 'react'
import LinkContainer from 'react-router-bootstrap/LinkContainer'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'

function ClickElement(props){
    const linksElsewhere = props.linksElsewhere;
    if(linksElsewhere){
        return (<LinkContainer to={props.path}>
                    {props.children}
                </LinkContainer>);
    }else{
        return(<>{props.children}</>);
    }
}

export default function ContentSquare(props){
    const path = `/${props.themid}/episodes/${props.epid}/content/${props.content._id}`;
    return(
      <>
        <Col xxl={2} className="border border-light gridsquare m-0 p-0">
          <Card onClick={props.linksElsewhere ? () => {} : () => props.callback(props.content._id)} className={"border border-light gridsquare axis" + props.content._axis_id}>
            <Card.Body className={"border border-light gridsquare axis" + props.content._axis_id}>
                <ClickElement linksElsewhere={props.linksElsewhere} path={path}>
                    <Card.Title>
                        <Card.Link className="quote-truncate" style={{color: "black", fontSize: "small"}}>
                            {props.content.name}
                        </Card.Link>
                    </Card.Title>
                </ClickElement>
            </Card.Body>
          </Card>
        </Col>
      </>
    );
}

export function EmptySquare(){
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

export function SpecialUseSquare(props){
  let path = `/${props.themid}/episodes/${props.epid}/studio`;
  return(
    <>
      <Col xxl={2} className="border border-light gridsquare m-0 p-0">
        <Card className="border border-light gridsquare">
          <Card.Body onClick={props.linksElsewhere ? () => {} : () => props.callback()} className="border border-light gridsquare">
            <ClickElement linksElsewhere={props.linksElsewhere} path={path}>
              <Card.Title>
                <Card.Link className="quote-truncate" style={{color: "black", fontSize: "small", whiteSpace: "pre-line"}}>
                  {props.text}
                </Card.Link>
              </Card.Title>
            </ClickElement>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
}