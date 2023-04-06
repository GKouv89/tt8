import './p5.sound.min.js'
import './p5.dom.min.js'
import './p5.js'
import * as P5Class from "p5"

import MidiWriter from 'midi-writer-js';

export function sketch(p5){
    // let prefixPath = `${window.location.protocol}//${window.location.hostname}`; // This is the prefix for the file server
    let filepaths = [];
    let tables = [];

    let axisColor;

    let sonificationRunning = false, isPaused = false, isForcedRecStop = false;
    document.addEventListener("visibilitychange", () => {
        console.log(document.visibilityState);
        console.log(p5.getAudioContext().state);
        if(!isRecording && !isPaused && sonificationRunning){
            if(document.visibilityState == "hidden"){
                p5.noLoop();
                stopSound();
            }
            else{
                p5.loop();
                startSound();
            }
        }else if(isRecording){
            // Recording must be fully stopped, and every counter and
            // buffer must be restored to its previous state
            // GUI must also be stored
            // So, pretty much what stopSonification does
            // This also resets the flags that are used above in this handler
            // and when the window refocuses, none of the previous flow statements
            // will come true 
            // The only thing that needs to be handled additionally is resetting the video/audio buffers
            // For that, isForcedRecStop is set to true, and everything is then 
            // handled conditionally by stopSonification
            isForcedRecStop = true;
            stopSonification();
        }

    });

    function loadFile(idx){
        tables.push(p5.loadTable(`${filepaths[idx].path}`, 'csv', 'header', () => {
            if(idx == filepaths.length - 1){ // Base case: if we have loaded the last file, go on with finding min & max values
                moreSetup();
            }else{ // otherwise proceed with loading next file
                loadFile(idx+1);
            }
        }))
    }

    let GUIcontainer; // Contains both the GUI and the show/hide button, because the second must be handled seperately from the first visibility-wise.
    // This does what setup can't do because the files haven't loaded yet
    
    let setupFinished = false; // This becomes true only after moreSetup has run enough to fill the canvas with its actual colors.
    // That means, that the props have been updated, every file has been properly loaded, etc.

    function moreSetup(){
        findMinMax();
        numberOfReps = p5.ceil(tables[0].getRowCount()/samplingRate);
        // console.log('NUMBER OF REPS: ', numberOfReps);
        let rowContainer = p5.select('#sketch-ribbon-container');
        biometricAnalyticsContainer = createBiometricValueRibbon().parent(rowContainer); /* .parent(guiContainer).addClass('column-item') */
        GUIcontainer = p5.createDiv().addClass('parentContainer').style('width', '50%');
        studioContainer = createGUI().parent(GUIcontainer).addClass('p5EpisodeGUI-column-item');
        // Positioning the GUI buttons right above the canvas
        // Every time the window is resized, they are repositioned appropriately.
        centerGUI();

        hideGUI = p5.createButton('Hide GUI').parent(GUIcontainer).addClass('p5EpisodeGUI-column-item');
        hideGUI.mousePressed(() => {
            if(!isGUIhidden){
                hideGUI.html('Show GUI')
                studioContainer.style('display', 'none')
                biometricAnalyticsContainer.style('display', 'none')
                centerGUI(); // Running this again to position the only remaining button nicely
            }else{
                hideGUI.html('Hide GUI')
                studioContainer.style('display', 'flex')
                biometricAnalyticsContainer.style('display', 'flex')
                centerGUI(); // Running this again to make sure the GUI is positioned nicely
                // because if the window is resized while the GUI is hidden, it overlaps with the biometric ribbon
                // after it is visible again.
            }
            isGUIhidden = !isGUIhidden
            initializeVisuals() // Calling this again to remove or redraw the color stop indicators
        })

        setupFinished = true;
        initializeVisuals();
        initializeAudio();
        p5.noLoop();
        // console.log('repNo: ', repNo);
    }
    
    p5.updateWithProps = props => {
        if(props.color){
            axisColor = props.color;
        }
        if(props.files){
            filepaths = props.files;
            // Loading all files from the get go
            // This will call itself recursively
            loadFile(0);
        }
    }
        
    let min , max
    
    let old_colors = [], new_colors = []
    let numberOfReps = 0
    
    let frameNo = 0
    let frameRate = 25
    let samplingRate = 100
    let repNo = 0
    
    let guiContainer, biometricAnalyticsContainer, studioContainer
    // guiContainer is a parent to the following two.
    // biometricAnalyticsContainer contains the grey ribbon at the top part of the screen
    // where the biometrics' ranges and current values are displayed
    // studioContainer has the sliders, buttons and radio buttons that control
    // the visualization and sonification parameters.
    
    let gradient
    
    let oscillators = [] // One per participant
    let envelopes = [] // One per participant
    let env_trigger_loops = [] // Triggers the corresponding envelope, which in turn controls the corresponding oscillator's amplitude. 
    // The sound loop's interval determines when the envelope is triggered, and the interval varies in accordance with the variations in the participant's heart rate.
    
    let currentC = 60; // Participant's oscillators' frequencies start from middle C
    let startingOctave;

    let minAmp = 0.2, maxAmp = 0.5;
    let playButton, pauseButton, stopButton; // Buttons that control the sonification and visualization.
    let playAndExportButton, playRecordingButton; // Buttons that have to do with recording and exporting the sonification and visualization.
    let hideGUI; // This button will show or hide the GUI, biometric analytics container, and color stop indicators (the 4 rectangles)
    let isGUIhidden = false; // This will check whether the above button must toggle visibility on or off
    let downloadButton, downloadVideoButton;
    let attackSlider, decaySlider;
    let amplitudeSlider;
    let oscillatorTypeRadio;
    let isRecording = false;
    let recorder; // This is used to record the sound from our sketch
    let recordingSoundFile; // This is where the sound recording is kept
    // Used for canvas recording
    let canvasRecorder, videoChunks, videoBlob;
    
    let universalReleaseTime = 0.005; // This is the smallest value that didn't produce audible clicks for 4 participants
    
    function findMinMax(){
        let currval
        // The following arrays contain the minimum and maximum of all biometrics PER PARTICIPANT
        // 1st dimension (row): biometric
        // 2nd dimension (column): participant
        min = Array(tables[0].getColumnCount());
        max = Array(tables[0].getColumnCount());
        for(let i = 0; i < min.length; i++){
            min[i] = Array(tables.length).fill(1000);
            max[i] = Array(tables.length).fill(0);
        }
        for(let f = 0; f < tables.length; f++){
            for(let i = 0; i < tables[f].getRowCount(); i += samplingRate){
                for(let j = 0; j < tables[f].getColumnCount(); j++){
                    currval = parseFloat(tables[f].get(i, j));
                    min[j][f] = (() => {return currval < min[j][f] ? currval : min[j][f]})();
                    max[j][f] = (() => {return currval > max[j][f] ? currval : max[j][f]})();
                }
            }
        }
    }

    function centerGUI(){
        // The middle of the GUI container on the x axis
        // must align with the middle of the canvas on the x axis.        
        let canvasParent = p5.select('#sketch-canvas-container-large').elt.getBoundingClientRect();
        let studioContainerRect = studioContainer.elt.getBoundingClientRect();
        // console.log('studioContainerRect: ', studioContainerRect);
        // Positioning the GUI buttons right above the canvas, centered.
        // We must also take into consideration how much we've scrolled as to properly find the vertical position of the container
        let canvasParentTop = canvasParent.top + window.scrollY; 

        // // Centering the container. Find out what the difference in the container's width
        // // and the parent container's width is and use it as an offset on the x axis.
        // let canvasParentCenter = (canvasParent.right - canvasParent.left)/2;        
        // let studioContainerCenter = (studioContainerRect.right - studioContainerRect.left)/2;
        // let diff = canvasParentCenter - studioContainerCenter;
        
        // let offset = canvasParent.left + diff;
        // GUIcontainer.position(offset, canvasParentTop);
        // Temporarily placed GUI to the left of the canvas, because centering wasn't as precise 
        // as I would have liked it to be.
        GUIcontainer.position(canvasParent.left, canvasParentTop);
    }
    
    // N squares where N is no of participants, that show min and max for all biometrics and current values (and maybe brightness value that is the result of the 'normalization')
    let biometricCurrentValues
    function createBiometricValueRibbon(){
        let container = p5.createDiv().addClass('p5EpisodeGUI-container').addClass('greyRibbon')
        let biometricNames = ['HR', 'GSR', 'Temp']
        // Keeping current values of all biometrics for all participants to change later
        biometricCurrentValues = Array(3)
        for(let i = 0; i < 3; i++){
            biometricCurrentValues[i] = Array(tables.length)
        }
        tables.map((table, idx) => {
            let square = p5.createDiv().addClass('p5EpisodeGUI-row-item').addClass('greyRibbon').parent(container)
            p5.createDiv(`P${idx+1}`).addClass('p5EpisodeGUI-column-item').parent(square)
            for(let i = 0; i < tables[idx].getColumnCount(); i++){
                p5.createDiv(`${biometricNames[i]}: [${min[i][idx].toFixed(2)}, ${max[i][idx].toFixed(2)}]`).addClass('p5EpisodeGUI-column-item').parent(square)
                biometricCurrentValues[i][idx] = p5.createP(`Currently: ${parseFloat(table.get(repNo, i)).toFixed(2)}`).addClass('p5EpisodeGUI-column-item').parent(square)
            }
        })
        return container
    }
    
    function updateCurrentBiometricValues(){
        tables.map((table, idx) => {
            // console.log('In updateCurrentBiometricValues, with repNo = ', repNo);
            for(let i = 0; i < table.getColumnCount(); i++){
                biometricCurrentValues[i][idx].html(`Currently: ${parseFloat(table.get(repNo*samplingRate, i)).toFixed(2)}`)
            }
        })
    }
    
    function createGUI(){
        let container = p5.createDiv().addClass('parentContainer').addClass('p5EpisodeGUI');
        let tempContainer = p5.createDiv().parent(container).addClass('p5EpisodeGUI-column-item')
    
        playButton = p5.createButton('Play').parent(tempContainer).addClass('p5EpisodeGUI-row-item')
        playButton.mousePressed(startSonification);
    
        pauseButton = p5.createButton('Pause').parent(tempContainer).addClass('p5EpisodeGUI-row-item')
        pauseButton.mousePressed(pauseSonification);
        pauseButton.attribute('disabled', '')
    
        stopButton = p5.createButton('Stop').parent(tempContainer).addClass('p5EpisodeGUI-row-item')
        stopButton.mousePressed(stopSonification);
        stopButton.attribute('disabled', '')
    
        // Slider for attackTime
        tempContainer = p5.createDiv().parent(container).addClass('p5EpisodeGUI-column-item')
        p5.createP('Attack Time: 0.001').parent(tempContainer).addClass('p5EpisodeGUI-row-item')
        attackSlider = p5.createSlider(0.001, 0.3, 0.001, 0.001).parent(tempContainer).addClass('p5EpisodeGUI-row-item')
        p5.createP('0.3').parent(tempContainer).addClass('p5EpisodeGUI-row-item')
        attackSlider.changed(() => {
            handleAudio()
        })
    
        // Slider for decayTime
        tempContainer = p5.createDiv().parent(container).addClass('p5EpisodeGUI-column-item')
        p5.createP('Decay Time: 0.001').parent(tempContainer).addClass('p5EpisodeGUI-row-item')
        decaySlider = p5.createSlider(0.001, 0.3, 0.15, 0.001).parent(tempContainer).addClass('p5EpisodeGUI-row-item')
        p5.createP('0.3').parent(tempContainer).addClass('p5EpisodeGUI-row-item')
        decaySlider.changed(() => {
            handleAudio()
        })
    
        // tempContainer = p5.createDiv().parent(container).addClass('p5EpisodeGUI-column-item')
        // p5.createP('Volume: ').parent(tempContainer).addClass('p5EpisodeGUI-row-item')
        // amplitudeSlider = p5.createSlider(0, 1, 0.5, 0.1).parent(tempContainer).addClass('p5EpisodeGUI-row-item')
        // outputVolume(0.5, 0)
        // amplitudeSlider.changed(() => {
        //     outputVolume(amplitudeSlider.value(), 0.15)
        // })
    
        tempContainer = p5.createDiv().parent(container).addClass('p5EpisodeGUI-column-item')
        oscillatorTypeRadio = p5.createRadio().parent(tempContainer)
        oscillatorTypeRadio.option('Sine', 'sine')
        oscillatorTypeRadio.option('Triangle', 'triangle')
        oscillatorTypeRadio.option('Sawtooth', 'sawtooth')
        oscillatorTypeRadio.option('Square', 'square')
        oscillatorTypeRadio.selected('sine')
        oscillatorTypeRadio.changed(() => {
            oscillators.map((osc) => osc.setType(oscillatorTypeRadio.value()))
        })
    
        tempContainer = p5.createDiv().parent(container).addClass('p5EpisodeGUI-column-item')
        playAndExportButton = p5.createButton('Play & Export').parent(tempContainer).addClass('p5EpisodeGUI-row-item');
        playAndExportButton.mousePressed(recordSonification);
    
        // playRecordingButton = p5.createButton('Play Recording').parent(exportContainer).addClass('item')
        // playRecordingButton.mousePressed(handlePlayback)
        // playRecordingButton.attribute('disabled', '')
        downloadButton = p5.createButton('Download Sonification Recording').parent(tempContainer).addClass('p5EpisodeGUI-row-item')
        downloadButton.mousePressed(() => {p5.save(recordingSoundFile, 'sonification.wav')});
        downloadButton.attribute('disabled', '')
    
        downloadVideoButton = p5.createButton('Download Visualization Video').parent(tempContainer).addClass('p5EpisodeGUI-row-item')
        downloadVideoButton.mousePressed(() => {exportVid(videoBlob)})
        downloadVideoButton.attribute('disabled', '')
        
        // GUI element for changing the starting C.
        // User inputs a number from 0 to 8
        tempContainer = p5.createDiv().parent(container).addClass('p5EpisodeGUI-column-item');
        p5.createP('Starting C: ').parent(tempContainer).addClass('p5EpisodeGUI-row-item');
        startingOctave = p5.createInput("4").parent(tempContainer).addClass('p5EpisodeGUI-row-item');
        startingOctave.input(() => {
            if(startingOctave.value() !== ""){
                console.log("blah");
                let tempC = 12 + parseInt(startingOctave.value()) * 12; 
                // the first 12 in the sum above refers to C0, whose MIDI value is 12.
                // Checking upper boundary
                // We must ensure that the last participant plays a note
                // which is less than C9 (120 MIDI value).
                let participantCount = tables.length;
                let octaves = p5.floor(participantCount / 3) + (participantCount % 3 !== 0 ? 1 : 0);
                let highestNote = tempC + 12*octaves;
                if(highestNote <= 120){
                    currentC = tempC;
                } else {
                    // Out of bounds
                    currentC = 120 - 12*(octaves + 1);
                    startingOctave.value(`${currentC/12}`);
                }
                notesToPlay();
            }
        });

        return container;
    }
    
    function startRecordingVisualization() {
        videoChunks = []; // Here we will store our recorded media chunks (Blobs)
        // const options = {
        //     // videoBitsPerSecond: 2500000,
        //     videoBitsPerSecond: 6000000,
        //     mimeType: "video/webm",
        // };
        // const rec = new MediaRecorder(stream, options); // Init the recorder
        // Every time the recorder has new data, we will store it in our array
        canvasRecorder.ondataavailable = e => videoChunks.push(e.data);
        // Only when the recorder stops, we construct a complete Blob from all the chunks
        // rec.onstop = e => videoBlob = new Blob(chunks, {type: 'video/mp4'});
        canvasRecorder.onstop = e => videoBlob = new Blob(videoChunks, {type: 'video/webm'});
        
        canvasRecorder.start();
    }
      
    function exportVid(blob) {
        const a = document.createElement('a');
        // a.download = 'myvid.mp4';
        a.download = 'myvid.webm';
        a.href = URL.createObjectURL(blob);
        a.textContent = 'download the video';
        document.body.appendChild(a);
        a.click();
        a.remove();
    }
    
    function initializeVisuals(){
        old_colors = [];
        new_colors = [];
        createColors();
        handleGradient();
    }
    
    function genPeriod(i){
        let currentRate = p5.floor(tables[i].get(repNo*samplingRate, 0)) // Convention: Heart Rate is always the 1st column
        let period = 60/currentRate
        return period;
    }
    
    function initializeAudio(){
        for(let i = 0; i < tables.length; i++){
            oscillators[i] = new P5Class.Oscillator('sine');
            envelopes[i] = new P5Class.Envelope();
            envelopes[i].setADSR(0.001, 0.2, 0.2, universalReleaseTime);
            oscillators[i].amp(envelopes[i]);
            env_trigger_loops[i] = new P5Class.SoundLoop(() => {envelopes[i].play(oscillators[i])}, genPeriod(i));
            env_trigger_loops[i].bpm = 0;
        }
        notesToPlay();
    }
    
    function notesToPlay(){
        // Assigning frequencies to oscillators
        // Participants are all assigned to a note of the C major chord
        // This way, the end result is a lot more harmonious
        // When there are more than 3 participants, the chord is repeated
        // in higher octaves
        for(let i = 0; i < tables.length; i++){
            // When we're done with a triad of participants,
            // change current octave
            if(i && i % 3 == 0){ // The octave change does not take place the very first time we run the loop
                currentC += 12;
            }
            switch(i % 3){
                // The C Major chord has 3 notes:
                // C, E, G
                // The 1st participant is C, the 2nd is E, the 3rd is G,
                // the 4th is the next C and so on.
                case 0: // C
                    oscillators[i].freq(p5.midiToFreq(currentC));
                    break;
                case 1: // E
                    oscillators[i].freq(p5.midiToFreq(currentC + 4));
                    break;
                case 2: // G
                    oscillators[i].freq(p5.midiToFreq(currentC + 7));
                    break;
                default:
                    console.log('Default case');
                    break;
            }
        }
        handleAudio();
    }
    
    p5.setup = () => {
        let parentElem = p5.select('#sketch-canvas-container-large').elt
        let canvasWidth = parentElem.clientWidth
        p5.createCanvas(0.9*canvasWidth, 600)

        // Setting up the canvas recorder, now that the canvas has been created
        p5.setFrameRate(frameRate);
        const canvas = document.querySelector('canvas');
        const stream = canvas.captureStream(frameRate); // grab our canvas MediaStream
        canvasRecorder = new MediaRecorder(stream); // init the recorder    
        
        p5.background('white');
        p5.colorMode(p5.HSB);
        
        p5.noStroke();
    
        gradient = p5.drawingContext.createLinearGradient(0, p5.height/2, p5.width, p5.height/2)
        // This is a bit of a bandaid patch.
        // When setup runs, the files likely haven't loaded yet.
        // And therefore, when noLoop is called at its end,
        // draw runs, and draw runs a check against the numberOfReps variable.
        // But it's value isn't valid!
        // So, initializing it as 1 here, and assigning it its proper value once
        // everything loads.
        numberOfReps = 1;
        
        recorder = new P5Class.SoundRecorder()
    }

    p5.windowResized = () => {
        p5.resizeCanvas(0.9*p5.select('#sketch-canvas-container-large').elt.clientWidth, 600)
        centerGUI()
        if(!p5.isLooping()){ 
            p5.noLoop() // runs draw once to redo the canvas
        }
    }
    
    function handleGradient(){
        if(frameNo % frameRate == 0){ // New colors read from CSV
            createColors()
            gradient = p5.drawingContext.createLinearGradient(0, p5.height/2, p5.width, p5.height/2);
            if(tables.length !== 1){           
                tables.map((_, idx) => {
                    gradient.addColorStop(idx/(tables.length - 1), old_colors[idx])
                })
            }else{ // Edge case, only 1 participant
                gradient.addColorStop(0, old_colors[0])
            }
            p5.drawingContext.fillStyle = gradient;
            p5.rect(0, 0, p5.width, p5.height) 
            updateCurrentBiometricValues()
        }else{ // In between colors to make transition from one shade of the color to the next smooth
            gradient = p5.drawingContext.createLinearGradient(0, p5.height/2, p5.width, p5.height/2)
            if(tables.length !== 1){           
                tables.map((_, idx) => {
                    gradient.addColorStop(idx/(tables.length - 1), p5.lerpColor(old_colors[idx], new_colors[idx], (frameNo % frameRate)/frameRate))
                    // LERPing colors by the percentage of frames already 'played' in the current second
                })
            }else{ // Edge case, only 1 participant
                gradient.addColorStop(0, p5.lerpColor(old_colors[0], new_colors[0], (frameNo % frameRate)/frameRate))
            }
            p5.drawingContext.fillStyle = gradient;    
            p5.rect(0, 0, p5.width, p5.height);
        }
        // This following part gives an insight by changing the value of the biometric in real time
        // and comparing the value to the minimum and maximum value, respectively
     
        p5.stroke('white')
        p5.strokeWeight(1)
        // These rectangles act as guides to show the parts of the scene where the actual participant's shade is
        // In between it's just the gradient.
        if(!isGUIhidden){ // the rectangles indicating a color stop are only drawn if the rest of the gui is visible
            if(tables.length !== 1){ // No point in having rectangles if there's just one participant
                // The first and last color stops are at the edge of the canvas so they require separate handling.
                p5.rect(0, 0, 20, p5.height) // first color stop
                p5.rect(p5.width-20, 0, 20, p5.height) // last color stop
                // In between
                for(let i = 1; i < tables.length - 1; i++){
                    p5.rect(i*p5.width/(tables.length - 1), 0, 20, p5.height)
                }
            }
        }
        p5.noStroke()
    }
    
    // This is called once per second when the sonification is running,
    // right before the sonification starts and once when it stops, 
    // as to reset the values of the trigger loop intervals, 
    // oscillator frequencies and amplitudes.
    function handleAudio(){
        let amp, freq
        for(let i = 0; i < tables.length; i++){
            env_trigger_loops[i].interval = genPeriod(i)
            amp = p5.constrain(p5.map(tables[i].get(repNo*samplingRate, 2), min[2][i], max[2][i], minAmp, maxAmp), minAmp, maxAmp) // Mapping temperature to amplitude
            envelopes[i].setRange(amp, 0)        
            // GSR is mapped to the sustain level of the ADSR envelope
            let susRatio = p5.constrain(p5.map(tables[i].get(repNo*samplingRate, 1), min[1][i], max[1][i], 0, 1.0), 0, 1.0)
            // console.log('Envelope: ' + i + ', susRatio: ' + susRatio)
            envelopes[i].setADSR(attackSlider.value(), decaySlider.value(), susRatio, universalReleaseTime)
        }
    }
    
    p5.draw = () => {    
        if(setupFinished){
            if(repNo < numberOfReps){
                // console.log('repNo: ', repNo);
                // edge case: handleGradient always produces the next color,
                // but right at our last rep, there is no other color to produce
                if(repNo !== numberOfReps - 1){
                    handleGradient();
                }
                // Every second we read another line from the CSV 
                // So every second, we redetermine what the participant's heart rate is
                // and this changes each loop's interval, effective immediately,
                // as well as the oscillators' frequencies and amplitudes
                if(frameNo % frameRate == 0){
                    handleAudio();
                    repNo++;
                }
                frameNo++;
            }else{
                stopSonification();
            }    
        }else{
            // A nicer, spinner animation can go here while everything is setting up.
            // for the moment, let's just keep this
            p5.textSize(128);
            p5.text('Setting things up...', 0, 0, p5.width, p5.height);
        }
    }
    
    function createColor(repNo, colorNo){
        // Mapping a biometric (temporarily hardcoded, always the heartbeat) to a number in brightness' valid range of values.
        let brightnesses = 0, bioCount = tables[colorNo].getColumnCount()
        for(let i = 0; i < bioCount; i++){
            brightnesses += p5.constrain(p5.map(tables[colorNo].get(repNo, i), min[i][colorNo], max[i][colorNo], 0, 100), 0, 100)
        }
        return p5.color(p5.hue(axisColor), p5.saturation(axisColor), brightnesses/bioCount)
    }
    
    function createColors(){
        // In order to have the smooth transition between shades as time passes,
        // we must know both the current and the next shade according to the mappings beforehand.
        if(new_colors.length != 0){
            for(let i = 0; i < new_colors.length; i++){
                old_colors[i] = new_colors[i]
                new_colors[i] = createColor((repNo + 1)*samplingRate, i)
            }
        }else{
            for(let i = 0; i < filepaths.length; i++){
                old_colors.push(createColor(repNo*samplingRate, i))
                new_colors.push(createColor((repNo + 1)*samplingRate, i))
            }
        }
    }
    
    function startSonification(){
        sonificationRunning = true;
        isPaused = false;
        p5.userStartAudio();
        startSound();
        p5.loop();
        playButton.attribute('disabled', '');
        pauseButton.removeAttribute('disabled');
        stopButton.removeAttribute('disabled');
        playAndExportButton.attribute('disabled', '');
        // if(!isRecording && isSoundReady){
        //     playRecordingButton.attribute('disabled', '')
        // }
        console.time('sonification');
    }
    
    function startSound(){
        env_trigger_loops.map((loop, idx) => {
            loop.start();
            oscillators[idx].start();
        })
    }
    
    function stopSound(){
        env_trigger_loops.map((loop, idx) => {
            loop.stop();
            oscillators[idx].stop();
        })
    }
    
    function stopSonification(){
        sonificationRunning = false;
        isPaused = false;
        repNo = 0;
        frameNo = 0;
        stopSound();
        p5.noLoop();
        playButton.removeAttribute('disabled');
        pauseButton.attribute('disabled', '');
        stopButton.attribute('disabled', '');
        playAndExportButton.removeAttribute('disabled');
        initializeVisuals();
        handleAudio();
        console.timeEnd('sonification');
        if(isRecording){
            recorder.stop(); // Stopping the sound recorder manually.
            canvasRecorder.stop();
            isRecording = false;
            if(isForcedRecStop){
                isForcedRecStop = false;
                return;
            }
            downloadButton.removeAttribute('disabled');
            downloadVideoButton.removeAttribute('disabled');
            // Just testing the functionality with the example provided from
            // the documentation.
            midiWriterTest();
        }
    }
    
    function pauseSonification(){
        isPaused = true;
        p5.noLoop();
        stopSound();
        playButton.removeAttribute('disabled');
        pauseButton.attribute('disabled', '');
    }
    
    function recordSonification(){
        // Disable all other buttons, including play and export, but not sliders
        // Start recording, set state variable to true
        playButton.attribute('disabled', '');
        pauseButton.attribute('disabled', '');
        stopButton.attribute('disabled', '');
        playAndExportButton.attribute('disabled', '');
        // playRecordingButton.attribute('disabled', '')
        // downloadButton.attribute('disabled', '')
    
        isRecording = true;
        recordingSoundFile = new P5Class.SoundFile();
        recorder.record(recordingSoundFile);
        startRecordingVisualization();
        startSound();
        p5.loop();
    }

    function midiWriterTest(){
        const track = new MidiWriter.Track();
        track.addEvent([
                new MidiWriter.NoteEvent({pitch: ['E4','D4'], duration: '4'}),
                new MidiWriter.NoteEvent({pitch: ['C4'], duration: '2'}),
                new MidiWriter.NoteEvent({pitch: ['E4','D4'], duration: '4'}),
                new MidiWriter.NoteEvent({pitch: ['C4'], duration: '2'}),
                new MidiWriter.NoteEvent({pitch: ['C4', 'C4', 'C4', 'C4', 'D4', 'D4', 'D4', 'D4'], duration: '8'}),
                new MidiWriter.NoteEvent({pitch: ['E4','D4'], duration: '4'}),
                new MidiWriter.NoteEvent({pitch: ['C4'], duration: '2'})
            ], function(event, index) {
              return {sequential: true};
            }
        );

        const write = new MidiWriter.Writer(track);
        console.log(write.dataUri());
    }
}