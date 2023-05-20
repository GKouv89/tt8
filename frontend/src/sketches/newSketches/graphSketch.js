import '../lib/p5.sound.min.js'
import '../lib/p5.dom.min.js'
import '../lib/p5.js'

export function sketch(p){
    let axisChoice;
    let filepath;
    let table;
    let id; // Is the participant number displayed on the canvas
    let biosignal;
    let min, max;

    let dataLoaded = false;
    let noFluctuation = false;

    p.updateWithProps = props => {
        // These two are only initialized once, hence the two checks.
        if(filepath === undefined && props.file){ 
            filepath = props.file;
            table = p.loadTable(props.file, 'csv', 'header', () => {
                findMinMax();
                dataLoaded = true;
            })
        }
        if(axisChoice === undefined && props.color){
            axisChoice = props.color;
        }
        // This one changes on the click of a button, so we must update it often
        if(biosignal === undefined){
            biosignal = props.biosignal;
        }else if(biosignal !== undefined && biosignal !== props.biosignal){
            biosignal = props.biosignal;
            // Draw needs to run again to plot the new graphs
            dataLoaded = false;
            p.loop();
            // Update minimum and maximum values for new biometric
            findMinMax();
            dataLoaded = true;
        }

        if(id === undefined){
            id = props.id;
        }
    };

    const resizeObserver = new ResizeObserver((entries) => {
        entries.forEach(entry => {
            p.resizeCanvas(entry.contentRect.width, p.height);
        });
    });

    const querySelector = document.querySelector('#visColumn-graph-1');
    resizeObserver.observe(querySelector);

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

    p.setup = () => {
        const first_col_width = p.select('#visColumn-graph-1').elt.clientWidth;
        const canvas_height = 225;
        p.createCanvas(first_col_width, canvas_height);
    }

    const plotGraph = () => {
        const biosignalIdx = getBiosignalIdx();
        let x, y, currval;
        const rowCount = table.getRowCount();
        const paddingTopBottomRight = 10; 
        const paddingLeft = 50;
        const titleHeight = 25;
        const participantCanvasHeight = p.height;
        const participantLowerHeight = paddingTopBottomRight + titleHeight;
        const participantHigherHeight = participantCanvasHeight - paddingTopBottomRight;
        const participantMinWidth = paddingLeft;
        const participantMaxWidth = p.width - paddingTopBottomRight;
        // Draw title
        p.textAlign(p.CENTER);
        p.textSize(16);
        p.stroke('black');
        p.fill('black');
        p.text(`Participant ${id}`, p.width /2, (paddingTopBottomRight + titleHeight) / 2);
        // Draw axes
        // y axis
        p.stroke(p.color('black'));
        p.line(participantMinWidth, participantHigherHeight, participantMinWidth, participantLowerHeight);
        // x axis
        p.line(participantMinWidth, participantHigherHeight, participantMaxWidth, participantHigherHeight);
        // in case there is no fluctuation of the biosignal,
        // there is only one value on the y axis
        p.textSize(11);
        p.fill(p.color('black'));
        if(noFluctuation){
            p.text(`${p.floor(min)}`, participantMinWidth - 20, participantLowerHeight + (participantHigherHeight - participantLowerHeight) / 2);
        }else{
            p.text(`${p.floor(min)}`, participantMinWidth - 20, participantHigherHeight);
            p.text(`${p.floor(max)}`, participantMinWidth - 20, participantLowerHeight);
        }        

        p.fill(p.color('white'));
        p.stroke(p.color('red'));
        if(noFluctuation){
            p.line(participantMinWidth, participantLowerHeight + (participantHigherHeight - participantLowerHeight) / 2, participantMaxWidth,participantLowerHeight + (participantHigherHeight - participantLowerHeight) / 2);
        }else{
            p.beginShape();
            for (let row = 0; row < rowCount; row++)
            {
                currval = table.get(row, biosignalIdx);
                x = p.map(row, 0, rowCount, participantMinWidth, participantMaxWidth);
                y = p.map(currval, min, max, participantHigherHeight, participantLowerHeight);
                
                p.vertex(x, y);
            }
            p.endShape();
        }
    }

    p.draw = () => {
        if(dataLoaded){
            p.background('white');
            plotGraph();
            p.noLoop();
        }
    }
}