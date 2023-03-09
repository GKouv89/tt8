import './p5.sound.min.js'
import './p5.dom.min.js'
import './p5.js'
import * as P5Class from "p5"

import MidiWriter from 'midi-writer-js';

export function sketch(p5){
    let data = [] // File paths and friendly names for participant biometrics
    let axes = []
    let prefixPath = `${window.location.protocol}//${window.location.hostname}` // This is the prefix for the file server

    // sonificationRunning is used when the window becomes visible after being minimized
    // or after the tab was switched to a different one. This way we can check if we are
    // supposed to be starting the draw loop again. If we have simply paused, then
    // switching back to the tab should not trigger the draw loop again, 
    // and this is why isPaused is used. 
    let sonificationRunning = false, isPaused = false;
    document.addEventListener("visibilitychange", () => {
        console.log(document.visibilityState);
        console.log(p5.getAudioContext().state);
        if(!isPaused && sonificationRunning)
            if(document.visibilityState == "hidden")
                hideSonification();
            else
                showSonification();
    });

    // Color chosen for visualization
    let axisChoice;
    p5.updateWithProps = props => {
        if(axes.length == 0){ // This will be updated only once
            axes = props.axes;
            // Temporarily, choosing 1st color. Later, this will be a query that returns a specific color before
            // updateWithProps runs.
            axisChoice = axes[0];
            // Along with axes we can be certain the data array can be initialized
            data = props.files
            // Loading first file as to have something to demonstrate
            // Then continuing with the setup
            table = p5.loadTable(`${prefixPath}/${data[0].path}`, 'csv', 'header', () => {console.log('Done loading')}) 
        }        
    };

    let heartSamplePath = './HEART-loop.mp3'
    let bootPath = './TR-909Kick.mp3'
    let table
    let sound, boot, bootLoop
    let oscillator //, minFreq = 2000, maxFreq = 3000
    let startingC = 48; // Starting from C3
    let endingC = 72; // Ending with B4 (C5, but excluded)
    // we generate the frequencies of all notes that are between the starting and ending octave
    // that belong to the C Major chord
    // and use them to quantize the oscillator's values
    // so it sounds a lot more harmonic
    let arrayOfFrequencies = [];

    let samplingRate = 100 // Not really the sampling rate, but rather every how many lines do we take into account.
    let min = [1000, 1000, 1000] // index 0 is HR, index 1 is SC, index 2 is TEMP
    let max = [0, 0, 0]
    let repNo = 0, numberOfReps = 0, frameNo = 0, frameRate = 25
    
    // All of the following are handlers for GUI components,
    // so we can enable/disable them or otherwise modify them, when needed
    let heartTypeRadio, biometricRadio, oscillatorTypeRadio;
    let container, playContainer, exportContainer;
    let playButton, pauseButton, stopButton, playAndExportButton;
    let playRecordingButton;
    let downloadButton;
    let fileSelect;
    let lowestOctave, highestOctave;

    let recorder, recording, videoBlob, pseudoOscillator
    let isRecording = false, isSoundReady = false
    let gradient
    let old_colors, new_colors

    p5.preload = () => {
        // p5.soundFormats('mp3', 'ogg');
        // sound = p5.loadSound(`${prefixPath}/data/assets/HEART-loop`);
        // boot = p5.loadSound(`${prefixPath}/data/assets/TR-909Kick`);
        sound = p5.loadSound(`${prefixPath}/data/assets/HEART-loop.mp3`);
        boot = p5.loadSound(`${prefixPath}/data/assets/TR-909Kick.mp3`);
    }

    function findMinMax(){ // finds minimum and maximum values of all biometrics
        // for any given participant, to later use them in mapping.
        let currval, numberOfReps = 0
        min = [1000, 1000, 1000] // index 0 is HR, index 1 is SC, index 2 is TEMP
        max = [0, 0, 0]
        for(let i = 0; i < table.getRowCount(); i += samplingRate){
            for(let j = 0; j < 3; j++){
                currval = parseFloat(table.get(i, j))
                min[j] = (() => {return currval < min[j] ? currval : min[j]})()
                max[j] = (() => {return currval > max[j] ? currval : max[j]})()
            }
            numberOfReps++
        }
    }

    // Generates period for drum kick looping
    function genPeriod(){
        let period = 60/table.get(repNo*samplingRate, 0) // Convention: Heart rate is always the first column, 
        // and looping is only used with the heart rate
        return period;
    }
    
    function createGUI(){
        container = p5.createDiv().addClass('p5GUI-container')
        playContainer = p5.createDiv().parent(container).addClass('p5GUI-row')
    
        // The following 3 buttons start, pause and stop the visualization and the sonification, respectively
        playButton = p5.createButton('Play').parent(playContainer).addClass('p5GUI-item');
        playButton.mousePressed(startSonification);
    
        pauseButton = p5.createButton('Pause').parent(playContainer).addClass('p5GUI-item');
        pauseButton.mousePressed(pauseSonification);
        pauseButton.attribute('disabled', '')
    
        stopButton = p5.createButton('Stop').parent(playContainer).addClass('p5GUI-item');
        stopButton.mousePressed(stopSonification);
        stopButton.attribute('disabled', '')
    
        // The play and export button records both the visual and audio parts of the sketch
        exportContainer = p5.createDiv().parent(container).addClass('p5GUI-row')
        playAndExportButton = p5.createButton('Play & Export').parent(exportContainer).addClass('p5GUI-item');
        playAndExportButton.mousePressed(recordSonification);
    
        // This radio button lets the user choose whether they want to visualize/sonify:
        // the participant's heart rate, their skin conductance, their temperature, or
        // all of the above simultaneously.
        biometricRadio = p5.createRadio().parent(container).addClass('p5GUI-row')
        biometricRadio.option('Heart Rate', 'heart')
        biometricRadio.option('Skin Conductance', 'gsr')
        biometricRadio.option('Temperature', 'temp')
        biometricRadio.option('All Biometrics', 'all')
        biometricRadio.selected('heart')
    
        // If the user wished to sonify the participant's heart rate,
        // they can do so via two options:
        // either an actual heart sound, or a drum kick sound that beats rhythmically
        heartTypeRadio = p5.createRadio().parent(container).addClass('p5GUI-row')
        heartTypeRadio.option('Heart Sample', 'heart')
        heartTypeRadio.option('Drum kick', 'boot')
        heartTypeRadio.selected('heart')
    
        // If the user wished to sonify the other two biometrics or the average,
        // they can do so via choosing 4 different oscillator types:
        oscillatorTypeRadio = p5.createRadio().parent(container).addClass('p5GUI-row')
        oscillatorTypeRadio.option('Sine', 'sine')
        oscillatorTypeRadio.option('Triangle', 'triangle')
        oscillatorTypeRadio.option('Sawtooth', 'sawtooth')
        oscillatorTypeRadio.option('Square', 'square')
        oscillatorTypeRadio.selected('sine')
        oscillatorTypeRadio.addClass('p5GUI-hide')

        oscillatorTypeRadio.changed(() => {
            oscillator.setType(oscillatorTypeRadio.value())
        })
    
        // Appropriately displaying the radio buttons according to the user's biometric choice
        biometricRadio.changed(() => {
            if(biometricRadio.selected() !== 'heart'){
                heartTypeRadio.addClass('p5GUI-hide')
                oscillatorTypeRadio.removeClass('p5GUI-hide')
            }else{
                heartTypeRadio.removeClass('p5GUI-hide')
                oscillatorTypeRadio.addClass('p5GUI-hide')
            }
            initializeVisuals()
        })
    
        let row = p5.createDiv().parent(container).addClass('p5GUI-row')
        
        // The user can choose the participant whose biometrics they'd like to explore.
        // All available options are fetched, and a dropdown menu is created.
        fileSelect = p5.createSelect().parent(row).addClass('p5GUI-item')
        for(let i = 0; i < data.length; i++){
            fileSelect.option(data[i].name, i) 
        }
        // Disabling some of the GUI's functionality while loading the participant's biometric data
        fileSelect.changed(() => {
            playButton.attribute('disabled', '')
            playAndExportButton.attribute('disabled', '')
            biometricRadio.attribute('disabled', '')
            heartTypeRadio.attribute('disabled', '')
            console.log('Loading ', data[fileSelect.value()].path)
            table = p5.loadTable(`${prefixPath}/${data[fileSelect.value()].path}`, 'csv', 'header', () => {
                findMinMax()
                playButton.removeAttribute('disabled')
                playAndExportButton.removeAttribute('disabled')
                biometricRadio.removeAttribute('disabled')
                heartTypeRadio.removeAttribute('disabled')
                initializeVisuals()
            })
        })
    
        // If the user has recorded the sketch, they can listen to their recording, and download it.
        playRecordingButton = p5.createButton('Play Recording').parent(exportContainer).addClass('p5GUI-item')
        playRecordingButton.mousePressed(handlePlayback)
        playRecordingButton.attribute('disabled', '')
        downloadButton = p5.createButton('Download Recording').parent(exportContainer).addClass('p5GUI-item')
        downloadButton.mousePressed(() => {p5.save(recording, 'sonification.wav'); exportVid(videoBlob)});
        downloadButton.attribute('disabled', '')

        row = p5.createDiv().parent(container).addClass('p5GUI-row');
        // GUI elements for upper and lower octave change.
        // User inputs a number from 1 to 8 in both textboxes
        p5.createP('Starting C: ').parent(row).addClass('p5GUI-item');
        lowestOctave = p5.createInput("3").parent(row).addClass('p5GUI-item');
        lowestOctave.input(() => {
            if(lowestOctave.value() !== ""){
                startingC = 12 + parseInt(lowestOctave.value()) * 12;
                // the first 12 in the sum above refers to C0, whose MIDI value is 12.
                initArrayOfFreq();
            }
        });
        p5.createP('Ending C (excluding): ').parent(row).addClass('p5GUI-item');
        highestOctave = p5.createInput("5").parent(row).addClass('p5GUI-item');
        highestOctave.changed(() => {
            if(highestOctave.value() !== ""){
                endingC = 12 + parseInt(highestOctave.value()) * 12;
                // the first 12 in the sum above refers to C0, whose MIDI value is 12.
                initArrayOfFreq();
            }
        });
    }

    // This is responsible for the appearance of the canvas.
    // If one axis color is chosen, then that color is applied as a background color,
    // otherwise a gradient is created.
    // The logic of the color created will be explained in createColors
    function initializeVisuals(){
        old_colors = [];
        new_colors = [];
        createColors();
        p5.background(old_colors[0]);
    }

    function quantizeFrequency(freq){
        let immLowerFreq, immHigherFreq;
        for(let i = 0; i < arrayOfFrequencies.length; i++){
            immLowerFreq = arrayOfFrequencies[i];
            immHigherFreq = arrayOfFrequencies[i+1]
            if(freq >= immLowerFreq && freq <= immHigherFreq){ // Found which quantization levels we should consider
                // Which is closest to the frequency? The immediately lowest, or the immediately highest?
                if(p5.abs(freq - immLowerFreq) < p5.abs(freq - immHigherFreq))
                    return arrayOfFrequencies[i];
                else
                    return arrayOfFrequencies[i+1];
            }
        }
    }
    
    // This is responsible for the sound produced.
    function setAudio(){
        let freq;
        let minFreq = arrayOfFrequencies[0];
        let maxFreq = arrayOfFrequencies[arrayOfFrequencies.length - 1];
        switch(biometricRadio.value()){
            case 'heart':
                switch(heartTypeRadio.value()){
                    case 'heart':
                        // Sonifying heart rate with a heart sound.
                        // The sound file continuously loops,
                        // and all we must do is map the heart rate's value
                        // to the range [0.5, 1.2]
                        // and change the playback rate accordingly
                        let rate = p5.constrain(p5.map(table.get(repNo*samplingRate, 0), min[0], max[0], 0.5, 1.25), 0.5, 1.25);
                        sound.rate(rate);
                        break;
                    case 'boot':
                        // Sonifying heart rate with a kick sound
                        // A loop continuously runs, and on a certain time period,
                        // triggers the playback of a file
                        // We must then map the heart rate to this time period.
                        bootLoop.interval = genPeriod();
                        // In case we're recording, we also export MIDI
                        // If interval changes, tempo changes
                        if(isRecording){
                            console.log(parseInt(table.get(repNo*samplingRate, 0)));
                            recordingTrack.setTempo(parseInt(table.get(repNo*samplingRate, 0)));
                        }
                        break;
                    default:
                        break;
                }
                break;
            case 'gsr':
                // GSR sonification consists of mapping the biometric value to the oscillator frequency
                // then quantizing. The quantization levels are C Major notes accross several octaves, so that the
                // end result sounds good
                freq = p5.constrain(p5.map(table.get(repNo*samplingRate, 1), min[1], max[1], minFreq, maxFreq), minFreq, maxFreq);
                freq = quantizeFrequency(freq);
                oscillator.freq(freq, 0.1);
                break;  
            case 'temp':
                // Temperature sonification consists of mapping the biometric value to the oscillator frequency, then quantizing.
                freq = p5.constrain(p5.map(table.get(repNo*samplingRate, 2), min[2], max[2], minFreq, maxFreq), minFreq, maxFreq);
                freq = quantizeFrequency(freq);
                oscillator.freq(freq, 0.1);
                break;
            case 'all':
                // Sonifying all biometrics works as follows:
                // We map each biometric to a frequency
                // Then we find the average of the frequencies,
                // and change the oscillator's frequency to this average value.
                let frequencies = 0
                for(let i = 0; i < 2; i++){
                    frequencies += p5.constrain(p5.map(table.get(repNo*samplingRate, i), min[i], max[i], minFreq, maxFreq), minFreq, maxFreq);
                }
                freq = frequencies/3;
                freq = quantizeFrequency(freq);
                oscillator.freq(freq, 0.1);
                break;
            default:
                break;
        }
    }

    // This is called when the user wants to listen the recorded sound
    function handlePlayback(){
        playButton.attribute('disabled', '')
        playRecordingButton.attribute('disabled', '')
        playAndExportButton.attribute('disabled', '')
        recording.play()
        recording.onended(() => {
            playButton.removeAttribute('disabled')
            playRecordingButton.removeAttribute('disabled')
            playAndExportButton.removeAttribute('disabled')
        })
    }

    // let notes = []; // DEBUG
    function initArrayOfFreq(){
        // initializing the sonification
        // iterate through all available octaves
        // generate frequencies of C Major notes
        // store them in arrayOfFrequencies 
        // console.log('Notes before: ', notes); // DEBUG
        // notes = [];
        arrayOfFrequencies = [];
        for(let i = startingC; i < endingC; i+=12){
            console.log("Current C: ", i);
            arrayOfFrequencies.push(p5.midiToFreq(i)); // C
            // notes.push(i); // DEBUG
            arrayOfFrequencies.push(p5.midiToFreq(i+4)); // E
            // notes.push(i+4); // DEBUG
            arrayOfFrequencies.push(p5.midiToFreq(i+7)); // G
            // notes.push(i+7); // DEBUG
        }
        // console.log('Notes after: ', notes); // DEBUG
    }

    p5.setup = () => {
        console.log('setup')
        // Canvas width is the width of its container, which has the id mentioned below.
        // This way the canvas and the GUI do not overlap
        let parentElem = p5.select('#sketch-canvas-container').elt
        let canvasWidth = parentElem.clientWidth
        p5.createCanvas(canvasWidth, 600)


        // The visualizer works with HSB mode. Hue and saturation of the colors
        // are determined by the axes the episode belongs to,
        // and brightness is the parameter that is control by the biometrics.
        p5.colorMode(p5.HSB)

        findMinMax()
        createGUI()
        // Searching for the appropriate container for the gui
        // most likely a React-Bootstrap Col object
        // so now that we're done creating the gui we can place it appropriately
        let columnContainer = p5.select('#sketch-gui-container')
        container.parent(columnContainer)

        // Creating an oscillator for all other sonifications (and making it very silent at first)
        oscillator = new P5Class.Oscillator()
        oscillator.freq(20)
        oscillator.amp(0.2)

        // Creating a loop for the heart rate sonifications
        bootLoop = new P5Class.SoundLoop(() => {
            boot.play(); 
            // If we are recording and therefore, want to export MIDI as well,
            // every time the note plays, a note must be added.
            // the tempo changes are being taken care of elsewhere.
            if(isRecording){
                recordingTrack.addEvent([
                        new MidiWriter.NoteEvent({pitch: ['A4'], duration: '4'}),
                    ], function(event, index) {
                        return {sequential: true};
                    }
                );
            } 
        }, genPeriod());
        bootLoop.bpm = 0;
        
        // This will be used for recording the audio of the sketch
        recorder = new P5Class.SoundRecorder()

        // This oscillator is used when the drum kick sonification is selected.
        // The recorder by default only records when there is output from the 
        // sketch, but when using a soundloop, between triggers of the audiofile,
        // there is silence, and it would not record these pauses, resulting in an incorrect soundfile
        // A silent oscillator bypasses that problem.
        pseudoOscillator = new P5Class.Oscillator('sine')
        pseudoOscillator.freq(5)
        pseudoOscillator.amp(0.01)
    
        numberOfReps = 10 // DEBUGGING

        p5.setFrameRate(frameRate)

        // console.log(arrayOfFrequencies)
        initArrayOfFreq();
        setAudio();

        // Initializing canvas appearance
        gradient = p5.drawingContext.createLinearGradient(p5.width/2, 0, p5.width/2, p5.height) // This is used when all axes are used in the visualization
        initializeVisuals() 
        p5.noLoop()
    }

    p5.windowResized = () => {
        p5.resizeCanvas(p5.select('#sketch-canvas-container').elt.clientWidth, 600)
        if(!p5.isLooping()){
            p5.noLoop() // runs draw once
        }
    }

    p5.draw = () => {    
        if(repNo < numberOfReps){
            if(frameNo % frameRate == 0){ // Every second
                // Reading a new line from the csv and updating the sonifying element (oscillator, playback rate or sound loop interval)
                setAudio();
                // Updating colors of visualization
                createColors();
                p5.background(old_colors[0]);
                repNo++;
            }else{
                // All frames after the first in a given second,
                // are focused on the transition between the current color
                // and the next color, the way that they result from the mappings.
                // LERPing is applied between the current and next color.
                // The percentage is the percentage of frames of the current second
                // already drawn.
                let c = p5.lerpColor(old_colors[0], new_colors[0], (frameNo % frameRate)/frameRate);
                p5.background(c);
            }
            frameNo++
        }else{
            stopSonification()
            p5.noLoop()
        }
    }
    
    function startSonification(){
        // This is used so the sound loop can play without any other sonification playing beforehand.
        // If this isn't used, one must choose any other option, stop, then choose the kick option.
        console.log(p5.getAudioContext().state);
        sonificationRunning = true;
        // making sure we reset this variable
        isPaused = false;
        // if(p5.getAudioContext().state !== "running")
        //     p5.userStartAudio(); 
        startSound();
        p5.loop();
        // Disabling most GUI elements
        playButton.attribute('disabled', '');
        pauseButton.removeAttribute('disabled');
        stopButton.removeAttribute('disabled');
        heartTypeRadio.attribute('disabled', '');
        biometricRadio.attribute('disabled', '');
        oscillatorTypeRadio.attribute('disabled', '');
        playAndExportButton.attribute('disabled', '');
        fileSelect.attribute('disabled', '');
        // If the user has already created a recording, we must disable this button as well
        if(!isRecording && isSoundReady){
            playRecordingButton.attribute('disabled', '');
        }
    }

    // Necessary commands to start sonification according to the option selected
    function startSound(){
        switch(biometricRadio.value()){
            case 'heart':
                switch(heartTypeRadio.value()){
                    case 'heart':
                        sound.loop()
                        break;
                    case 'boot':
                        pseudoOscillator.start()
                        bootLoop.start()
                        break;
                    default:
                        break;
                }
                break;
            case 'temp':
            case 'gsr':
            case 'all':
                oscillator.start()
                break;
            default:
                break;
        }
    }

    // Necessary commands to stop sonification according to the option selected
    function stopSound(){
        switch(biometricRadio.value()){
            case 'heart':
                switch(heartTypeRadio.value()){
                    case 'heart':
                        sound.stop();
                        break;
                    case 'boot':
                        bootLoop.stop();
                        pseudoOscillator.stop();
                        break;
                    default:
                        break;
                }
                break;
            case 'temp':
            case 'gsr':
            case 'all':
                oscillator.stop();
                break;        
            default:
                break;
        }
    }
    
    function stopSonification(){
        sonificationRunning = false;
        // making sure we reset this variable
        isPaused = false;
        // Resetting repetition and frame counters, so that the sonification and visualization can start from the top.
        repNo = 0;
        frameNo = 0;
        stopSound();
        p5.noLoop();

        // Re-enabling GUI elements
        playButton.removeAttribute('disabled')
        pauseButton.attribute('disabled', '')
        stopButton.attribute('disabled', '')
        playAndExportButton.removeAttribute('disabled')
        heartTypeRadio.removeAttribute('disabled')
        biometricRadio.removeAttribute('disabled')
        oscillatorTypeRadio.removeAttribute('disabled')
        fileSelect.removeAttribute('disabled')
        // If the recorder is also running, we handle its state variables and GUI components accordingly
        if(isRecording){
            playRecordingButton.removeAttribute('disabled')
            downloadButton.removeAttribute('disabled')
            recorder.stop()
            isRecording = false
            isSoundReady = true
            // midiWriterTest();
            // If we are exporting, and the option is the only one so far offered,
            // time to also export the MIDI
            if(biometricRadio.value() == 'heart' && heartTypeRadio.value() == 'boot'){
                console.log('here');
                recordingWriter = new MidiWriter.Writer(recordingTrack);
                console.log(recordingWriter.dataUri());
            }else{
                console.log('here2');
                console.log(biometricRadio.value());
            }
        }else if(!isRecording && isSoundReady){
            playRecordingButton.removeAttribute('disabled', '')
        }
        // Redrawing the canvas so it takes the colors
        // that correspond to the values in the CSV's first line
        initializeVisuals();
        numberOfReps = 10;
    }

    function pauseSonification(){
        isPaused = true;
        p5.noLoop();
        stopSound();
        playButton.removeAttribute('disabled');
        pauseButton.attribute('disabled', '');
    }

    // A lighter version of pauseSonification, only when the tab is switched/browser is minimized.
    function hideSonification(){
        p5.noLoop();
        stopSound();
    }

    // A lighter version of startSonification, for when the tab is visible again
    function showSonification(){
        p5.loop();
        startSound();
    }

    let recordingTrack, recordingWriter;
    
    function recordSonification(){
        // Same logic with start sonification, but here we cannot stop
        // the recording before all lines are read from the CSV
        p5.userStartAudio();
        playButton.attribute('disabled', '');
        pauseButton.attribute('disabled', '');
        stopButton.attribute('disabled', '');
        playAndExportButton.attribute('disabled', '');
        heartTypeRadio.attribute('disabled', '');
        biometricRadio.attribute('disabled', '');
        oscillatorTypeRadio.attribute('disabled', '');
    
        isRecording = true;
    
        recording = new P5Class.SoundFile();
        recorder.record(recording);
        startSound();
        p5.loop();
        startRecording();

        // Preparing MIDI track for track recording. 
        // Temporarily only drum kick option.
        recordingTrack = new MidiWriter.Track();
        recordingTrack.setTimeSignature(4, 4);
    }

    // This function is used for capturing the visuals of the sketch
    function startRecording() {
      const chunks = []; // here we will store our recorded media chunks (Blobs)
      const canvas = document.querySelector('canvas');
      const stream = canvas.captureStream(25); // grab our canvas MediaStream
      const rec = new MediaRecorder(stream); // init the recorder
      // every time the recorder has new data, we will store it in our array
      rec.ondataavailable = e => chunks.push(e.data);
      // only when the recorder stops, we construct a complete Blob from all the chunks
    //   rec.onstop = e => exportVid(new Blob(chunks, {type: 'video/mp4'})); // We export the video the moment the recording is done, this might change
      rec.onstop = e => videoBlob = new Blob(chunks, {type: 'video/mp4'}); // We save the video for later exporting
      
      rec.start();
      setTimeout(()=>rec.stop(), numberOfReps*1000); // The length of the recording is roughly the same as the number of reps
    }
    
    function exportVid(blob) {
      // Just creating an anchor element to download, then using and deleting it.
      const a = document.createElement('a');
      a.download = 'myvid.mp4';
      a.href = URL.createObjectURL(blob);
      a.textContent = 'download the video';
      document.body.appendChild(a);
      a.click()
      a.remove()
    }
    
    // This function creates the color from reading the current values of the CSV,
    // as well as the very next one. This way, we can smoothly transition between the colors, using LERPing
    function createColors(){
        if(old_colors.length !== 0){
            old_colors[0] = new_colors[0];
            new_colors[0] = createColor((repNo+1)*samplingRate, axisChoice.color);
        }else{
            old_colors[0] = createColor(repNo*samplingRate, axisChoice.color);
            new_colors[0] = createColor((repNo+1)*samplingRate, axisChoice.color);
        }
    }
    
    // This function reads the appropriate biometric,
    // extracts the hue and saturation from the appropriate axis color
    // and maps the biometric to a brightness value, which is combined with
    // the above two properties to form a color.
    // If all biometrics are selected, then they are all mapped to a brightness value (a number in the range [0, 100])
    // then an average value is calculated and that is used as the brightness of the color being created
    function createColor(repNo, color){
        let c;
        switch(biometricRadio.value()){
            case 'heart':
                c = p5.color(p5.hue(color), p5.saturation(color), p5.constrain(p5.map(table.get(repNo, 0), min[0], max[0], 0, 100), 0, 100));
                break;
            case 'gsr':
                c = p5.color(p5.hue(color), p5.saturation(color), p5.constrain(p5.map(table.get(repNo, 1), min[1], max[1], 0, 100), 0, 100));
                break;  
            case 'temp':
                c = p5.color(p5.hue(color), p5.saturation(color), p5.constrain(p5.map(table.get(repNo, 2), min[2], max[2], 0, 100), 0, 100));
                break;
            case 'all':
                let brightnesses = 0
                for(let i = 0; i < 2; i++){
                    brightnesses += p5.constrain(p5.map(table.get(repNo, i), min[i], max[i], 0, 100), 0, 100);
                }
                c = p5.color(p5.hue(color), p5.saturation(color), brightnesses/3);
                break;
            default:
                break;
        }
        return c;
    }   

    function midiWriterTest(){
        const track = new MidiWriter.Track();
        track.setTimeSignature(4, 4);

        track.setTempo(81);
        
        track.addEvent([
                new MidiWriter.NoteEvent({pitch: ['A4'], duration: '4', repeat: 40}),
            ], function(event, index) {
              return {sequential: true};
            }
        );

        const write = new MidiWriter.Writer(track);
        console.log(write.dataUri());

        ///////////////////////////////////////////////////////
        
        // const track2 = new MidiWriter.Track();
        // track2.setTempo(740);
        // track2.addEvent([
        //         new MidiWriter.NoteEvent({pitch: ['A4'], duration: '1', repeat: 10}),
        //     ], function(event, index) {
        //       return {sequential: true};
        //     }
        // );

        // track2.setTempo(370);
        // track2.addEvent([
        //         new MidiWriter.NoteEvent({pitch: ['A4'], duration: '1', repeat: 10}),
        //     ], function(event, index) {
        //       return {sequential: true};
        //     }
        // );

        // const write2 = new MidiWriter.Writer(track2);
        // console.log(write2.dataUri());

        const track2 = new MidiWriter.Track();
        // track.setTimeSignature(1, 1);

        track2.setTempo(81);
        
        track2.addEvent([
                new MidiWriter.NoteEvent({pitch: ['A4'], duration: '1', repeat: 10}),
            ], function(event, index) {
              return {sequential: true};
            }
        );

        const write2 = new MidiWriter.Writer(track2);
        console.log(write2.dataUri());
    }
}