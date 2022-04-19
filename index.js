const audioContext = new AudioContext();

const buffer = audioContext.createBuffer(
    1,
    audioContext.sampleRate * 1,
    audioContext.sampleRate
)

console.log(audioContext.sampleRate);

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
const button = document.createElement('button');
button.innerText = "White Noise";
button.addEventListener("click", () => {
    const whiteNoiseSource = audioContext.createBufferSource();
    whiteNoiseSource.buffer = buffer;
    whiteNoiseSource.connect(primaryGainControl);
    whiteNoiseSource.start()
})
document.body.appendChild(button);

/* SNARE FILTER AND BUTTON */
const snareFilter = audioContext.createBiquadFilter();
snareFilter.type = "highpass" //experiment with different types/filters
snareFilter.frequency.value = 1500;
snareFilter.connect(primaryGainControl);

const snareButton = document.createElement("button");
snareButton.innerText = "Snare";
snareButton.addEventListener("click", () => {
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
})
document.body.appendChild(snareButton);

/* KICK BUTTON */
const kickButton = document.createElement("button");
kickButton.innerText = "Kick";
kickButton.addEventListener("click", () => {
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
})
document.body.appendChild(kickButton);

const HIHAT_URL = "https://freesound.org/people/DWSD/sounds/183105/";

const hiHatButton = document.createElement('button');
hiHatButton.innerText = "Hi Hat";
hiHatButton.addEventListener("click", async () => {
    const response = await fetch(HIHAT_URL);
    const soundBuffer = await response.arrayBuffer()
    const hihatBuffer = await audioContext.decodeAudioData(soundBuffer);

    const hiHatSource = audioContext.createBufferSource();
    hiHatSource.buffer = hihatBuffer;

    hiHatSource.connect(primaryGainControl);
    hiHatSource.start();
})
document.body.appendChild(hiHatButton);