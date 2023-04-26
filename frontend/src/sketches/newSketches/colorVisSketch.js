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
            biosignal = props.biosignal;
            // Update minimum and maximum values for new biometric
            findMinMax();
            // Draw needs to run again to plot the new graphs
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
            console.log(currtable.getRowCount());
            for (let row = 0; row < currtable.getRowCount(); row++){
                currval = parseFloat(currtable.get(row, biosignalIdx));
                min = (() => {return currval < min ? currval : min})();
                max = (() => {return currval > max ? currval : max})();
            }
        }
    }

    p5.setup = () => {
        const parent_col = p5.select('#parent_col');
        const canvas_height = window.innerHeight - parent_col.elt.offsetTop;
        p5.createCanvas(600, canvas_height);
        p5.noLoop();
    }

    p5.draw = () => {
        p5.background('white');
        if(dataLoaded){
            console.log('loaded');
            p5.noLoop();
        }
    }
}