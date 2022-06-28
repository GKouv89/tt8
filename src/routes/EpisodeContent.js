import { React, Component, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import Image from 'react-bootstrap/Image';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import { getPieceOfContent } from '../data';

import Breadcrumb from '../Component/Breadcrumb';
import VizWrapper from './VizWrapper';

export default function ContentWrapper(props) {
    let {thematicID, episodeID, contentID} = useParams();
    return(
        <>
            <ContentScreen themid={thematicID} epid={episodeID} contid={contentID}/>
        </>
    );
}

function ContentScreen(props){
    const [type, setType] = useState("");
    const [content, setContent] = useState("");

    useEffect(() => {
        async function fetchData() {
            console.log('In Fetch Data');
            const path = getPieceOfContent(props.contid - 1).path;
            const type = getPieceOfContent(props.contid - 1).type;
            const subtype = getPieceOfContent(props.contid - 1).subtype;
            if(path !== "" && type == "text"){
                fetch(path)
                        .then((response) => response.text())
                        .then((text) => {setType("text"); setContent(text);});
            }else if(type =="text" && subtype == "quote"){
                setType("text");
                setContent(getPieceOfContent(props.contid - 1).desc);
            }else if(path !== "" && type == "img"){
                setType("img");
                setContent(path);
            }else if(type == "visualization" || type == "sonification"){
                setType(type);
                console.log('Type: ' + type);
            }
        }
        fetchData()
    },[]);

    // let eppath = "/" + props.themid + "/episodes/" + props.epid;
    let eppath = `/${props.themid}/episodes/${props.epid}`;
    return(
        <Container fluid>
            <Container className="flex-column">
                <Row>
                    <Breadcrumb path={eppath} themid={props.themid}/>                
                </Row>
                <Row>
                    {(type == "visualization" || type == "sonification") 
                        ? <VizWrapper id={props.contid}/> 
                        : <Content type={type} content={content} />
                    }
                </Row>
            </Container>
        </Container>
    );
}

function Content(props){
    let element;
    switch(props.type){
        case "text":
            element = <p>{props.content}</p>
            break;
        case "img":
            element = <Image src={"http://" + window.location.hostname + props.content} alt="image" fluid={true}/>
            break;
    }
    return(
        <>
            {element}
        </>
    );
}