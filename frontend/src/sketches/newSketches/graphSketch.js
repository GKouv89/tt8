import '../lib/p5.sound.min.js'
import '../lib/p5.dom.min.js'
import '../lib/p5.js'
import * as P5Class from "p5"

export function sketch(p){
    let filepaths;
    let table;
    let id; // Is the participant number displayed on the canvas
    let biosignal;
    let min, max;

    let dataLoaded = false;
    let noFluctuation = false;

    let bio_meta, peak_meta, scene_meta;
    let view;

    p.updateWithProps = props => {
        // The following are only initialized once, hence the second check.
        if(props.immutable && filepaths == undefined){
            filepaths = props.immutable.files;
            id = props.immutable.id;
            bio_meta = props.immutable.bio_meta;
            peak_meta = props.immutable.peak_meta;
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
            p.resizeCanvas(entry.contentRect.width, p.height);
        });
    });

    const querySelector = document.querySelector('#visColumn-graph-1');
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

    const getBiosignalMU = () => {
        switch(biosignal){
            case 'HR':
                return 'Beats Per Minute (BPM)';
            case 'SC':
                return 'Micro-Siemens (uS)';
            case 'Temp':
                return 'Celcius (C)';
            default:
                console.log('why?');
                break;
        }
    }

    const findMinMax = (biosignal) => {
        noFluctuation = false;

        let chosen_bio = bio_meta.find(element => element.biometric == biosignal);
        min = chosen_bio['min_value'];
        max = chosen_bio['max_value'];

        if(min === max){
            noFluctuation = true;
        }
    }

    p.setup = () => {
        const first_col_width = p.select('#visColumn-graph-1').elt.clientWidth;
        // const canvas_height = 225;
        const canvas_height = 250;
        p.createCanvas(first_col_width, canvas_height);
    }

    const drawVertex = (row, startRow, endRow, bioIdx, minX, maxX, minY, maxY) => {
        const currval = table.get(row, bioIdx);
        const x = p.map(row, startRow, endRow, minX, maxX);
        const y = p.map(currval, min, max, maxY, minY);
        p.vertex(x, y);
    }

    const plotGraph = (participantMinWidth, participantMaxWidth, participantLowerHeight, participantHigherHeight) => {
        const biosignalIdx = getBiosignalIdx();
        if(peak_meta === undefined){ 
            p.stroke(p.color('magenta'));
        }else{
            function isPeak(biometric) {
                return biometric === biosignal;
            }
            peak_meta.peaks.find(isPeak) !== undefined ? p.stroke(p.color('red')) : p.stroke(p.color('magenta'));
        }
        if(noFluctuation){
            p.line(participantMinWidth, participantLowerHeight + (participantHigherHeight - participantLowerHeight) / 2, participantMaxWidth,participantLowerHeight + (participantHigherHeight - participantLowerHeight) / 2);
        }else{
            p.beginShape();
            const starting_row = scene_meta.is_superepisode ? scene_meta['starting_row'] : 0;
            const ending_row = scene_meta.is_superepisode ? scene_meta['ending_row'] : table.getRowCount();
            for (let row = starting_row; row < ending_row; row++)
            {
                drawVertex(row, starting_row, ending_row, biosignalIdx, participantMinWidth, participantMaxWidth, participantLowerHeight, participantHigherHeight);
            }
            p.endShape();
        }
    }

    const plotTaskView = (participantMinWidth, participantMaxWidth, participantLowerHeight, participantHigherHeight) => {
        const biosignalIdx = getBiosignalIdx();
        const rowCount = table.getRowCount();
        
        p.stroke(p.color('blue'));
        if(noFluctuation){
            // Perhaps some special handling necessary for this
            p.line(participantMinWidth, participantLowerHeight + (participantHigherHeight - participantLowerHeight) / 2, participantMaxWidth,participantLowerHeight + (participantHigherHeight - participantLowerHeight) / 2);
        }else{
            let row = 0;
            p.beginShape();
            let ending_row = scene_meta['starting_row'];    
            for(; row < ending_row; row++){
                drawVertex(row, 0, rowCount, biosignalIdx, participantMinWidth, participantMaxWidth, participantLowerHeight, participantHigherHeight);
            }
            p.endShape();
            if(peak_meta === undefined){
                p.stroke(p.color('magenta'));
            }else{
                function isPeak(biometric) {
                    return biometric === biosignal;
                }
                peak_meta.peaks.find(isPeak) !== undefined ? p.stroke(p.color('red')) : p.stroke(p.color('magenta'));
            }
            p.beginShape();

            ending_row = scene_meta['ending_row']; 
            for(; row < ending_row; row++){
                drawVertex(row, 0, rowCount, biosignalIdx, participantMinWidth, participantMaxWidth, participantLowerHeight, participantHigherHeight);
            }
            p.endShape();
            p.stroke(p.color('blue'));
            p.beginShape();

            ending_row = rowCount; 
            for(; row < ending_row; row++){
                drawVertex(row, 0, rowCount, biosignalIdx, participantMinWidth, participantMaxWidth, participantLowerHeight, participantHigherHeight);
            }
            p.endShape();
        }
    }

    const plot = () => {
        const paddingTopBottomRight = 10; 
        const paddingLeft = 50;
        const titleHeight = 25;
        const xAxisSpace = 25;
        const participantCanvasHeight = p.height;
        const participantLowerHeight = paddingTopBottomRight + titleHeight;
        const participantHigherHeight = participantCanvasHeight - paddingTopBottomRight - xAxisSpace;
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
        p.textSize(13);
        p.fill(p.color('black'));
        if(noFluctuation){
            p.text(`${min.toFixed(2)}`, participantMinWidth - 20, participantLowerHeight + (participantHigherHeight - participantLowerHeight) / 2);
        }else{
            p.text(`${min.toFixed(2)}`, participantMinWidth - 20, participantHigherHeight);
            p.text(`${max.toFixed(2)}`, participantMinWidth - 20, participantLowerHeight);
        }  
        const starting_time = view == 'task' ? scene_meta['task_start'] : scene_meta['starting_time'];
        const ending_time = view == 'task' ? scene_meta['task_end'] : scene_meta['ending_time'];
        // X axis values
        p.text(`${starting_time}`, participantMinWidth + 5, participantCanvasHeight - xAxisSpace + 5);
        p.text(`${ending_time}`, participantMaxWidth - 5, participantCanvasHeight - xAxisSpace + 5);

        // Draw measurement unit
        p.push();
        const angle = p.radians(270);
        p.rotate(angle);
        p.textAlign(p.CENTER, p.CENTER);
        p.translate(-170, -180);
        p.stroke('black');
        p.fill('black');
        p.textSize(14);
        p.text(getBiosignalMU(), participantMinWidth, participantHigherHeight - 20);
        p.pop();

        // Draw time unit
        p.push();
        p.textAlign(p.CENTER);
        p.stroke('black');
        p.fill('black');
        p.textSize(14);
        p.text('Time (min)', p.width /2, participantCanvasHeight - paddingTopBottomRight);
        p.pop();

        p.fill(p.color('white'));
        if(scene_meta.is_superepisode && view == 'task')
            plotTaskView(participantMinWidth, participantMaxWidth, participantLowerHeight, participantHigherHeight);
        else
            plotGraph(participantMinWidth, participantMaxWidth, participantLowerHeight, participantHigherHeight);
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
            p.background('white');
            plot();
            p.noLoop();
        }
    }
}