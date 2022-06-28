import React, { Component, useEffect, useState } from 'react';
import {useParams} from 'react-router-dom';
import { ReactP5Wrapper } from "react-p5-wrapper";

import * as viz1 from '../sketches/sketch1';
import * as son1 from '../sketches/sketch2';

import { getPieceOfContent } from '../data';

import { default as VizWithSlider } from '../Component/SliderScreen'

function chooseViz(typeOfVisualization, typeOfScript, fileName){
    let element;
    if(typeOfVisualization == 'visualization'){
        switch(typeOfScript){
            case 'plain':
                let path = `http://${window.location.hostname}/data/visualizations/plain/${fileName}`;
                console.log(path);
                element = <NoSliderViz sketch={viz1.sketch} path={path} />;
                break;
            case 'slider':
                element = <VizWithSlider />;
                break;
            default:
                console.log('Something went terribly wrong');
                break;
        }
    }else{
        element = <ReactP5Wrapper sketch={son1.sketch}/>
    }
    return element;
}

export default function VizWrapper(props){
    // let {typeOfVisualization, typeOfScript, contentID} = useParams();
    let typeOfVisualization = getPieceOfContent(props.id - 1).type;
    let typeOfScript = getPieceOfContent(props.id - 1).subtype;
    let fileName = getPieceOfContent(props.id - 1).fileName;
    // Sketch choice
    let element = chooseViz(typeOfVisualization, typeOfScript, fileName);
    return(<>{element}</>);
}

function NoSliderViz(props){
    return(
        <ReactP5Wrapper sketch={props.sketch} path={props.path}/>
    );
}