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

    const samplingRate = 128;

    let dataLoaded = false;
    
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
        // This one changes on the click of a button, so we must update it often
        if(props.biosignal){
            biosignal = props.biosignal;
            // Update minimum and maximum values for new biometric
            findMinMax();
            // Draw needs to run again to plot the new graphs
            p5.drawingContext.clearRect(0, 0, p5.width, p5.height);
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

    function readjustCanvas(participant) {
        console.log(p5.select(`#myRow-${participant}`).elt.clientWidth);
        console.log(p5.width);
        // canvas.parent(`myRow-${participant}`);
        canvas.parent(`visColumn-${participant}`);
        canvas.style('display', 'flex');
        // canvas.style('position', 'absolute');
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
        p5.colorMode(p5.HSB);
        // const parent_col_width = window.innerWidth - p5.select(`.sonButtonColumn`).elt.clientWidth - p5.select('.participantNoColumn').elt.clientWidth;
        const parent_col_width = window.innerWidth - p5.select(`.sonButtonColumn`).elt.clientWidth ;
        const canvas_height = 100; // arbitrary
        const canvas_width = parent_col_width - 150; // the subtraction prevents the elements of the other column from wrapping. Not foolproof.
        canvas = p5.createCanvas(canvas_width, canvas_height);
        p5.noLoop();
    }

    p5.draw = () => {
        p5.background(p5.color('#c2c2c2'));
        if(dataLoaded){

            createGradient();
            p5.noLoop();
        }
    }

    const createGradient = () => {
        const x = 0;
        const y = 0;
        const w = p5.width;
        const h = p5.height;
        const x0 = 0;
        const x1 = p5.width;
        const y0 = y + h/2;
        const y1 = y0;
        const context = p5.drawingContext;
        let gradient = context.createLinearGradient(x0, y0, x1, y1);
        let colorStopPercent, brightness;
        const biosignalIdx = getBiosignalIdx();
        let currval, prevval = -1;
        for(let i = 0; i < table.getRowCount(); i+=samplingRate){
            currval = p5.floor(table.get(i, biosignalIdx));
            if(currval !== prevval){
                brightness = p5.map(currval, min, max, 0, 100);
                colorStopPercent = p5.map(i, 0, table.getRowCount(), 0, 1);
                gradient.addColorStop(colorStopPercent, p5.color(p5.hue(axisChoice), p5.saturation(axisChoice), brightness));    
            }
            prevval = currval;
        }
        context.fillStyle = gradient;
        p5.rect(x, y, w, h);
    }
}