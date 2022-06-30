import React, { Component, useEffect, useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import sketch from '../sketches/sketch3';
import { ReactP5Wrapper } from "react-p5-wrapper";

const makeMarks = (startingYear, endingYear) => {
    let marks = {};
    let lastFullDecade = Math.floor(endingYear / 10) * 10;
    let decades = (lastFullDecade - startingYear)/10;
    for(let x = 0; x <= decades; x++){
        let currYear = startingYear + x*10;
        marks[currYear] = currYear;
    }
    return marks;
}

export default function SliderScreen(){
    let startingYear = 1880;
    let endingYear = 2022;
    const [lowerBound, setLowerBound] = useState(startingYear);
    const [upperBound, setUpperBound] = useState(endingYear);
    const [marks, setMarks] = useState(makeMarks(startingYear, endingYear));

    const updateBounds = (value) => {
        // console.log(value); //eslint-disable-line
        setLowerBound(value[0]);
        setUpperBound(value[1]);
    }

    return(
        <div className="slider-container">
            <Slider range min={startingYear} max={endingYear} step={1} marks={marks} included={true} allowCross={false} defaultValue={[startingYear, endingYear]} onChange={updateBounds}/>
            <ReactP5Wrapper sketch={sketch} startingYear={lowerBound} endingYear={upperBound}/>
        </div>
    );
}