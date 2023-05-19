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
        // This one changes on the click of a button, so we must update it often
        if(props.biosignal){
            biosignal = props.biosignal;
            // Update minimum and maximum values for new biometric
            findMinMax();
            // Draw needs to run again to plot the new graphs
            p5.drawingContext.clearRect(0, 0, p5.width, p5.height);
            p5.loop();
        }
        if(props.active === 'color' && participant !== undefined){
            if(active !== props.active){
                readjustCanvas(participant);
                active = props.active;
            }
        }
        if(props.active === 'graph'){
            active = props.active;
            p5.noLoop();
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
        p5.resizeCanvas(p5.select(`#visColumn-color-${participant}`).elt.clientWidth, p5.height);
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
        p5.colorMode(p5.HSB);
        
        // width is roughly 11 twelvthes, as it should because of flexbox.
        // this will change later, but it is good enough for setup
        const parent_col_width = 11*p5.select('#rowContainer-color').elt.clientWidth/12;
        const canvas_height = 100; // arbitrary
        
        p5.createCanvas(parent_col_width, canvas_height);
        p5.noLoop();
    }

    p5.draw = () => {
        p5.background(p5.color('#c2c2c2'));
        if(dataLoaded){
            createGradient();
            if(participant !== undefined){
                // the grid is adjusting on the first render
                // at some point, all columns take the width they must
                // the draw loop is running, and when this happens,
                // the change is detected and the width is also adjusted appropriately.
                const parent_col_width = p5.select(`#visColumn-color-${participant}`).elt.clientWidth;
                if(parent_col_width !== p5.width){
                    readjustCanvas(participant);
                }
            }
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
        if(noFluctuation){
            p5.fill(axisChoice);
        }else{
            let currval, prevval = -1;
            for(let i = 0; i < table.getRowCount(); i+=20){
                currval = parseFloat(table.get(i, biosignalIdx)).toFixed(2);
                if(currval !== prevval){
                    brightness = p5.map(currval, min, max, 0, 100);
                    colorStopPercent = p5.map(i, 0, table.getRowCount(), 0, 1);
                    gradient.addColorStop(colorStopPercent, p5.color(p5.hue(axisChoice), p5.saturation(axisChoice), brightness));
                }
                prevval = currval;
            }
            context.fillStyle = gradient;
        }
        p5.rect(x, y, w, h);
    }
}