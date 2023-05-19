import '../lib/p5.sound.min.js'
import '../lib/p5.dom.min.js'
import '../lib/p5.js'

export function sketch(p5){
    let axisChoice;
    let filepath;
    let table;
    let participant; // Searches for appropriate grid row to adjust width
    let id; // Is the participant number displayed on the canvas
    let biosignal;
    let min, max;

    let dataLoaded = false;
    let active;

    let noFluctuation = false;

    p5.updateWithProps = props => {
        // These two are only initialized once, hence the two checks.
        if(filepath === undefined && props.file){ 
            filepath = props.file;
            loadFile();
        }
        if(participant === undefined && props.participant){
            participant = props.participant;
        }
        if(axisChoice === undefined && props.color){
            axisChoice = props.color;
        }
        if(props.active === 'graph' && participant !== undefined){
            if(active !== props.active){
                readjustCanvas(participant);
                active = props.active;
            }
        }
        if(props.active === 'color'){
            active = props.active;
            p5.noLoop();
        }
        // This one changes on the click of a button, so we must update it often
        if(props.biosignal !== biosignal){
            biosignal = props.biosignal;
            // Update minimum and maximum values for new biometric
            findMinMax();
            // Draw needs to run again to plot the new graphs
            p5.loop();
        }
        if(id === undefined){
            id = props.id;
        }
    };

    const loadFile = () => {
        table = p5.loadTable(filepath, 'csv', 'header', () => {
            dataLoaded = true;
            findMinMax();
            // Run draw once more with the data we have
            p5.loop();
        })
    }

    // when participant is defined,
    // we find the containing row by id
    // then we adjust the sketch's width
    // according to said row's width.
    // participant is passed through props
    // and is not available when setup runs
    // so in order to avoid a race condition
    // this must take place once props are updated
    
    function readjustCanvas(participant) {
        p5.resizeCanvas(p5.select(`#visColumn-graph-${participant}`).elt.clientWidth, p5.height);
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
        noFluctuation = false;
        // Finding min and max from all tables
        // for chosen biometric
        const biosignalIdx = getBiosignalIdx();
        let currval;
        for (let row = 0; row < table.getRowCount(); row++){
            currval = parseFloat(table.get(row, biosignalIdx));
            min = (() => {return currval < min ? currval : min})();
            max = (() => {return currval > max ? currval : max})();
        }
        if(min === max){
            noFluctuation = true;
        }
    }

    p5.setup = () => {
        const parent_col_width = 11*p5.select('#rowContainer-graph').elt.clientWidth/12;
        const canvas_height = 225;
        p5.createCanvas(parent_col_width, canvas_height);
    }

    const plotGraph = () => {
        const biosignalIdx = getBiosignalIdx();
        let x, y, currval;
        const rowCount = table.getRowCount();
        const paddingTopBottomRight = 10; 
        const paddingLeft = 50;
        const titleHeight = 25;
        const participantCanvasHeight = p5.height;
        const participantLowerHeight = paddingTopBottomRight + titleHeight;
        const participantHigherHeight = participantCanvasHeight - paddingTopBottomRight;
        const participantMinWidth = paddingLeft;
        const participantMaxWidth = p5.width - paddingTopBottomRight;
        // Draw title
        p5.textAlign(p5.CENTER);
        p5.textSize(16);
        p5.stroke('black');
        p5.fill('black');
        p5.text(`Participant ${id}`, p5.width /2, (paddingTopBottomRight + titleHeight) / 2);
        // Draw axes
        // y axis
        p5.stroke(p5.color('black'));
        p5.line(participantMinWidth, participantHigherHeight, participantMinWidth, participantLowerHeight);
        // x axis
        p5.line(participantMinWidth, participantHigherHeight, participantMaxWidth, participantHigherHeight);
        // in case there is no fluctuation of the biosignal,
        // there is only one value on the y axis
        p5.textSize(11);
        p5.fill(p5.color('black'));
        if(noFluctuation){
            p5.text(`${p5.floor(min)}`, participantMinWidth - 20, participantLowerHeight + (participantHigherHeight - participantLowerHeight) / 2);
        }else{
            p5.text(`${p5.floor(min)}`, participantMinWidth - 20, participantHigherHeight);
            p5.text(`${p5.floor(max)}`, participantMinWidth - 20, participantLowerHeight);
        }        

        p5.fill(p5.color('white'));
        p5.stroke(p5.color('red'));
        if(noFluctuation){
            p5.line(participantMinWidth, participantLowerHeight + (participantHigherHeight - participantLowerHeight) / 2, participantMaxWidth,participantLowerHeight + (participantHigherHeight - participantLowerHeight) / 2);
        }else{
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
    }

    p5.draw = () => {
        p5.background('white');
        if(dataLoaded){
            plotGraph();
            if(participant !== undefined){
                // the grid is adjusting on the first render
                // at some point, all columns take the width they must
                // the draw loop is running, and when this happens,
                // the change is detected and the width is also adjusted appropriately.
                const parent_col_width = p5.select(`#visColumn-graph-${participant}`).elt.clientWidth;
                if(parent_col_width !== p5.width){
                    readjustCanvas(participant);
                }
            }
        }
    }
}