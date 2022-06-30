import * as d3 from './d3-dsv.v1.min.js'
import './p5.sound.min.js'
import './p5.dom.min.js'
import * as P5Class from "p5"

export function sketch(p5){
    let osc;
    let freq;
    let headingEl;
    let tempEl;
    let width = 500;
    let height = 500;

    async function sleep(ms){
        return new Promise(res=>setTimeout(res, ms));
    }

    function drawSound(temperature, year, month){
        let yearPosition = (width / 119) * (year - 1900);
        let monthPosition = ((width / 119) / 12) * month;
        let x = yearPosition + monthPosition;
        let y = p5.map(temperature, 0, 100, height, 0);
        p5.circle(x, y, 2);
    }      

    function playSound(temperature){
        freq = p5.map(temperature, 0, 100, 200, 1600); 
        osc.freq(freq);
    }

    p5.setup  = async () => {
        p5.createCanvas(width, height);
        let data = await fetch(`${window.location.protocol}//${window.location.hostname}/data/sonifications/plain/1.csv`);
        let csv = await data.text();
        let weather = d3.csvParseRows(csv);
        headingEl = p5.createSpan('');
        tempEl = p5.createSpan('');
        headingEl.position(500, 500);
        tempEl.position(500, 525);
        osc = new P5Class.Oscillator();
        osc.setType('sine');
        osc.amp(1);
        osc.start();
        for(let i = 1; i < weather.length; i++){
            for(let j = 1; j < weather[i].length; j++){
                headingEl.html(`${weather[i][0]} - ${weather[0][j]}`);
                tempEl.html(weather[i][j]);
                drawSound(parseFloat(weather[i][j]), weather[i][0], j - 1);
                playSound(parseFloat(weather[i][j]));
                // TODO: Erkin make a sun change color using the following function that you will write
                await sleep(250);
            }
        }
    }
}