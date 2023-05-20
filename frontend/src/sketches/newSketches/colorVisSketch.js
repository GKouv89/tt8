import '../lib/p5.sound.min.js'
import '../lib/p5.dom.min.js'
import '../lib/p5.js'

export function sketch(p){
    let axisChoice;
    let filepath;
    let table;
    let id;
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
            });
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
            p.drawingContext.clearRect(0, 0, p.width, p.height);
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
            p.drawingContext.clearRect(0, 0, p.width, p.height);
            p.resizeCanvas(entry.contentRect.width, p.height);
        });
    });

    const querySelector = document.querySelector('#visColumn-color-1');
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
        p.colorMode(p.HSB);
        
        const first_col_width = p.select('#visColumn-color-1').elt.clientWidth;
        const canvas_height = 100;
        p.createCanvas(first_col_width, canvas_height);
    }

    p.draw = () => {
        console.log('gradient');
        if(dataLoaded){
            p.drawingContext.clearRect(0, 0, p.width, p.height);
            createGradient();
            p.noLoop();
        }
    }

    const createGradient = () => {
        const x = 0;
        const y = 0;
        const w = p.width;
        const h = p.height;
        const x0 = 0;
        const x1 = p.width;
        const y0 = y + h/2;
        const y1 = y0;
        const context = p.drawingContext;
        let gradient = context.createLinearGradient(x0, y0, x1, y1);
        let colorStopPercent, brightness;
        const biosignalIdx = getBiosignalIdx();
        if(noFluctuation){
            p.fill(axisChoice);
        }else{
            let currval, prevval = -1;
            for(let i = 0; i < table.getRowCount(); i+=20){
                currval = parseFloat(table.get(i, biosignalIdx)).toFixed(2);
                if(currval !== prevval){
                    brightness = p.map(currval, min, max, 0, 100);
                    colorStopPercent = p.map(i, 0, table.getRowCount(), 0, 1);
                    gradient.addColorStop(colorStopPercent, p.color(p.hue(axisChoice), p.saturation(axisChoice), brightness));
                }
                prevval = currval;
            }
            context.fillStyle = gradient;
        }
        p.rect(x, y, w, h);
    }
}