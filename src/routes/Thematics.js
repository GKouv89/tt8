import React, { useState } from 'react';
import Accordion from 'react-bootstrap/Accordion'

import Thematic from '../Component/Thematic.js'



export default function Thematics(props){
  const [activeKey, setActiveKey] = useState('None');
  
  const handleClick = (eventKey) => {
      activeKey === eventKey ? setActiveKey('None') : setActiveKey(eventKey);
  }

  console.log(activeKey);
  return(
    <Accordion flush className="flex-fill">
      <div className="d-flex flex-column" style={{height: "100%"}}>
        {props.thematics.map((thematic, index) => 
          <Thematic key={thematic._id} eventKey={index} thematic={thematic} handleClick={handleClick} activeKey={activeKey}/>                
        )}
      </div>      
    </Accordion>
  );
}