import '../p5.sound.min.js'
import '../p5.dom.min.js'
import '../p5.js'
import * as P5Class from "p5"

export function sketch(p){
    let toPlay, playing = false, setUpComplete = false;
    let biosignal;
    let sound;
    let table;
    let filePath;
    p.updateWithProps = props => {
        if(props.biosignal){
            const old_biosignal = biosignal;
            if(old_biosignal !== props.biosignal){
                biosignal = props.biosignal;
            }
        }
        if(props.hasEnded){
            p.hasEnded = props.hasEnded;
        }
        if(props.toPlay !== undefined){
            toPlay = props.toPlay;
        }
        if(props.sound){
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
    }

    let progress = 0;
    // We want the progress bar to move a certain amount every rep.
    // Here we fine how much it has to move per rep.
    let percent;
    const findProgressPercent = () => {
        percent =  100/numberOfReps;
    }    

    let min, max, numberOfReps, repNo = 0;
    const samplingRate = 128;
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
            case 'GSR':
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
        kick = p.loadSound(`http://localhost/data/assets/TR-909Kick.mp3`);
    }

    const frameRate = 25;
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

    p.setup = () => {
        p.getAudioContext().suspend();

        p.createCanvas(200, 200);
        p.background('black');
        p.setFrameRate(frameRate);

        initArrayOfFreq();
        oscillator = new P5Class.Oscillator();
        oscillator.freq(220);
        oscillator.amp(0.2);

        kickLoop = new P5Class.SoundLoop(() => {
            kick.play(); 
        }, genPeriod());

        kickLoop.bpm = 0;
        pseudoOscillator = new P5Class.Oscillator('sine');
        pseudoOscillator.freq(5);
        pseudoOscillator.amp(0.01);

        setUpComplete = true;
    }

    p.draw = () => {
        if(toPlay && playing == false){
            playSound();
        }else if(playing && toPlay == false){
            stopSound();
        }
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
                const rate = p.constrain(p.map(val, min[bioIdx], max[bioIdx], 0.5, 1.25), 0.5, 1.25);
                heart.rate(rate);
                break;
            case 'drum':
                // Sonifying heart rate with a kick sound
                // A loop continuously runs, and on a certain time period,
                // triggers the playback of a file
                // We must then map the heart rate to this time period.
                kickLoop.interval = genPeriod();
                // In case we're recording, we also export MIDI
                // If interval changes, tempo changes
                // if(isRecording){
                //     console.log(parseInt(table.get(repNo*samplingRate, 0)));
                //     recordingTrack.setTempo(parseInt(table.get(repNo*samplingRate, 0)));
                // }
                break;
            default:
                // GSR and Temperature sonification consists of mapping the biometric value to the oscillator frequency
                // then quantizing. The quantization levels are C Major notes accross several octaves, so that the
                // end result sounds good
                let freq;
                const minFreq = arrayOfFrequencies[0];
                const maxFreq = arrayOfFrequencies[arrayOfFrequencies.length - 1];
                freq = p.constrain(p.map(val, min[bioIdx], max[bioIdx], minFreq, maxFreq), minFreq, maxFreq);
                freq = quantizeFrequency(freq);
                oscillator.freq(freq, 0.1);
                break;  
        }
    }

    const playSound = () => {
        p.getAudioContext().resume();
        switch(sound){
            case 'heart':
                heart.loop();
                break;
            case 'drum':
                kickLoop.start();
                pseudoOscillator.start();
                break;
            default: 
                oscillator.start();
                break;
        }
        playing = true;
    }

    const stopSound = () => {
        p.getAudioContext().suspend();
        console.log('hi! time to stop sound');
        switch(sound){
            case 'heart':
                heart.stop();
                break;
            case 'drum':
                kickLoop.stop();
                pseudoOscillator.stop();
                break;
            default:
                oscillator.stop();
                break;
        }
        playing = false;
    }

    const reset = () => {
        stopSound();
        frameNo = 0;
        repNo = 0;
        progress = 0;
        p.setProgress(0);
        console.log('reset done!');
        p.hasEnded();
    }
}