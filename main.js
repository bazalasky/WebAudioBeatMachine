const audioContext = new AudioContext();

const buffer = audioContext.createBuffer(
    1,
    audioContext.sampleRate * 1,
    audioContext.sampleRate
)

let whiteNoiseButton = document.getElementById('white-noise'),
snareButton = document.getElementById('snare'),
kickButton = document.getElementById('kick'),
hiHatButton = document.getElementById('hi-hat'),
middleCButton = document.getElementById('middle-c-key'),
cSharpButton = document.getElementById('c-sharp-key'),
dButton = document.getElementById('d-key'),
dSharpButton = document.getElementById('d-sharp-key'),
eButton = document.getElementById('e-key'),
fButton = document.getElementById('f-key'),
fSharpButton = document.getElementById('f-sharp-key'),
gButton = document.getElementById('g-key'),
gSharpButton = document.getElementById('g-sharp-key'),
aButton = document.getElementById('a-key'),
aSharpButton = document.getElementById('a-sharp-key'),
bButton = document.getElementById('b-key'),
highCButton = document.getElementById('high-c-key');

const channelData = buffer.getChannelData(0);

for (let i = 0; i < buffer.length; i++) {
    channelData[i] = Math.random() * 2 - 1;
}

// gain node lets us control the volume
/* connect all audio nodes to gain node and connect gain node to destination node 
   so that we can control volume of all audio nodes */
const primaryGainControl = audioContext.createGain();
primaryGainControl.gain.setValueAtTime(0.05, 0);
primaryGainControl.connect(audioContext.destination);

/* WHITE NOISE BUTTON */
whiteNoiseButton.addEventListener("click", () => {
    whiteNoiseButton.style.boxShadow = 'none'
    const whiteNoiseSource = audioContext.createBufferSource();
    whiteNoiseSource.buffer = buffer;
    whiteNoiseSource.connect(primaryGainControl);
    whiteNoiseSource.start()
    var shadow = '0 8px 16px 0 rgba(218, 16, 16, 0.568), 0 6px 20px 0 rgba(0,0,0,0.19)';
    setTimeout(function() {
        whiteNoiseButton.style.boxShadow = shadow;
    }, 1000);
})

document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowUp') {
        whiteNoiseButton.click();
    }
    else if (e.key === 'ArrowLeft') {
        snareButton.click();
    }
    else if (e.key === 'ArrowDown') {
        kickButton.click();
    }
    else if (e.key === 'ArrowRight') {
        hiHatButton.click();
    }
    else if (e.key === 'q') {
        middleCButton.click();
    }
    else if (e.key === '2') {
        cSharpButton.click();
    }
    else if (e.key === 'w') {
        dButton.click();
    }
    else if (e.key === '3') {
        dSharpButton.click();
    }
    else if (e.key === 'e') {
        eButton.click();
    }
    else if (e.key === 'r') {
        fButton.click();
    }
    else if (e.key === '5') {
        fSharpButton.click();
    }
    else if (e.key === 't') {
        gButton.click();
    }
    else if (e.key === '6') {
        gSharpButton.click();
    }
    else if (e.key === 'y') {
        aButton.click();
    }
    else if (e.key === '7') {
        aSharpButton.click();
    }
    else if (e.key === 'u') {
        bButton.click();
    }
    else if (e.key === 'i') {
        highCButton.click();
    }
    else {
        void(0);
    }
})

/* SNARE FILTER AND BUTTON */
const snareFilter = audioContext.createBiquadFilter();
snareFilter.type = "highpass" //experiment with different types/filters
snareFilter.frequency.value = 1500;
snareFilter.connect(primaryGainControl);

snareButton.addEventListener("click", () => {
    snareButton.style.boxShadow = 'none';
    const whiteNoiseSource = audioContext.createBufferSource();
    whiteNoiseSource.buffer = buffer;

    const whiteNoiseGain = audioContext.createGain();
    whiteNoiseGain.gain.setValueAtTime(1, audioContext.currentTime);
    whiteNoiseGain.gain.exponentialRampToValueAtTime(
        0.01, 
        audioContext.currentTime + 0.2
    );
    whiteNoiseSource.connect(whiteNoiseGain);
    whiteNoiseGain.connect(snareFilter);

    whiteNoiseSource.start()
    whiteNoiseSource.stop(audioContext.currentTime + 0.2);

    const snareOscillator = audioContext.createOscillator();
    snareOscillator.type = "triangle";
    snareOscillator.frequency.setValueAtTime(100, audioContext.currentTime); // change snare pitch

    const oscillatorGain = audioContext.createGain();
    oscillatorGain.gain.setValueAtTime(0.7, audioContext.currentTime); 
    oscillatorGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    snareOscillator.connect(oscillatorGain);
    oscillatorGain.connect(primaryGainControl);
    snareOscillator.start();
    snareOscillator.stop(audioContext.currentTime + 0.2);
    var shadow = '0 8px 16px 0 rgba(218, 16, 16, 0.568), 0 6px 20px 0 rgba(0,0,0,0.19)';
    setTimeout(function() {
        snareButton.style.boxShadow = shadow;
    }, 500);
})

