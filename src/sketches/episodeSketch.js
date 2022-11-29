import './p5.sound.min.js'
import './p5.dom.min.js'
import './p5.js'
import * as P5Class from "p5"

export function sketch(p5){
    let prefixPath = `${window.location.protocol}//${window.location.hostname}` // This is the prefix for the file server
    let filepaths = []
    let tables = []

    let axes = []
    
    p5.updateWithProps = props => {
        if(axes.length == 0){ // This will be updated only once
            axes = props.axes;
            // Along with axes we can be certain the data array can be initialized
            filepaths = props.files
            // Loading all files from the get go
            filepaths.map(filepath => {console.log(`${prefixPath}/${filepath.path}`); tables.push(p5.loadTable(`${prefixPath}/${filepath.path}`, 'csv', 'header', () => console.log(`Done loading ${filepath}`)))})
        }        
    }
        
    // let min , max
    
    // let old_colors = [], new_colors = []
    // let numberOfReps = 0
    
    // let frameNo = 0
    // let frameRate = 25
    // let samplingRate = 100
    // let repNo = 0
    
    // let guiContainer, biometricAnalyticsContainer, studioContainer
    // // guiContainer is a parent to the following two.
    // // biometricAnalyticsContainer contains the grey ribbon at the top part of the screen
    // // where the biometrics' ranges and current values are displayed
    // // studioContainer has the sliders, buttons and radio buttons that control
    // // the visualization and sonification parameters.
    
    // let gradient
    // let axisChoice, axisColor
    
    // let oscillators = [] // One per participant
    // let envelopes = [] // One per participant
    // let env_trigger_loops = [] // Triggers the corresponding envelope, which in turn controls the corresponding oscillator's amplitude. 
    // // The sound loop's interval determines when the envelope is triggered, and the interval varies in accordance with the variations in the participant's heart rate.
    
    // let currentC = 60; // Participant's oscillators' frequencies start from middle C
    
    // // let lower_freq_bounds = [] // The lowest frequency the corresponding participant's oscillator can have
    // // let upper_freq_bounds = [] // The highest frequency the corresponding participant's oscillator can have
    // let minAmp = 0.2, maxAmp = 0.5
    // let playButton, pauseButton, stopButton // Buttons that control the sonification and visualization.
    // let playAndExportButton, playRecordingButton // Buttons that have to do with recording and exporting the sonification and visualization.
    // let hideGUI // This button will show or hide the GUI, biometric analytics container, and color stop indicators (the 4 rectangles)
    // let isGUIhidden = false // This will check whether the above button must toggle visibility on or off
    // let downloadButton, downloadVideoButton
    // // let lowerFreqSlider, upperFreqSlider
    // let attackSlider, decaySlider
    // let amplitudeSlider
    // let oscillatorTypeRadio
    // let isRecording = false
    // let recorder // This is used to record the sound from our sketch
    // let recordingSoundFile // This is where the sound recording is kept
    // let videoBlob // This is where the video recording of the visualization is stored
    
    // let universalReleaseTime = 0.005 // This is the smallest value that didn't produce audible clicks for 4 participants
    
    // function findMinMax(){
    //     let currval
    //     // The following arrays contain the minimum and maximum of all biometrics PER PARTICIPANT
    //     // 1st dimension (row): biometric
    //     // 2nd dimension (column): participant
    //     min = Array(tables[0].getColumnCount())
    //     max = Array(tables[0].getColumnCount())
    //     for(let i = 0; i < min.length; i++){
    //         min[i] = Array(tables.length).fill(1000)
    //         max[i] = Array(tables.length).fill(0)
    //     }
    //     for(let f = 0; f < tables.length; f++){
    //         for(let i = 0; i < tables[f].getRowCount(); i += samplingRate){
    //             for(let j = 0; j < tables[f].getColumnCount(); j++){
    //                 currval = parseFloat(tables[f].get(i, j))
    //                 min[j][f] = (() => {return currval < min[j][f] ? currval : min[j][f]})()
    //                 max[j][f] = (() => {return currval > max[j][f] ? currval : max[j][f]})()
    //             }
    //         }
    //     }
    // }
    
    // // N squares where N is no of participants, that show min and max for all biometrics and current values (and maybe brightness value that is the result of the 'normalization')
    // let biometricCurrentValues
    // function createBiometricValueRibbon(){
    //     let container = createDiv().addClass('container').addClass('greyRibbon')
    //     let biometricNames = ['HR', 'GSR', 'Temp']
    //     // Keeping current values of all biometrics for all participants to change later
    //     biometricCurrentValues = Array(3)
    //     for(let i = 0; i < 3; i++){
    //         biometricCurrentValues[i] = Array(tables.length)
    //     }
    //     tables.map((table, idx) => {
    //         let square = createDiv().addClass('row-item').addClass('greyRibbon').parent(container)
    //         createDiv(`P${idx+1}`).addClass('column-item').parent(square)
    //         for(let i = 0; i < tables[idx].getColumnCount(); i++){
    //             createDiv(`${biometricNames[i]}: [${min[i][idx]}, ${max[i][idx]}]`).addClass('column-item').parent(square)
    //             biometricCurrentValues[i][idx] = createP(`Currently: ${table.get(repNo, i)}`).addClass('column-item').parent(square)
    //         }
    //     })
    //     return container
    // }
    
    // function updateCurrentBiometricValues(){
    //     tables.map((table, idx) => {
    //         for(let i = 0; i < table.getColumnCount(); i++){
    //             biometricCurrentValues[i][idx].html(`Currently: ${table.get(repNo*samplingRate, i)}`)
    //         }
    //     })
    // }
    
    // function createGUI(){
    //     let container = createDiv().addClass('parentContainer')
    //     let tempContainer = createDiv().parent(container).addClass('column-item')
    
    //     playButton = createButton('Play').parent(tempContainer).addClass('row-item')
    //     playButton.mousePressed(startSonification);
    
    //     pauseButton = createButton('Pause').parent(tempContainer).addClass('row-item')
    //     pauseButton.mousePressed(pauseSonification);
    //     pauseButton.attribute('disabled', '')
    
    //     stopButton = createButton('Stop').parent(tempContainer).addClass('row-item')
    //     stopButton.mousePressed(stopSonification);
    //     stopButton.attribute('disabled', '')
    
    //     // tempContainer = createDiv().parent(container).addClass('column-item')
    //     // // Allowing frequencies to range from C3 to B6
    //     // // and enforcing constrain that at least two octaves of frequencies must be allocated to all participants and then further divided
    //     // // The following range of frequencies will be split up in however many pieces required 
    //     // // according to the number of participants that show up in an episode
    //     // createP('Lowest note: C3').parent(tempContainer).addClass('row-item')
    //     // lowerFreqSlider = createSlider(48, 71, 48).parent(tempContainer).addClass('row-item')
    //     // createP('B4').parent(tempContainer).addClass('row-item')
    
    //     // tempContainer = createDiv().parent(container).addClass('column-item')
    //     // createP('Highest note: C5').parent(tempContainer).addClass('row-item')
    //     // upperFreqSlider = createSlider(72, 95, 95).parent(tempContainer).addClass('row-item')
    //     // createP('B6').parent(tempContainer).addClass('row-item')
    
    //     // lowerFreqSlider.changed(() => {
    //     //     notesToPlay()
    //     // })
    
    //     // upperFreqSlider.changed(() => {
    //     //     notesToPlay()
    //     // })
    
    //     // Slider for attackTime
    //     tempContainer = createDiv().parent(container).addClass('column-item')
    //     createP('Attack Time: 0.001').parent(tempContainer).addClass('row-item')
    //     attackSlider = createSlider(0.001, 0.3, 0.001, 0.001).parent(tempContainer).addClass('row-item')
    //     createP('0.3').parent(tempContainer).addClass('row-item')
    //     attackSlider.changed(() => {
    //         handleAudio()
    //     })
    
    //     // Slider for decayTime
    //     tempContainer = createDiv().parent(container).addClass('column-item')
    //     createP('Decay Time: 0.001').parent(tempContainer).addClass('row-item')
    //     decaySlider = createSlider(0.001, 0.3, 0.15, 0.001).parent(tempContainer).addClass('row-item')
    //     createP('0.3').parent(tempContainer).addClass('row-item')
    //     decaySlider.changed(() => {
    //         handleAudio()
    //     })
    
    //     tempContainer = createDiv().parent(container).addClass('column-item')
    //     createP('Volume: ').parent(tempContainer).addClass('row-item')
    //     amplitudeSlider = createSlider(0, 1, 0.5, 0.1).parent(tempContainer).addClass('row-item')
    //     outputVolume(0.5, 0)
    //     amplitudeSlider.changed(() => {
    //         outputVolume(amplitudeSlider.value(), 0.15)
    //     })
    
    //     tempContainer = createDiv().parent(container).addClass('column-item')
    //     oscillatorTypeRadio = createRadio().parent(tempContainer)
    //     oscillatorTypeRadio.option('Sine', 'sine')
    //     oscillatorTypeRadio.option('Triangle', 'triangle')
    //     oscillatorTypeRadio.option('Sawtooth', 'sawtooth')
    //     oscillatorTypeRadio.option('Square', 'square')
    //     oscillatorTypeRadio.selected('sine')
    //     oscillatorTypeRadio.changed(() => {
    //         oscillators.map((osc) => osc.setType(oscillatorTypeRadio.value()))
    //     })
    
    //     tempContainer = createDiv().parent(container).addClass('column-item')
    //     playAndExportButton = createButton('Play & Export').parent(tempContainer).addClass('row-item');
    //     playAndExportButton.mousePressed(recordSonification);
    
    //     // playRecordingButton = createButton('Play Recording').parent(exportContainer).addClass('item')
    //     // playRecordingButton.mousePressed(handlePlayback)
    //     // playRecordingButton.attribute('disabled', '')
    //     downloadButton = createButton('Download Sonification Recording').parent(tempContainer).addClass('row-item')
    //     downloadButton.mousePressed(() => {save(recordingSoundFile, 'sonification.wav')});
    //     downloadButton.attribute('disabled', '')
    
    //     downloadVideoButton = createButton('Download Visualization Video').parent(tempContainer).addClass('row-item')
    //     downloadVideoButton.mousePressed(() => {exportVid(videoBlob)})
    //     downloadVideoButton.attribute('disabled', '')
        
    //     axisChoice = createRadio().parent(container).addClass('column-item')
    //     for(let i = 0; i < axes.length; i++){
    //         axisChoice.option(axes[i].name, i.toString())
    //     }
    //     axisChoice.selected('0')
    //     axisColor = axes[0].color
    //     axisChoice.changed(() => {
    //         axisColor = axes[parseInt(axisChoice.value())].color
    //         console.log(axisColor)
    //         initializeVisuals()
    //     })
    //     return container
    // }
    
    // function startRecordingVisualization() {
    //     const chunks = []; // Here we will store our recorded media chunks (Blobs)
    //     const canvas = document.querySelector('canvas');
    //     const stream = canvas.captureStream(25); // Grab our canvas MediaStream
    //     const rec = new MediaRecorder(stream); // Init the recorder
    //     // Every time the recorder has new data, we will store it in our array
    //     rec.ondataavailable = e => chunks.push(e.data);
    //     // Only when the recorder stops, we construct a complete Blob from all the chunks
    //     // rec.onstop = e => exportVid(new Blob(chunks, {type: 'video/mp4'}));
    //     rec.onstop = e => videoBlob = new Blob(chunks, {type: 'video/mp4'});
        
    //     rec.start();
    //     setTimeout(()=>rec.stop(), numberOfReps*1000); // If we increase repNo every 25 frames, 
    //     // and 25 frames are in a second, the rough length of the vis video is numberOfReps seconds
    // }
      
    // function exportVid(blob) {
    //     const a = document.createElement('a');
    //     a.download = 'myvid.mp4';
    //     a.href = URL.createObjectURL(blob);
    //     a.textContent = 'download the video';
    //     document.body.appendChild(a);
    //     a.click()
    //     a.remove()
    // }
    
    // function initializeVisuals(){
    //     old_colors = []
    //     new_colors = []
    //     createColors()
    //     handleGradient()
    // }
    
    // function genPeriod(i){
    //     let currentRate = floor(tables[i].get(repNo*samplingRate, 0)) // Convention: Heart Rate is always the 1st column
    //     let period = 60/currentRate
    //     return period;
    // }
    
    // function initializeAudio(){
    //     for(let i = 0; i < tables.length; i++){
    //         oscillators[i] = new p5.Oscillator('sine')
    //         envelopes[i] = new p5.Envelope()
    //         envelopes[i].setADSR(0.001, 0.2, 0.2, universalReleaseTime) 
    //         oscillators[i].amp(envelopes[i])
    //         env_trigger_loops[i] = new p5.SoundLoop(() => {envelopes[i].play(oscillators[i])}, genPeriod(i))
    //         env_trigger_loops[i].bpm = 0
    //     }
    //     notesToPlay()
    // }
    
    // function notesToPlay(){
    //     // Assigning frequencies to oscillators
    //     // Participants are all assigned to a note of the C major chord
    //     // This way, the end result is a lot more harmonious
    //     // When there are more than 3 participants, the chord is repeated
    //     // in higher octaves
    //     for(let i = 0; i < tables.length; i++){
    //         // When we're done with a triad of participants,
    //         // change current octave
    //         if(i && i % 3 == 0){ // The octave change does not take place the very first time we run the loop
    //             currentC += 12
    //         }
    //         switch(i % 3){
    //             // The C Major chord has 3 notes:
    //             // C, E, G
    //             // The 1st participant is C, the 2nd is E, the 3rd is G,
    //             // the 4th is the next C and so on.
    //             case 0: // C
    //                 oscillators[i].freq(midiToFreq(currentC))
    //                 break;
    //             case 1: // E
    //                 oscillators[i].freq(midiToFreq(currentC + 4))
    //                 break;
    //             case 2: // G
    //                 oscillators[i].freq(midiToFreq(currentC + 7))
    //                 break;
    //             default:
    //                 console.log('Default case')
    //                 break;
    //         }
    //     }
    //     handleAudio()
    // }
    
    p5.setup = () => {
        let parentElem = p5.select('#sketch-canvas-container-large').elt
        let canvasWidth = parentElem.clientWidth
        p5.createCanvas(canvasWidth - 50, 600)
    //     createCanvas(windowWidth, 800)
        p5.background('white')
        p5.colorMode(p5.HSB)
        
    //     numberOfReps = Math.floor(tables[0].getRowCount()/samplingRate)
    //     noStroke()
    //     findMinMax()
    //     setFrameRate(frameRate)
    //     guiContainer = createDiv().addClass('parentContainer')
    //     guiContainer.position(0, 0)
    //     biometricAnalyticsContainer = createBiometricValueRibbon().parent(guiContainer).addClass('column-item')
    //     studioContainer = createGUI().parent(guiContainer).addClass('column-item')
    //     hideGUI = createButton('Hide GUI').parent(guiContainer).addClass('column-item')
    //     hideGUI.mousePressed(() => {
    //         if(!isGUIhidden){
    //             hideGUI.html('Show GUI')
    //             studioContainer.style('display', 'none')
    //             biometricAnalyticsContainer.style('display', 'none')
    //         }else{
    //             hideGUI.html('Hide GUI')
    //             studioContainer.style('display', 'flex')
    //             biometricAnalyticsContainer.style('display', 'flex')
    //         }
    //         isGUIhidden = !isGUIhidden
    //         initializeVisuals() // Calling this again to remove or redraw the color stop indicators
    //     })
    
    
    //     gradient = drawingContext.createLinearGradient(0, height/2, width, height/2)
    //     numberOfReps = 20
        
    //     initializeAudio()
    //     recorder = new p5.SoundRecorder()
    
    //     noLoop()
    }
    
    // function handleGradient(){
    //     if(frameNo % frameRate == 0){ // New colors read from CSV
    //         createColors()
    //         gradient = drawingContext.createLinearGradient(0, height/2, width, height/2)
    //         if(tables.length !== 1){           
    //             tables.map((_, idx) => {
    //                 gradient.addColorStop(idx/(tables.length - 1), old_colors[idx])
    //             })
    //         }else{ // Edge case, only 1 participant
    //             gradient.addColorStop(0, old_colors[0])
    //         }
    //         drawingContext.fillStyle = gradient;
    //         rect(0, 0, width, height) 
    //         updateCurrentBiometricValues()
    //     }else{ // In between colors to make transition from one shade of the color to the next smooth
    //         gradient = drawingContext.createLinearGradient(0, height/2, width, height/2)
    //         if(tables.length !== 1){           
    //             tables.map((_, idx) => {
    //                 gradient.addColorStop(idx/(tables.length - 1), lerpColor(old_colors[idx], new_colors[idx], (frameNo % frameRate)/frameRate))
    //                 // LERPing colors by the percentage of frames already 'played' in the current second
    //             })
    //         }else{ // Edge case, only 1 participant
    //             gradient.addColorStop(0, lerpColor(old_colors[0], new_colors[0], (frameNo % frameRate)/frameRate))
    //         }
    //         drawingContext.fillStyle = gradient;    
    //         rect(0, 0, width, height)                    
    //     }
    //     // This following part gives an insight by changing the value of the biometric in real time
    //     // and comparing the value to the minimum and maximum value, respectively
     
    //     stroke('white')
    //     strokeWeight(1)
    //     // These rectangles act as guides to show the parts of the scene where the actual participant's shade is
    //     // In between it's just the gradient.
    //     if(!isGUIhidden){ // the rectangles indicating a color stop are only drawn if the rest of the gui is visible
    //         if(tables.length !== 1){ // No point in having rectangles if there's just one participant
    //             // The first and last color stops are at the edge of the canvas so they require separate handling.
    //             rect(0, 0, 20, height) // first color stop
    //             rect(width-20, 0, 20, height) // last color stop
    //             // In between
    //             for(let i = 1; i < tables.length - 1; i++){
    //                 rect(i*width/(tables.length - 1), 0, 20, height)
    //             }
    //         }
    //     }
    //     noStroke()
    // }
    
    // // This is called once per second when the sonification is running,
    // // right before the sonification starts and once when it stops, 
    // // as to reset the values of the trigger loop intervals, 
    // // oscillator frequencies and amplitudes.
    // function handleAudio(){
    //     let amp, freq
    //     for(let i = 0; i < tables.length; i++){
    //         env_trigger_loops[i].interval = genPeriod(i)
    //         amp = constrain(map(tables[i].get(repNo*samplingRate, 2), min[2][i], max[2][i], minAmp, maxAmp), minAmp, maxAmp) // Mapping temperature to amplitude
    //         envelopes[i].setRange(amp, 0)        
    //         // GSR is mapped to the sustain level of the ADSR envelope
    //         let susRatio = constrain(map(tables[i].get(repNo*samplingRate, 1), min[1][i], max[1][i], 0, 1.0), 0, 1.0)
    //         // console.log('Envelope: ' + i + ', susRatio: ' + susRatio)
    //         envelopes[i].setADSR(attackSlider.value(), decaySlider.value(), susRatio, universalReleaseTime)
    //     }
    // }
    
    // function draw(){    
    //     if(repNo < numberOfReps){
    //         handleGradient()
    //         // Every second we read another line from the CSV 
    //         // So every second, we redetermine what the participant's heart rate is
    //         // and this changes each loop's interval, effective immediately,
    //         // as well as the oscillators' frequencies and amplitudes
    //         if(frameNo % frameRate == 0){
    //             handleAudio()
    //             repNo++
    //         }
    //         frameNo++
    //     }else{
    //         stopSonification()
    //     }
    // }
    
    // function createColor(repNo, colorNo){
    //     // Mapping a biometric (temporarily hardcoded, always the heartbeat) to a number in brightness' valid range of values.
    //     let brightnesses = 0, bioCount = tables[colorNo].getColumnCount()
    //     for(let i = 0; i < bioCount; i++){
    //         brightnesses += constrain(map(tables[colorNo].get(repNo, i), min[i][colorNo], max[i][colorNo], 0, 100), 0, 100)
    //     }
    //     return color(hue(axisColor), saturation(axisColor), brightnesses/bioCount)
    // }
    
    // function createColors(){
    //     // In order to have the smooth transition between shades as time passes,
    //     // we must know both the current and the next shade according to the mappings beforehand.
    //     if(new_colors.length != 0){
    //         for(let i = 0; i < new_colors.length; i++){
    //             old_colors[i] = new_colors[i]
    //             new_colors[i] = createColor((repNo + 1)*samplingRate, i)
    //         }
    //     }else{
    //         for(let i = 0; i < filepaths.length; i++){
    //             old_colors.push(createColor(repNo*samplingRate, i))
    //             new_colors.push(createColor((repNo + 1)*samplingRate, i))
    //         }
    //     }
    // }
    
    // function startSonification(){
    //     userStartAudio()
    //     startSound()
    //     loop()
    //     playButton.attribute('disabled', '')
    //     pauseButton.removeAttribute('disabled')
    //     stopButton.removeAttribute('disabled')
    //     playAndExportButton.attribute('disabled', '')
    //     axisChoice.attribute('disabled', '')
    //     // if(!isRecording && isSoundReady){
    //     //     playRecordingButton.attribute('disabled', '')
    //     // }
    // }
    
    // function startSound(){
    //     env_trigger_loops.map((loop, idx) => {
    //         loop.start()
    //         oscillators[idx].start()
    //     })
    // }
    
    // function stopSound(){
    //     env_trigger_loops.map((loop, idx) => {
    //         loop.stop()
    //         oscillators[idx].stop()
    //     })
    // }
    
    // function stopSonification(){
    //     repNo = 0
    //     frameNo = 0
    //     stopSound()
    //     noLoop()
    //     playButton.removeAttribute('disabled')
    //     pauseButton.attribute('disabled', '')
    //     stopButton.attribute('disabled', '')
    //     playAndExportButton.removeAttribute('disabled')
    //     axisChoice.removeAttribute('disabled')
    //     if(isRecording){
    //     //     playRecordingButton.removeAttribute('disabled')
    //         downloadButton.removeAttribute('disabled')
    //         downloadVideoButton.removeAttribute('disabled')
    //         recorder.stop() // Stopping the sound recorder manually, the visualization recorder uses a timeout to stop
    //         isRecording = false
    //         // isSoundReady = true
    //     // }else if(!isRecording && isSoundReady){
    //     //     playRecordingButton.removeAttribute('disabled', '')
    //     }
    //     initializeVisuals()
    //     handleAudio()
    //     numberOfReps = 20
    // }
    
    // function pauseSonification(){
    //     noLoop()
    //     stopSound()
    //     playButton.removeAttribute('disabled')
    //     axisChoice.removeAttribute('disabled')
    //     pauseButton.attribute('disabled', '')
    // }
    
    // function recordSonification(){
    //     // Disable all other buttons, including play and export, but not sliders
    //     // Start recording, set state variable to true
    //     playButton.attribute('disabled', '')
    //     pauseButton.attribute('disabled', '')
    //     stopButton.attribute('disabled', '')
    //     playAndExportButton.attribute('disabled', '')
    //     // playRecordingButton.attribute('disabled', '')
    //     // downloadButton.attribute('disabled', '')
    
    //     isRecording = true
    //     recordingSoundFile = new p5.SoundFile()
    //     recorder.record(recordingSoundFile)
    //     startRecordingVisualization()
    //     startSound()
    //     loop()
    // }
}