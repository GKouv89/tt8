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

    let task_meta, bio_meta;
    let view;

    p.updateWithProps = props => {
        // The following are only initialized once, hence the second check.
        if(props.immutable && filepath == undefined){
            filepath = props.immutable.file;
            table = p.loadTable(filepath, 'csv', 'header', () => {
                findMinMax();
                dataLoaded = true;
            })
            axisChoice = props.immutable.color;
            id = props.immutable.id;
            task_meta = props.immutable.task_meta;    
            bio_meta = props.immutable.bio_meta;
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

        if(view === undefined && props.view){
            view = props.view;
        }else if(view !== undefined && props.view !== view){
            view = props.view;
            p.loop();
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
            case 'SC':
                return 1;
            case 'Temp':
                return 2;
            default:
                console.log('why?');
                break;
        }
    }

    const findMinMax = () => {
        noFluctuation = false;
        let chosen_bio = bio_meta.find(element => element['biometric'] == biosignal);
        min = chosen_bio['min_value'];
        max = chosen_bio['max_value'];

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
        const rowCount = table.getRowCount();
        if(noFluctuation){
            p.fill(axisChoice);
        }else{
            let currval, prevval = -1;
            let starting_row, ending_row;
            if(view === 'task'){
                starting_row = 0;
                ending_row = rowCount;
            }else{
                starting_row = task_meta['starting_row'];
                ending_row = task_meta['ending_row'];
            }
            const min_fixed = min.toFixed(2);
            const max_fixed = max.toFixed(2);
            for(let i = starting_row; i < ending_row; i+=20){
                currval = parseFloat(table.get(i, biosignalIdx)).toFixed(2);
                if(currval !== prevval){
                    brightness = p.map(currval, min_fixed, max_fixed, 0, 100);
                    if(brightness < 0 || brightness > 100){
                        console.log('invalid lightness or darkness');
                    }else if(brightness == 0 || brightness == 100){
                        console.log('extreme light or dark');
                    }
                    colorStopPercent = p.map(i, starting_row, ending_row, 0, 1);
                    gradient.addColorStop(colorStopPercent, p.color(p.hue(axisChoice), p.saturation(axisChoice), brightness));
                }
                prevval = currval;
            }
            context.fillStyle = gradient;
        }
        p.rect(x, y, w, h);
        if(view == 'task'){
            p.push();
            p.strokeWeight(5);
            axisChoice === '#FFFFFF' ? p.stroke(p.color('red')) : p.stroke(p.color('white'));
            const line1_x = p.map(task_meta['starting_row'], 0, rowCount, 0, p.width);
            const line2_x = p.map(task_meta['ending_row'], 0, rowCount, 0, p.width);
            p.line(line1_x, 0, line1_x, p.height);
            p.line(line2_x, 0, line2_x, p.height);
            p.pop();
        }
    }
}