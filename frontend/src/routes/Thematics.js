import React, { useState } from 'react';
import Accordion from 'react-bootstrap/Accordion'

import Thematic from '../Component/Thematic.js'

import Immigration from '../assets/_DSC5708.jpg'
import Environment from '../assets/_DSC9344.jpg'
import Employment from '../assets/Eleusina.jpg'

export const thematics = [
  { 
    _id: 1,
    name: 'Environment',
    desc: `Το δικαίωμα στην εργασία εντάσσεται στην Οικουμενική Διακήρυξη για τα
    Δικαιώματα του Ανθρώπου. Ως <<ελευθερία του επαγγέλματος και δικαίωμα προς εργασία>>
    περιγράφεται στον Χάρτη των Θεμελιωδών Δικαιωμάτων της Ευρωπαϊκής Ένωσης (άρθρο 15),
    ενώ το δικαίωμα στην εργασία προστατεύται και από το Ελληνικό Σύνταγμα. Η εργασία αποτελεί
    κομβικό σημείο κατά την παραγωγή και την κατανάλωση αγαθών.`,
    img_source: Environment
  },
  { 
    _id: 2,
    name: 'Employment',
    desc: `Το δικαίωμα στην εργασία εντάσσεται στην Οικουμενική Διακήρυξη για τα
    Δικαιώματα του Ανθρώπου. Ως <<ελευθερία του επαγγέλματος και δικαίωμα προς εργασία>>
    περιγράφεται στον Χάρτη των Θεμελιωδών Δικαιωμάτων της Ευρωπαϊκής Ένωσης (άρθρο 15),
    ενώ το δικαίωμα στην εργασία προστατεύται και από το Ελληνικό Σύνταγμα. Η εργασία αποτελεί
    κομβικό σημείο κατά την παραγωγή και την κατανάλωση αγαθών.`,
    img_source: Employment
  },
  { 
    _id: 3,
    name: 'Immigration',
    desc: `Το δικαίωμα στην εργασία εντάσσεται στην Οικουμενική Διακήρυξη για τα
    Δικαιώματα του Ανθρώπου. Ως <<ελευθερία του επαγγέλματος και δικαίωμα προς εργασία>>
    περιγράφεται στον Χάρτη των Θεμελιωδών Δικαιωμάτων της Ευρωπαϊκής Ένωσης (άρθρο 15),
    ενώ το δικαίωμα στην εργασία προστατεύται και από το Ελληνικό Σύνταγμα. Η εργασία αποτελεί
    κομβικό σημείο κατά την παραγωγή και την κατανάλωση αγαθών.`,
    img_source: Immigration
  }
];

export default function Thematics(){
  const [activeKey, setActiveKey] = useState('None');
  
  const handleClick = (eventKey) => {
      activeKey === eventKey ? setActiveKey('None') : setActiveKey(eventKey);
  }

  return(
    <Accordion flush className="flex-fill">
      <div className="d-flex flex-column" style={{height: "100%"}}>
        {thematics.map((thematic, index) => 
          <Thematic key={thematic._id} eventKey={index} thematic={thematic} handleClick={handleClick} activeKey={activeKey}/>                
        )}
      </div>      
    </Accordion>
  );
}