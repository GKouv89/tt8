import React from 'react';
import CardGroup from 'react-bootstrap/CardGroup'

import Thematic from '../Component/Thematic.js'

export default function Thematics(props){
    return(
      <CardGroup className="header">
            {props.thematics.map(function (thematic) {
                return <Thematic key={thematic._id} id={thematic._id} name={thematic.name} desc={thematic.desc} img_path={thematic.img_path}/>                
            })}
      </CardGroup>
    );
  }