import '../lib/p5.sound.min.js'
import '../lib/p5.dom.min.js'
import '../lib/p5.js'

export function sketch(p5){
    let axisChoice;
    let filepath;
    let table;
    let participant;
    let biosignal;
    let min, max;

    let dataLoaded = false;
    let active;

    p5.updateWithProps = props => {
        // These two are only initialized once, hence the two checks.
        if(filepath === undefined && props.file){ 
            filepath = props.file;
            loadFile();
        }
        if(participant === undefined && props.participant){
            participant = props.participant;
            readjustCanvas(props.participant);
        }
        if(axisChoice === undefined && props.color){
            axisChoice = props.color;
        }
        if(props.active === 'graph'){
            readjustCanvas(participant);
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
        canvas.style('display', 'flex');
        // p5.redraw();
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
        let currval;
        for (let row = 0; row < table.getRowCount(); row++){
            currval = parseFloat(table.get(row, biosignalIdx));
            min = (() => {return currval < min ? currval : min})();
            max = (() => {return currval > max ? currval : max})();
        }
    }

    let canvas;
    p5.setup = () => {
        const parent_col_width = window.innerWidth - p5.select(`.sonButtonColumn`).elt.clientWidth ;
        const canvas_height = 200; // arbitrary
        const canvas_width = parent_col_width; 
        canvas = p5.createCanvas(canvas_width, canvas_height);
        p5.noLoop();
    }

    const plotGraph = () => {
        const biosignalIdx = getBiosignalIdx();
        let x, y, currval;
        const rowCount = table.getRowCount();
        const paddingTopBottomRight = 10; 
        const paddingLeft = 50;
        // Draw axes
        const participantCanvasHeight = p5.height;
        const participantLowerHeight = paddingTopBottomRight;
        const participantHigherHeight = participantCanvasHeight - paddingTopBottomRight;
        const participantMinWidth = paddingLeft;
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

    p5.draw = () => {
        console.log('draw graph');
        p5.background('white');
        if(dataLoaded){
            plotGraph();
            p5.noLoop();
        }
    }
}