import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { useMatches } from 'react-router-dom';

export default function Breadcrumbs(){
  const matches = useMatches();
  let crumbs = matches
    .filter((match) => Boolean(match.handle?.crumb))
    .map((match) => match.handle.crumb(match.params));
  
  const length = crumbs.length;

  if(length !== 0){
    return(
      <Container fluid>
       <Row key={0} className='border border-light breadcrumb'>
          {crumbs.map((crumb, index) => {
              return crumb.map((navlink) => <Col className='breadcrumb-item' xs={'auto'} key={index}>{navlink}</Col>)
            })
          }
       </Row>
      </Container>
    );
  }else{
    return(<></>);
  }
}