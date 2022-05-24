import React from 'react';
import Accordion from 'react-bootstrap/Accordion'

import Thematic from '../Component/Thematic.js'

export default function Thematics(props){
  return(
    <Accordion flush className="flex-fill">
      <div className="d-flex flex-column" style={{height: "100%"}}>
        {props.thematics.map((thematic, index) => 
          <Thematic key={thematic._id} eventKey={index} thematic={thematic}/>                
        )}
      </div>      
    </Accordion>
  );
}