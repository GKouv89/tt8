import './p5.sound.min.js'
import './p5.dom.min.js'
import './p5.js'
import * as P5Class from "p5"

export function sketch(p5){
    let data = [] // File paths and friendly names for participant biometrics
    let axes = []
    let prefixPath = `${window.location.protocol}//${window.location.hostname}` // This is the prefix for the file server

    p5.updateWithProps = props => {
        if(axes.length == 0){ // This will be updated only once
            axes = props.axes;
            // Along with axes we can be certain the data array can be initialized
            data = props.files
            // Loading first file as to have something to demonstrate
            // Then continuing with the things setup couldn't do because
            // the data were not previously available
            table = p5.loadTable(`${prefixPath}/${data[0].path}`, 'csv', 'header', () => {console.log('Done loading')}) 
        }        
    };

    let heartSamplePath = './HEART-loop.mp3'
    let bootPath = './TR-909Kick.mp3'
    let table
    let sound, boot, bootLoop
    let oscillator, minFreq = 2000, maxFreq = 3000

    let samplingRate = 100 // Not really the sampling rate, but rather every how many lines do we take into account.
    let min = [1000, 1000, 1000] // index 0 is HR, index 1 is SC, index 2 is TEMP
    let max = [0, 0, 0]
    let repNo = 0, numberOfReps = 0, frameNo = 0, frameRate = 25
    
    // All of the following are handlers for GUI components,
    // so we can enable/disable them or otherwise modify them, when needed
    let heartTypeRadio, biometricRadio, oscillatorTypeRadio
    let container, playContainer, exportContainer
    let playButton, pauseButton, stopButton, playAndExportButton
    let playRecordingButton
    let downloadButton
    let fileSelect
    let axisChoice
    
    let recorder, recording, videoBlob, pseudoOscillator
    let isRecording = false, isSoundReady = false
    let gradient
    let old_colors, new_colors

    p5.preload = () => {
        sound = p5.loadSound(`${prefixPath}/data/assets/HEART-loop.mp3`)
        boot = p5.loadSound(`${prefixPath}/data/assets/TR-909Kick.mp3`)
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
    
        // The user has the following options for the visualizer:
        // A) One of the colors of the axes that the episode belongs to
        // B) A gradient of all the aforementioned colors.
        axisChoice = p5.createRadio().parent(container).addClass('p5GUI-row')
        for(let i = 0; i < axes.length; i++){
            axisChoice.option(axes[i].name, i.toString())
        }
        axisChoice.option('All axes', 'all')
        axisChoice.selected('0')
    
        axisChoice.changed(() => {
            initializeVisuals()
        })
    }

    // This is responsible for the appearance of the canvas.
    // If one axis color is chosen, then that color is applied as a background color,
    // otherwise a gradient is created.
    // The logic of the color created will be explained in createColors
    function initializeVisuals(){
        old_colors = []
        new_colors = []
        createColors()
        switch(axisChoice.value()){
            case 'all':
                axes.map((_, idx) => gradient.addColorStop(idx/(axes.length - 1), old_colors[idx]))
                p5.drawingContext.fillStyle = gradient;    
                p5.rect(0, 0, p5.width, p5.height)        
                break;
            default:
                p5.background(old_colors[0])
                break;
        }
    }
    
    // This is responsible for the sound produced.
    function setAudio(){
        let freq
        switch(biometricRadio.value()){
            case 'heart':
                switch(heartTypeRadio.value()){
                    case 'heart':
                        // Sonifying heart rate with a heart sound.
                        // The sound file continuously loops,
                        // and all we must do is map the heart rate's value
                        // to the range [0.5, 1.2]
                        // and change the playback rate accordingly
                        let rate = p5.constrain(p5.map(table.get(repNo*samplingRate, 0), min[0], max[0], 0.5, 1.25), 0.5, 1.25)
                        sound.rate(rate)
                        break;
                    case 'boot':
                        // Sonifying heart rate with a kick sound
                        // A loop continuously runs, and on a certain time period,
                        // triggers the playback of a file
                        // We must then map the heart rate to this time period.
                        bootLoop.interval = genPeriod();
                        break;
                    default:
                        break;
                }
                break;
            case 'gsr':
                // GSR sonification consists of mapping the biometric value to the oscillator frequency
                freq = p5.constrain(p5.map(table.get(repNo*samplingRate, 1), min[1], max[1], minFreq, maxFreq), minFreq, maxFreq)
                oscillator.freq(freq, 0.1)
                break;  
            case 'temp':
                // Temperature sonification consists of mapping the biometric value to the oscillator frequency
                freq = p5.constrain(p5.map(table.get(repNo*samplingRate, 2), min[2], max[2], minFreq, maxFreq), minFreq, maxFreq)
                oscillator.freq(freq, 0.1)
                break;
            case 'all':
                // Sonifying all biometrics works as follows:
                // We map each biometric to a frequency
                // Then we find the average of the frequencies,
                // and change the oscillator's frequency to this average value.
                let frequencies = 0
                for(let i = 0; i < 2; i++){
                    frequencies += p5.constrain(p5.map(table.get(repNo*samplingRate, i), min[i], max[i], minFreq, maxFreq), minFreq, maxFreq)
                }
                freq = frequencies/3
                oscillator.freq(freq, 0.1)
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

    p5.setup = () => {
        console.log('setup')
        p5.createCanvas(800, 800)
        // The visualizer works with HSB mode. Hue and saturation of the colors
        // are determined by the axes the episode belongs to,
        // and brightness is the parameter that is control by the biometrics.
        p5.colorMode(p5.HSB)

        findMinMax()
        createGUI()
        // Searching for the appropriate container for the gui
        // most likely a React-Bootstrap Col object
        // so now that we're done creating the gui we can place it appropriately
        container.parent(p5.select('#sketch-gui-container'))

        // Creating an oscillator for all other sonifications (and making it very silent at first)
        oscillator = new P5Class.Oscillator()
        oscillator.freq(20)
        oscillator.amp(0.2)

        // Creating a loop for the heart rate sonifications
        bootLoop = new P5Class.SoundLoop(() => boot.play(), genPeriod());
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

        // initializing the sonification
        setAudio()

        // Initializing canvas appearance
        gradient = p5.drawingContext.createLinearGradient(p5.width/2, 0, p5.width/2, p5.height) // This is used when all axes are used in the visualization
        initializeVisuals() 
        p5.noLoop()
    }

    p5.draw = () => {    
        if(p5.isLooping()){
            if(repNo < numberOfReps){
                if(frameNo % frameRate == 0){ // Every second
                    // Reading a new line from the csv and updating the sonifying element (oscillator, playback rate or sound loop interval)
                    setAudio()
                    // Updating colors of visualization
                    createColors()
                    // Monochromatic or gradient visualization?
                    switch(axisChoice.value()){
                        case 'all':
                            axes.map((_, idx) => gradient.addColorStop(idx/(axes.length - 1), old_colors[idx]))
                            p5.drawingContext.fillStyle = gradient;    
                            p5.rect(0, 0, p5.width, p5.height)                    
                            break;
                        default:
                            p5.background(old_colors[0])
                            break;
                    }
                    repNo++
                }else{
                    // All frames after the first in a given second,
                    // are focused on the transition between the current color
                    // and the next color, the way that they result from the mappings.
                    // LERPing is applied between the current and next color.
                    // The percentage is the percentage of frames of the current second
                    // already drawn.
                    switch(axisChoice.value()){
                        case 'all':
                            axes.map((_, idx) => {
                                gradient.addColorStop(idx/(axes.length - 1), p5.lerpColor(old_colors[idx], new_colors[idx], (frameNo % frameRate)/frameRate))
                            })
                            p5.drawingContext.fillStyle = gradient;    
                            p5.rect(0, 0, p5.width, p5.height)                    
                            break;
                        default:
                            let c = p5.lerpColor(old_colors[0], new_colors[0], (frameNo % frameRate)/frameRate)
                            p5.background(c)
                            break;
                    }
                }
                frameNo++
            }else{
                stopSonification()
                p5.noLoop()
            }
        }
    }
    
    function startSonification(){
        // This is used so the sound loop can play without any other sonification playing beforehand.
        // If this isn't used, one must choose any other option, stop, then choose the kick option.
        p5.userStartAudio() 
        startSound()
        p5.loop()
        // Disabling most GUI elements
        playButton.attribute('disabled', '')
        pauseButton.removeAttribute('disabled')
        stopButton.removeAttribute('disabled')
        heartTypeRadio.attribute('disabled', '')
        biometricRadio.attribute('disabled', '')
        oscillatorTypeRadio.attribute('disabled', '')
        playAndExportButton.attribute('disabled', '')
        axisChoice.attribute('disabled', '')
        fileSelect.attribute('disabled', '')
        // If the user has already created a recording, we must disable this button as well
        if(!isRecording && isSoundReady){
            playRecordingButton.attribute('disabled', '')
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
                        sound.stop()
                        break;
                    case 'boot':
                        bootLoop.stop()
                        pseudoOscillator.stop()
                        break;
                    default:
                        break;
                }
                break;
            case 'temp':
            case 'gsr':
            case 'all':
                oscillator.stop()
                break;        
            default:
                break;
        }
    }
    
    function stopSonification(){
        // Resetting repetition and frame counters, so that the sonification and visualization can start from the top.
        repNo = 0
        frameNo = 0
        stopSound()
        p5.noLoop()

        // Re-enabling GUI elements
        playButton.removeAttribute('disabled')
        pauseButton.attribute('disabled', '')
        stopButton.attribute('disabled', '')
        playAndExportButton.removeAttribute('disabled')
        heartTypeRadio.removeAttribute('disabled')
        biometricRadio.removeAttribute('disabled')
        axisChoice.removeAttribute('disabled')
        oscillatorTypeRadio.removeAttribute('disabled')
        fileSelect.removeAttribute('disabled')
        // If the recorder is also running, we handle its state variables and GUI components accordingly
        if(isRecording){
            playRecordingButton.removeAttribute('disabled')
            downloadButton.removeAttribute('disabled')
            recorder.stop()
            isRecording = false
            isSoundReady = true
        }else if(!isRecording && isSoundReady){
            playRecordingButton.removeAttribute('disabled', '')
        }
        // Redrawing the canvas so it takes the colors
        // that correspond to the values in the CSV's first line
        initializeVisuals()
    }

    function pauseSonification(){
        p5.noLoop()
        stopSound()
        playButton.removeAttribute('disabled')
        axisChoice.removeAttribute('disabled')
        pauseButton.attribute('disabled', '')
    }
    
    function recordSonification(){
        // Same logic with start sonification, but here we cannot stop
        // the recording before all lines are read from the CSV
        p5.userStartAudio()
        playButton.attribute('disabled', '')
        pauseButton.attribute('disabled', '')
        stopButton.attribute('disabled', '')
        playAndExportButton.attribute('disabled', '')
        heartTypeRadio.attribute('disabled', '')
        biometricRadio.attribute('disabled', '')
        oscillatorTypeRadio.attribute('disabled', '')
        axisChoice.attribute('disabled', '')
    
        isRecording = true
    
        recording = new P5Class.SoundFile()
        recorder.record(recording)
        startSound()
        p5.loop()
        startRecording()
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
    
    // This function creates the colors from reading the current values of the CSV,
    // as well as the very next one. This way we can smoothly transition between the colors, using LERPing
    // If all axes are selected, multiple colors per line are created, otherwise, only one per line (two overall)
    function createColors(){
        switch(axisChoice.value()){
            case 'all':
                for(let i = 0; i < axes.length; i++){
                    old_colors[i] = createColor(repNo*samplingRate, i)
                    new_colors[i] = createColor((repNo+1)*samplingRate, i)
                }
                break;
            default:
                old_colors[0] = createColor(repNo*samplingRate, parseInt(axisChoice.value()))
                new_colors[0] = createColor((repNo+1)*samplingRate, parseInt(axisChoice.value()))
                break;
        }
    }
    
    // This function reads the appropriate biometric,
    // extracts the hue and saturation from the appropriate axis color
    // and maps the biometric to a brightness value, which is combined with
    // the above two properties to form a color.
    // If all biometrics are selected, then they are all mapped to a brightness value (a number in the range [0, 100])
    // then an average value is calculated and that is used as the brightness of the color being created
    function createColor(repNo, colorNo){
        let c
        switch(biometricRadio.value()){
            case 'heart':
                c = p5.color(p5.hue(axes[colorNo].color), p5.saturation(axes[colorNo].color), p5.constrain(p5.map(table.get(repNo, 0), min[0], max[0], 0, 100), 0, 100))
                break;
            case 'gsr':
                c = p5.color(p5.hue(axes[colorNo].color), p5.saturation(axes[colorNo].color), p5.constrain(p5.map(table.get(repNo, 1), min[1], max[1], 0, 100), 0, 100))
                break;  
            case 'temp':
                c = p5.color(p5.hue(axes[colorNo].color), p5.saturation(axes[colorNo].color), p5.constrain(p5.map(table.get(repNo, 2), min[2], max[2], 0, 100), 0, 100))
                break;
            case 'all':
                let brightnesses = 0
                for(let i = 0; i < 2; i++){
                    brightnesses += p5.constrain(p5.map(table.get(repNo, i), min[i], max[i], 0, 100), 0, 100)
                }
                c = p5.color(p5.hue(axes[colorNo].color), p5.saturation(axes[colorNo].color), brightnesses/3)
                break;
            default:
                break;
        }
        return c
    }   
}