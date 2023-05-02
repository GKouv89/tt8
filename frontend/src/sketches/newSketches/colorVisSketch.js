import '../p5.sound.min.js'
import '../p5.dom.min.js'
import '../p5.js'
import * as P5Class from "p5"

export function sketch(p5){
    let axisChoice;
    let filepaths = [];
    let tables = [];
    let biosignal;
    let min, max;

    const samplingRate = 128;

    let dataLoaded = false;
    
    p5.updateWithProps = props => {
        // These two are only initialized once, hence the two checks.
        if(filepaths.length == 0 && props.files){ 
            filepaths = props.files;
            loadFile(0);
        }
        if(axisChoice === undefined && props.color){
            axisChoice = props.color;
        }
        // This one changes on the click of a button, so we must update it often
        if(props.biosignal){
            console.log('NEW BIOSIGNAL');
            console.log('Biosignal value: ', props.biosignal);
            biosignal = props.biosignal;
            // Update minimum and maximum values for new biometric
            findMinMax();
            // Draw needs to run again to plot the new graphs
            p5.drawingContext.clearRect(0, 0, p5.width, p5.height);
            p5.loop();
        }
    };

    const loadFile = (idx) => {
        tables.push(p5.loadTable(`${filepaths[idx].path}`, 'csv', 'header', () => {
            if(idx == filepaths.length - 1){ // Base case: if we have loaded the last file, go on with finding min & max values
                dataLoaded = true;
                findMinMax();
                // Run draw once more with the data we have
                p5.loop();
            }else{ // otherwise proceed with loading next file
                loadFile(idx+1);
            }
        }))
    }

    const getBiosignalIdx = () => {
        switch(biosignal){
            case 'HR':
                return 0;
            case 'GSR':
                return 1;
            case 'Temp':
                return 2;
            default:
                console.log('why?');
                break;
        }
    }

    const findMinMax = () => {
        // Resetting min and max vars
        min = 10000;
        max = 0;
        // Finding min and max from all tables
        // for chosen biometric
        const biosignalIdx = getBiosignalIdx();
        let currval, currtable;
        for(let f = 0; f < tables.length; f++){
            currtable = tables[f];
            for (let row = 0; row < currtable.getRowCount(); row++){
                currval = parseFloat(currtable.get(row, biosignalIdx));
                min = (() => {return currval < min ? currval : min})();
                max = (() => {return currval > max ? currval : max})();
            }
        }
        console.log('New min: ', min);
        console.log('New max: ', max);
    }

    p5.setup = () => {
        p5.colorMode(p5.HSB);
        const canvas_height = window.innerHeight;
        // const sibling_col = p5.select('#sibling_col');
        // const canvas_width = window.innerWidth  - sibling_col.elt.clientWidth;        
        // const canvas_width = window.innerWidth;
        const canvas_width = 600;
        // console.log('sibling_col: ', sibling_col.elt.clientWidth);
        console.log('canvas_width: ', canvas_width);
        p5.createCanvas(canvas_width, canvas_height);
        p5.noLoop();
    }

    let paddingHeight, participantOverallHeight;
    p5.draw = () => {
        p5.background(p5.color('#c2c2c2'));
        if(dataLoaded){
            paddingHeight = 20;
            participantOverallHeight = (p5.height - (tables.length - 1)*paddingHeight)/tables.length;
            console.log(participantOverallHeight);
            tables.map((table, idx) => {
                createGradient(table, idx);
            })
            p5.noLoop();
        }
    }

    const createGradient = (table, idx) => {
        const x = 0;
        const y = idx * (paddingHeight + participantOverallHeight);
        const w = p5.width;
        const h = participantOverallHeight;
        const x0 = 0;
        const x1 = p5.width;
        const y0 = y + h/2;
        const y1 = y0;
        const context = p5.drawingContext;
        let gradient = context.createLinearGradient(x0, y0, x1, y1);
        let colorStopPercent, brightness;
        const biosignalIdx = getBiosignalIdx();
        let currval, prevval = -1;
        for(let i = 0; i < table.getRowCount(); i+=128){
            currval = p5.floor(table.get(i, biosignalIdx));
            if(currval !== prevval){
                brightness = p5.map(currval, min, max, 0, 100);
                colorStopPercent = p5.map(i, 0, table.getRowCount(), 0, 1);
                gradient.addColorStop(colorStopPercent, p5.color(p5.hue(axisChoice), p5.saturation(axisChoice), brightness));    
            }
            prevval = currval;
        }
        context.fillStyle = gradient;
        p5.noStroke();
        p5.rect(x, y, w, h);
    }
}