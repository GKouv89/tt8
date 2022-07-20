import { React, Component, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import Image from 'react-bootstrap/Image';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import { getPieceOfContent } from '../data';

import Breadcrumb from '../Component/Breadcrumb';

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
                    <Content type={type} content={content} />
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
            let src = `${window.location.protocol}//${window.location.hostname}/${props.content}`;
            element = <Image src={src} alt="image" fluid={true}/>
            console.log('Path: ' + src);
            break;
    }
    return(
        <>
            {element}
        </>
    );
}