/* KICK BUTTON */
kickButton.addEventListener("click", () => {
    kickButton.style.boxShadow = 'none';
    const kickOscillator = audioContext.createOscillator();

    kickOscillator.frequency.setValueAtTime(150, 0); //frequency of middle C 261.6
    //pitch frequency down all the way to almost 0 exponentially to give it that kick drum sound
    kickOscillator.frequency.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.5
    )

    //fade out the gain on the kick drum the same way we did the frequency
    const kickGain = audioContext.createGain();
    kickGain.gain.setValueAtTime(1, 0);
    kickGain.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.5
    )

    kickOscillator.connect(kickGain);
    kickOscillator.connect(primaryGainControl);
    kickOscillator.start();
    kickOscillator.stop(audioContext.currentTime + 0.5);
    var shadow = '0 8px 16px 0 rgba(218, 16, 16, 0.568), 0 6px 20px 0 rgba(0,0,0,0.19)';
    setTimeout(function() {
        kickButton.style.boxShadow = shadow;
    }, 500);
})

/* HI HAT BUTTON */
hiHatButton.addEventListener("click", async () => {
    hiHatButton.style.boxShadow = 'none';
    sampleloader('samples/samples_hihat.wav', audioContext, function(buffer) {
        var hihat = new HiHat(audioContext, buffer);
        hihat.trigger(audioContext.currentTime);
    });
    var shadow = '0 8px 16px 0 rgba(218, 16, 16, 0.568), 0 6px 20px 0 rgba(0,0,0,0.19)';
    setTimeout(function() {
        hiHatButton.style.boxShadow = shadow;
    }, 500);
})

// create hi hat object
function HiHat(audioContext, buffer) {
    this.audioContext = audioContext;
    this.buffer = buffer;
}

HiHat.prototype.setup = function() {
    this.source = this.audioContext.createBufferSource();
    this.source.buffer = this.buffer;
    this.source.connect(this.audioContext.destination);
};

// this is what plays the sound 
HiHat.prototype.trigger = function(time) {
    this.setup();

    this.source.start(time);
}

/* This function takes a URL of a sound file and makes an asynchronous GET request for it 
using XMLHttpRequest. When the data is loaded, the call to context.decodeAudioData turns 
the audio file into a buffer of samples, and triggers a callback */
var sampleloader = function(url, audioContext, callback) {
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    request.onload = function() {
        audioContext.decodeAudioData(request.response, function(buffer) {
            callback(buffer);
        });
    };

    request.send();
};


const notes = [
    { name: "middle-c-key", frequency: 261.63 },
    { name: "c-sharp-key", frequency: 277.18 },
    { name: "d-key", frequency: 293.66 },
    { name: "d-sharp-key", frequency: 311.13 },
    { name: "e-key", frequency: 329.63 },
    { name: "f-key", frequency: 349.23 },
    { name: "f-sharp-key", frequency: 369.99 },
    { name: "g-key", frequency: 392.0 },
    { name: "g-sharp-key", frequency: 415.3 },
    { name: "a-key", frequency: 440.0 },
    { name: "a-sharp-key", frequency: 466.16 },
    { name: "b-key", frequency: 493.88 },
    { name: "high-c-key", frequency: 523.25 },
];

notes.forEach(({ name, frequency}) => {
    noteButton = document.getElementById(name);
    noteButton.addEventListener("click", () => {
        const noteOscillator = audioContext.createOscillator();
        noteOscillator.type = "square";
        noteOscillator.frequency.setValueAtTime(
            frequency,
            audioContext.currentTime
        );

            const vibrato = audioContext.createOscillator();
            vibrato.frequency.setValueAtTime(10, 0); // frequency
            const vibratoGain = audioContext.createGain();
            vibratoGain.gain.setValueAtTime(1.5, 0); // difference in frequency
            vibrato.connect(noteOscillator.frequency);
            vibrato.start();

            // want to figure out how to make it so the time at sustainLevel is controlled by how long the button is pressed
            const attackTime = 0.2;
            const decayTime = 0.3;
            const sustainLevel = 0.7;
            const releaseTime = 0.2;

            const now = audioContext.currentTime;
            const noteGain = audioContext.createGain();
            noteGain.gain.setValueAtTime(0,0);
            noteGain.gain.linearRampToValueAtTime(1, now + attackTime);
            noteGain.gain.linearRampToValueAtTime(sustainLevel, now + attackTime + decayTime);
            noteGain.gain.setValueAtTime(sustainLevel, now + 1 - releaseTime);
            noteGain.gain.linearRampToValueAtTime(0, now + 1);


        noteOscillator.connect(noteGain);
        noteGain.connect(primaryGainControl);
        noteOscillator.start();
        noteOscillator.stop(audioContext.currentTime + 1)
    })
})


