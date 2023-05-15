import '../lib/p5.sound.min.js'
import '../lib/p5.dom.min.js'
import '../lib/p5.js'

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
            for (let row = 0; row < currtable.getRowCount(); row++){
                currval = parseFloat(currtable.get(row, biosignalIdx));
                min = (() => {return currval < min ? currval : min})();
                max = (() => {return currval > max ? currval : max})();
            }
        }
    }

    p5.setup = () => {
        console.log('In graph sketch.');
        const parent_col_width = p5.select('#tabColumn').elt.offsetWidth;
        const canvas_height = window.innerHeight;
        const canvas_width = parent_col_width - 100; // the subtraction prevents the elements of the other column from wrapping. Not foolproof.
        const canvas = p5.createCanvas(canvas_width, canvas_height);
        canvas.style('margin', '0');
        canvas.style('display', 'block');
        p5.noLoop();
    }

    const plotGraph = (idx) => {
        const table = tables[idx];
        const biosignalIdx = getBiosignalIdx();
        let x, y, currval;
        const rowCount = table.getRowCount();
        const paddingTopBottomRight = 10; 
        const paddingLeft = 50;
        // Draw axes
        const participantCanvasHeight = (p5.height - headerPadding)/tables.length;
        const participantLowerHeight = headerPadding + idx*participantCanvasHeight + paddingTopBottomRight;
        const participantHigherHeight = headerPadding + (idx+1)*participantCanvasHeight - paddingTopBottomRight;
        const participantMinWidth = indicatorWidth + paddingLeft;
        const participantMaxWidth = p5.width - paddingTopBottomRight;
        // y axis
        p5.stroke(p5.color('black'));
        p5.line(participantMinWidth, participantHigherHeight, participantMinWidth, participantLowerHeight);
        // x axis
        p5.line(participantMinWidth, participantHigherHeight, participantMaxWidth, participantHigherHeight);
        p5.textSize(11);
        p5.fill(p5.color('black'));
        p5.text(`${p5.floor(min)}`, participantMinWidth - 20, participantHigherHeight);
        p5.text(`${p5.floor(max)}`, participantMinWidth - 20, participantLowerHeight);
        p5.fill(p5.color('white'));
        p5.stroke(p5.color('red'));
        p5.beginShape();
        for (let row = 0; row < rowCount; row++)
        {
            currval = table.get(row, biosignalIdx);
            x = p5.map(row, 0, rowCount, participantMinWidth, participantMaxWidth);
            y = p5.map(currval, min, max, participantHigherHeight, participantLowerHeight);
            p5.vertex(x, y);
        }
        p5.endShape();
    }

    const headerPadding = 50;
    p5.draw = () => {
        p5.background('white');
        if(dataLoaded){
            indicatorWidth = p5.floor(p5.width/10);
            // Header
            const canvas_width = p5.width;
            p5.fill(p5.color('#c2c2c2'));
            p5.rect(0, 0, canvas_width, headerPadding);
            p5.fill(p5.color('black'));
            p5.textSize(32);
            p5.textAlign(p5.LEFT, p5.CENTER);
            p5.text(`Participants`, 0, 25);
            p5.fill(p5.color('white'));
            const participantCount = tables.length;
            const participantCanvasHeight = (p5.height - headerPadding)/participantCount;
            p5.stroke('black');
            for (const x of Array(participantCount).keys()){
                p5.line(0, headerPadding + x*participantCanvasHeight, canvas_width, headerPadding + x*participantCanvasHeight);
                participantIndicator(x);
                p5.stroke('red');
                plotGraph(x);
                p5.stroke('black');
            }
            if(p5.isLooping())
                p5.noLoop();
        }
    }

    let indicatorWidth; 
    const participantIndicator = (idx) => {
        console.log('In participant indicator');
        const participantCanvasHeight = (p5.height - headerPadding)/tables.length;
        p5.fill(p5.color('#c2c2c2'));
        p5.rect(0, headerPadding +  idx*participantCanvasHeight, indicatorWidth, participantCanvasHeight);
        p5.fill(p5.color('black'));
        p5.textSize(indicatorWidth/3);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.text(`${filepaths[idx].participant}`, indicatorWidth/2, headerPadding + idx*participantCanvasHeight + participantCanvasHeight/2);
        p5.fill(p5.color('white'));
    }
}