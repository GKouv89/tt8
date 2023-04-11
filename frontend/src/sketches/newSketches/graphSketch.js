import '../p5.sound.min.js'
import '../p5.dom.min.js'
import '../p5.js'
import * as P5Class from "p5"

export function sketch(p5){
    let axisChoice;
    let filepaths = [];
    let tables = [];
    let biosignal;

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
            console.log(`biosignal: ${biosignal}`);
            // Draw needs to run once to plot the new graphs
            p5.loop();
        }
    };

    const loadFile = (idx) => {
        console.log('load');
        tables.push(p5.loadTable(`${filepaths[idx].path}`, 'csv', 'header', () => {
            if(idx == filepaths.length - 1){ // Base case: if we have loaded the last file, go on with finding min & max values
                dataLoaded = true;
                // Run draw once more with the data we have
                p5.loop();
            }else{ // otherwise proceed with loading next file
                loadFile(idx+1);
            }
        }))
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
            const canvas_height = p5.height;
            const canvas_width = p5.width;
            const participantCount = tables.length;
            const participantCanvasHeight = canvas_height/participantCount;
            for (const x of Array(participantCount).keys()){
                p5.line(0, x*participantCanvasHeight, canvas_width, x*participantCanvasHeight);
            }
            p5.noLoop();
        }
    }
}