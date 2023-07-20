import '../lib/p5.sound.min.js'
import '../lib/p5.dom.min.js'
import '../lib/p5.js'
import * as P5Class from "p5"
// import * as bufferToWav from 'audiobuffer-to-wav'
let toWav = require('audiobuffer-to-wav')

export function sketch(p){
    let toPlay, playing = false, setUpComplete = false;
    let biosignal;
    let sound;
    let table;
    let filePath;
    let namingData; 
    p.updateWithProps = props => {
        if(props.biosignal){
            const old_biosignal = biosignal;
            if(old_biosignal !== props.biosignal){
                biosignal = props.biosignal;
            }
        }
        if(props.stopSonificationCallback){
            p.stopSonificationCallback = props.stopSonificationCallback;
        }
        if(props.toPlay !== undefined){
            toPlay = props.toPlay;
        }
        if(props.setToPlay){
            p.setToPlay = props.setToPlay;
        }
        if(props.sound){
            if(setUpComplete && playing && props.sound !== sound){
                if(props.sound !== 'heart' && props.sound !== 'drum' && sound !== 'heart' && sound !== 'drum'){
                    // In this case, we are just changing the oscillator's type
                    // No need to stop audio whatsoever
                    oscillator.setType(props.sound);
                }else{
                    stopSound();
                    playSound(props.sound);
                }
            }
            if(setUpComplete && props.sound !== sound && props.sound !== 'heart' && props.sound !== 'drum'){
                oscillator.setType(props.sound);
            }
            sound = props.sound;
        }
        if(props.file){
            const old_filepath = filePath;
            if(old_filepath !== props.file){
                filePath = props.file;
                table = p.loadTable(`${props.file}`, 'csv', 'header', () => {console.log('loaded table again'); findMinMax();})
            }
        }
        if(props.toReset){
            reset();
            props.setToReset(false);
        }
        if(props.setProgress) {
            p.setProgress = props.setProgress;
        }
        if(props.downloadRequested !== undefined && props.downloadRequested === true){
            downloadSound();
        }
        if(props.setDownloadRequested){
            p.setDownloadRequested = props.setDownloadRequested;
        }
        if(props.cleanUpCode){
            p.cleanUpCode = props.cleanUpCode;
        }
        if(props.cleanUp !== undefined){
            if(props.cleanUp === true){
                reset();
                p.cleanUpCode();    
            }
        }
        if(namingData === undefined && props.namingData){
            namingData = props.namingData;
        }
    }

    const resizeObserver = new ResizeObserver((entries) => {
        entries.forEach(entry => {
            p.resizeCanvas(entry.contentRect.width, p.height);
        });
    });

    const querySelector = document.querySelector('#playerContainer');
    resizeObserver.observe(querySelector);

    document.addEventListener("visibilitychange", () => {
        if(document.visibilityState == "hidden"){
            if(playing){    
                // The original idea was to simply notify the Player component of the pause
                // by manipulating the 'playing' state variable
                // but the changes are not applied until the user switches back to the tab,
                // and so the sound keeps playing.
                // So, we do, in fact, notify the component, so that the GUI can be properly rerendered
                // but we manually handle the local variables controlling the draw function
                // as well as manually stop the sound.
                // Putting the event listener in the Player component was tested and made zero difference.
                // We do not wish to automatically continue with playback on tab return
                p.setToPlay(false);
                toPlay = false;
                stopSound();
            }
        }
    });


    let progress = 0;
    // We want the progress bar to move a certain amount every rep.
    // Here we fine how much it has to move per rep.
    let percent;
    const findProgressPercent = () => {
        percent =  100/numberOfReps;
    }    

    let min, max, numberOfReps, repNo = 0;
    const samplingRate = 127;
    function findMinMax(){ // finds minimum and maximum values of all biometrics
        // for any given participant, to later use them in mapping.
        let currval;
        numberOfReps = 0;
        min = [1000, 1000, 1000]; // index 0 is HR, index 1 is SC, index 2 is TEMP
        max = [0, 0, 0];
        for(let i = 0; i < table.getRowCount(); i += samplingRate){
            for(let j = 0; j < 3; j++){
                currval = parseFloat(table.get(i, j));
                min[j] = (() => {return currval < min[j] ? currval : min[j]})();
                max[j] = (() => {return currval > max[j] ? currval : max[j]})();
            }
            numberOfReps++;
        }
        findProgressPercent();
    }

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

    let heart, kick, kickLoop, pseudoOscillator, oscillator;
    p.preload = () => {
        // heart = p.loadSound(`https://transitionto8.athenarc.gr/data/assets/HEART-loop.mp3`);
        heart = p.loadSound(`http://localhost/data/assets/HEART-loop.mp3`);
        // kick = p.loadSound(`https://transitionto8.athenarc.gr/data/assets/TR-909Kick.mp3`);
        // kick = p.loadSound(`https://transitionto8.athenarc.gr/data/assets/TR-909Kick - Copy.mp3`);
        kick = p.loadSound(`http://localhost/data/assets/TR-909Kick - Copy.mp3`);
    }

    const frameRate = 30;
    let frameNo = 0;

    let arrayOfFrequencies;
    const startingC = 48;
    const endingC = 72;
    function initArrayOfFreq(){
        // initializing the sonification
        // iterate through all available octaves
        // generate frequencies of C Major notes
        // store them in arrayOfFrequencies 
        arrayOfFrequencies = [];
        for(let i = startingC; i < endingC; i+=12){
            arrayOfFrequencies.push(p.midiToFreq(i)); // C
            arrayOfFrequencies.push(p.midiToFreq(i+4)); // E
            arrayOfFrequencies.push(p.midiToFreq(i+7)); // G
        }
    }

    function quantizeFrequency(freq){
        let immLowerFreq, immHigherFreq;
        for(let i = 0; i < arrayOfFrequencies.length; i++){
            immLowerFreq = arrayOfFrequencies[i];
            immHigherFreq = arrayOfFrequencies[i+1]
            if(freq >= immLowerFreq && freq <= immHigherFreq){ // Found which quantization levels we should consider
                // Which is closest to the frequency? The immediately lowest, or the immediately highest?
                if(p.abs(freq - immLowerFreq) < p.abs(freq - immHigherFreq))
                    return arrayOfFrequencies[i];
                else
                    return arrayOfFrequencies[i+1];
            }
        }
    }

    const binSize = 128;
    let fftObj;
    let heartGain, kickGain, oscGain;
    let gainNode;
    p.setup = () => {
        p.getAudioContext().suspend();

        p.createCanvas(p.select('#playerContainer').elt.clientWidth, 256);

        p.background('black');
        p.setFrameRate(frameRate);

        gainNode = new P5Class.Gain();
        gainNode.connect();
        gainNode.amp(0); 

        // An issue with heart sometimes starting multiple playbacks
        // has probably been resolved with this line
        heart.playMode('restart');

        heartGain = new P5Class.Gain();
        heartGain.amp(0);

        heart.disconnect();
        heartGain.setInput(heart);
        heartGain.connect(gainNode);

        kickLoop = new P5Class.SoundLoop(() => {
            kick.play(); 
        }, genPeriod());

        kickLoop.bpm = 0;
        kick.disconnect();
        pseudoOscillator = new P5Class.Oscillator('sine');
        pseudoOscillator.freq(5);
        pseudoOscillator.amp(0.01);
        pseudoOscillator.disconnect();

        kickGain = new P5Class.Gain();
        kickGain.amp(0);
        kickGain.setInput(kick);
        kickGain.setInput(pseudoOscillator);
        kickGain.connect(gainNode);

        initArrayOfFreq();
        oscillator = new P5Class.Oscillator();
        oscillator.disconnect();

        oscGain = new P5Class.Gain();
        oscGain.amp(0);
        oscGain.setInput(oscillator);
        oscGain.connect(gainNode);

        fftObj = new P5Class.FFT(0.8, binSize);

        setAudio();
        setUpComplete = true;
    }


    function offlineSonificationCreation() {
        const offlineCtx = new OfflineAudioContext(2, numberOfReps * 44100, 44100);
        const currentTime = offlineCtx.currentTime;
        const bioIdx = getBiosignalIdx();
        switch(sound){
            case 'heart':
                const heartSource = offlineCtx.createBufferSource();
                heartSource.buffer = heart.buffer;
                heartSource.loop = true;
                heartSource.connect(offlineCtx.destination);
                heartSource.start(currentTime);
                let rate;
                for(let i = 0; i < numberOfReps; i++){
                    rate = p.constrain(p.map(table.get(i*samplingRate, bioIdx), min[bioIdx], max[bioIdx], 0.5, 1.25), 0.5, 1.25);
                    if(isNaN(rate)){
                        rate = 1;
                    }
                    heartSource.playbackRate.setValueAtTime(rate, currentTime + i);
                }
                heartSource.stop(currentTime + numberOfReps);
                break;
            case 'drum':
                const kickSource = offlineCtx.createBufferSource();
                kickSource.buffer = kick.buffer;
                kickSource.loop = true;
                kickSource.connect(offlineCtx.destination);
                kickSource.start(currentTime);
                kickSource.stop(currentTime + numberOfReps);

                const numberOfPlaybacks = numberOfReps/kick.buffer.duration;
                let bpm, overallBeats, ratio;
                for(let i = 0; i < numberOfReps; i++){
                    bpm = table.get(i*samplingRate, bioIdx);
                    overallBeats = (numberOfReps * bpm)/60;
                    ratio = overallBeats/numberOfPlaybacks;
                    kickSource.playbackRate.setValueAtTime(ratio, currentTime + i);
                }
                break;
            default:
                let offlineosc = offlineCtx.createOscillator();
                offlineosc.type = sound;
                offlineosc.connect(offlineCtx.destination);
                offlineosc.start(currentTime);
                const minFreq = arrayOfFrequencies[0];
                const maxFreq = arrayOfFrequencies[arrayOfFrequencies.length - 1];
                let freq;
                for(let i = 0; i < numberOfReps; i++){
                    freq = p.constrain(p.map(table.get(i*samplingRate, bioIdx), min[bioIdx], max[bioIdx], minFreq, maxFreq), minFreq, maxFreq);
                    if(isNaN(freq)){
                        // set freq to the min freq available
                        // pretty arbitrary really
                        freq = minFreq;
                    }else{
                        freq = quantizeFrequency(freq);
                    }
                    offlineosc.frequency.setValueAtTime(freq, currentTime + i);
                }
                offlineosc.stop(currentTime + numberOfReps);
                break;
        }

        offlineCtx
            .startRendering()
            .then((renderedBuffer) => {
                encodeAndSave(renderedBuffer);
            })
            .catch((err) => {
                console.error(`Rendering failed: ${err}`);
            });
    }

    function encodeAndSave(buffer){
        // Format: THXSYEPZ_ParticipantFSonification.wav
        const recordingName = `TH${namingData.thematicID}Axis${namingData.axisID}EP${namingData.episodeID}_Participant${namingData.participant}_${sound}Sonification.wav`;
        const arrayBuffer = toWav(buffer);
        const blob = new Blob([arrayBuffer], { type: 'audio/wav'});
        const a = document.createElement('a');
        a.download = recordingName;
        a.href = URL.createObjectURL(blob);
        a.textContent = 'download the offline audio';
        document.body.appendChild(a);
        a.click();
        a.remove();
    }

    p.draw = () => {
        if(toPlay && playing == false){
            console.log('time to play!');
            playSound(sound);
        }else if(playing && toPlay == false){
            stopSound();
        }
        visualizer();
        if(playing){
            if(repNo < numberOfReps){
                if(frameNo % frameRate == 0){
                    setAudio();
                    // Increase progress bar
                    progress += percent;
                    p.setProgress(progress);
                    repNo++;
                }
                frameNo++;
            }else if(repNo == numberOfReps){
                // Do nothing pertaining to the audio, just let it play for an additional second
                // so the last value parsed by the csv can be sonified and heard.
                // After 25 frames (one sec), increase repNo and then everything will stop in draw's next iteration
                if(frameNo % frameRate == 0){
                    repNo++;
                }
                frameNo++;
            }else{
                stopSound();
                reset();
            }
        }
    }

    // Generates period for drum kick looping
    function genPeriod(){
        const bpm = parseFloat(table.get(repNo*samplingRate, 0));
        return 60/bpm;
    }

    // This is responsible for the sound produced.
    function setAudio(){
        const bioIdx = getBiosignalIdx();
        const val = parseFloat(table.get(repNo*samplingRate, bioIdx));
        switch(sound){
            case 'heart':
                // Sonifying heart rate with a heart sound.
                // The sound file continuously loops,
                // and all we must do is map the heart rate's value
                // to the range [0.5, 1.2]
                // and change the playback rate accordingly
                let rate = p.constrain(p.map(val, min[bioIdx], max[bioIdx], 0.5, 1.25), 0.5, 1.25);
                if(isNaN(rate)){
                    console.log('rate is nan');
                }else{
                    heart.rate(rate);
                }
                break;
            case 'drum':
                // Sonifying heart rate with a kick sound
                // A loop continuously runs, and on a certain time period,
                // triggers the playback of a file
                // We must then map the heart rate to this time period.
                kickLoop.interval = genPeriod();
                break;
            default:
                // GSR and Temperature sonification consists of mapping the biometric value to the oscillator frequency
                // then quantizing. The quantization levels are C Major notes accross several octaves, so that the
                // end result sounds good
                let freq;
                const minFreq = arrayOfFrequencies[0];
                const maxFreq = arrayOfFrequencies[arrayOfFrequencies.length - 1];
                freq = p.constrain(p.map(val, min[bioIdx], max[bioIdx], minFreq, maxFreq), minFreq, maxFreq);
                if(isNaN(freq)){
                    console.log('freq is nan');
                    freq = minFreq;
                }else{
                    freq = quantizeFrequency(freq);
                }
                oscillator.freq(freq, 0.1);
                break;  
        }
    }

    const downloadSound = () =>{
        offlineSonificationCreation();
        p.setDownloadRequested(false);
    }

    // This takes an arg while stopSound does not
    // This is to aid in switching sound while audio is playing
    // In that case, the props.sound value is passed rather than the current one.
    const playSound = (sound) => {
        setAudio();
        if(p.getAudioContext().state !== 'running'){
            console.log('context about to start');
            p.userStartAudio();
        }
        switch(sound){
            case 'heart':
                heartGain.amp(0.8, 0.2, 0.03);
                heart.loop(0.2);
                break;
            case 'drum':
                kickGain.amp(0.8, 0.1, 0.03);
                kickLoop.start(0.2);
                pseudoOscillator.start(0.2);
                break;
            default: 
                oscGain.amp(0.8, 0.1, 0.03);
                oscillator.start(0.2);
                break;
        }
        gainNode.amp(0.8, 0.1, 0.01);
        playing = true;
    }

    const stopSound = () => {
        switch(sound){
            case 'heart':
                heartGain.amp(0, 0.1, 0.02);
                heart.stop(0.2);
                break;
            case 'drum':
                kickGain.amp(0, 0.2, 0.03);
                kickLoop.stop(0.2);
                pseudoOscillator.stop(0.2);
                break;
            default:
                oscGain.amp(0, 0.1, 0.02);
                oscillator.stop(0.2);
                break;
        }
        gainNode.amp(0, 0.1, 0.01);
        playing = false;
    }

    const reset = () => {
        p.background('black');
        stopSound();
        frameNo = 0;
        repNo = 0;
        progress = 0;
        p.setProgress(0);
        console.log('reset done!');
        p.stopSonificationCallback();
    }

    const visualizer = () => {
        p.background('black');
        const paddingLeftRight = p.width*0.05;
        const minX = paddingLeftRight;
        const maxX = p.width - paddingLeftRight;
        const lineWidth = (maxX - minX)  / binSize;
        const minY = 10;

        const spectrum = fftObj.analyze();
        p.noStroke();
        p.fill(p.color('white'));
        for(let i = 0; i < spectrum.length; i++){
            const x = minX + i*lineWidth;
            const y = p.map(spectrum[i], 0, 255, p.height - minY, 0);
            p.rect(x, y, lineWidth - 2, p.height - y);
        }
    }
}