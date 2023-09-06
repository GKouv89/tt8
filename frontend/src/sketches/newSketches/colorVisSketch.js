import '../lib/p5.sound.min.js'
import '../lib/p5.dom.min.js'
import '../lib/p5.js'
import * as P5Class from "p5"

export function sketch(p){
    let axisChoice;
    let filepaths;
    let table;
    let id;
    let biosignal;
    let min, max;

    let dataLoaded = false;
    let noFluctuation = false;

    let scene_meta, bio_meta;
    let view;

    p.updateWithProps = props => {
        // The following are only initialized once, hence the second check.
        if(props.immutable && filepaths == undefined){
            filepaths = props.immutable.files;
            axisChoice = props.immutable.color;
            id = props.immutable.id;
            bio_meta = props.immutable.bio_meta;
            scene_meta = props.immutable.scene_meta;
            loadFiles(props.immutable.files);
        }
        // This one changes on the click of a button, so we must update it often
        if(biosignal === undefined){
            biosignal = props.biosignal;
            findMinMax(props.biosignal);
        }else if(biosignal !== undefined && biosignal !== props.biosignal){
            biosignal = props.biosignal;
            // Draw needs to run again to plot the new graphs
            dataLoaded = false;
            // Update minimum and maximum values for new biometric
            findMinMax(props.biosignal);
            dataLoaded = true;
            p.loop();
        }

        if(view === undefined){
            if(!props.immutable.scene_meta.is_superepisode){
                view = 'scene';
            }else{
                view = props.view;
            }
        }else if(props.immutable.scene_meta.is_superepisode && props.view !== view){
            view = props.view;
            p.loop();
        }
    };

    // I know for a fact that there are at most two tables and this is why this code is not generalized
    let table1, table2;
    let table1Loaded = false, table2Loaded = false;
    
    const loadFiles = (files) => {
        if(!scene_meta.is_superepisode || files.length == 1){
            table = p.loadTable(files[0], 'csv', 'header', () => {dataLoaded = true});
        }else{
            table1 = p.loadTable(files[0], 'csv', 'header', () => {table1Loaded = true});
            table2 = p.loadTable(files[1], 'csv', 'header', () => {table2Loaded = true});
        }
    }

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

    const findMinMax = (biosignal) => {
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
        if(dataLoaded || (table1Loaded && table2Loaded)){
            if(scene_meta.is_superepisode && table == undefined && table1Loaded && table2Loaded){
                // in this case, there is a table concatenation waiting to happen
                table = new P5Class.Table();
                for(let j = 0; j < 3; j++){
                    table.addColumn();
                }
                for(let i = 0; i < table1.getRowCount(); i++){
                    let newRow = table.addRow();
                    for(let j = 0; j < 3; j++){
                        newRow.set(j, table1.get(i, j));
                    }
                }
                for(let i = 0; i < table2.getRowCount(); i++){
                    let newRow = table.addRow();
                    for(let j = 0; j < 3; j++){
                        newRow.set(j, table2.get(i, j));
                    }
                }
                dataLoaded = true;
            }
            // either there was one table all along or there were two and they were concatenated. In any case, we're ready to begin.
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
            starting_row = view === 'scene' && scene_meta.is_superepisode ? scene_meta['starting_row'] : 0;
            ending_row = view === 'scene' && scene_meta.is_superepisode ? scene_meta['ending_row'] : rowCount;
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
            const line1_x = p.map(scene_meta['starting_row'], 0, rowCount, 0, p.width);
            const line2_x = p.map(scene_meta['ending_row'], 0, rowCount, 0, p.width);
            p.line(line1_x, 0, line1_x, p.height);
            p.line(line2_x, 0, line2_x, p.height);
            p.pop();
        }
    }
}