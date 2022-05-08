import React from 'react';
import Container from 'react-bootstrap/Container'
import Breadcrumb from 'react-bootstrap/Breadcrumb'
import { useParams } from 'react-router-dom'
import LinkContainer from 'react-router-bootstrap/LinkContainer'

export default function ThematicScreen () {
  return (
    <>
      <ABreadcrumb />
    </>
  );
}

function ABreadcrumb () {
  const {thematicID} = useParams();
  return (
    <>
      <Breadcrumb>
        <LinkContainer to = "/">
          <Breadcrumb.Item> Αρχική Σελίδα </Breadcrumb.Item>
        </LinkContainer>
        <Breadcrumb.Item active> Θεματική Ενότητα {thematicID} </Breadcrumb.Item>
      </Breadcrumb>
    </>
  );
}