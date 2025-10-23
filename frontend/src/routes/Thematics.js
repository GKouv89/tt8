import React, { useState } from 'react';
import Accordion from 'react-bootstrap/Accordion'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import Thematic from '../Component/Thematic.js'

import Immigration from '../assets/_DSC5708.jpg'
import Environment from '../assets/_DSC9344.jpg'
import Employment from '../assets/Eleusina.jpg'
import { useLoaderData } from 'react-router-dom';

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

export const thematics_alt = {
  Environment: 'environment',
  Employment: 'employment',
  Immigration: 'μigration'
}


export default function Thematics(){
  const city_thematics = useLoaderData();
  
  const [activeKey, setActiveKey] = useState('None');
  const url = `${process.env.REACT_APP_MENTOR_BASE_URL}${city_thematics.city.name.toLowerCase()}/`;
  const handleClick = (eventKey) => {
      activeKey === eventKey ? setActiveKey('None') : setActiveKey(eventKey);
  }

  return(
    <Container fluid className="py-4">
      <Row className="justify-content-center">
        <Col lg={8} xl={8} xxl={8} className="text-start"> {/* Added text-start here */}
          
          {/* City Description Section - No background, left aligned */}
          <div className='city-description mb-4'>
            <h1 className="mb-3 text-start">
              <a href={url} className="text-decoration-underline text-dark">{city_thematics.city.name}</a>
            </h1>
            <p className="mb-0 text-muted text-start">
              {city_thematics.city.description !== "" ? city_thematics.city.description : "No description available yet."}
            </p>
          </div>

          {/* Thematics Accordion Section */}
          <Accordion className="shadow-sm">
            <div className="d-flex flex-column gap-3">
              {city_thematics.thematics.map((thematic, index) => 
                <Thematic 
                  key={thematic.name} 
                  thematicColorId={index+1} 
                  eventKey={index} 
                  thematic={thematic} 
                  handleClick={handleClick} 
                  activeKey={activeKey}
                />                
              )}
            </div>      
          </Accordion>

        </Col>
      </Row>
    </Container>
  );
}