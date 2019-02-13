const sounds = {
    97: "clap-808",
    115: "clap-analog",
    100: "clap-crushed",
    102: "clap-fat",
    103: "clap-slapper",
    104: "clap-tape",
    105: "cowbell-808",
    106: "crash-808"
}

const channels = [[],[],[],[]];
let currentChannel = 0;
let isRecording = false;
let recStartTime;

document.addEventListener('DOMContentLoaded', appStart);

function appStart() { //enable buttons
    window.addEventListener('keypress', playSound);
    document.querySelector('#recordBtn').addEventListener('click', recordEvent);
    document.querySelector('#playBtn').addEventListener('click', ()=> {
        // console.log(currentChannel);
        playRecording(channels[currentChannel]);
    });
    document.querySelector('#playAllBtn').addEventListener('click', playAllRecordings);
    document.querySelectorAll('.channel').forEach(radio => {
        radio.addEventListener('change', ()=> {
            currentChannel = parseInt(radio.getAttribute("value")-1);
        });
    });
}

function recordEvent() {
    //switch to recording/not recording
    isRecording = !isRecording;
    
    const recordBtn = document.querySelector('#recordBtn');

    if (isRecording) { //start recording
        //clear previous record on current channel
        channels[currentChannel] = [];
        //display stop rec btn text
        recordBtn.textContent = "Stop recording";
        //save the starting time
        recStartTime = Date.now();

    } else { //stop recording
        //display start rec btn text
        recordBtn.textContent = "Start recording";
        if (!isChannelEmpty(channels[currentChannel])) {
            calculateInterval(channels[currentChannel]);
        }
    }
}

function playRecording(channel) {
    //to do --play each channel t the same time
    console.log(channel);

    if (!isChannelEmpty(channel)) {
        let i = 0; //loop iteration count
        const max = channel.length; //loop max literation count
    
        function timeout() {
            setTimeout(() => { 
                //play the sound
                channel[i].element.currentTime = 0;
                channel[i].element.play();
                i++;
    
                if (i >= max) {
                    return;
                }
    
                timeout(); //recursion
    
            }, channel[i].time);
        }
        timeout();
    }
}
function playAllRecordings() {
    channels.forEach((channel, i) => {
        playRecording(channels[i]);
    });
}

function playSound(e) {

    const audioName = sounds[e.charCode]; // load sound code
    if (!audioName) {
        //ignore if user pressed an unbinded key
        return;
    }
    audioDOM = document.querySelector(`#${audioName}`); // get DOM audio element
    audioDOM.currentTime = 0;
    audioDOM.play();

    if (isRecording) {
        channels[currentChannel].push({ //saving data to a channel
            element: audioDOM,
            time: Date.now()
        });
    }
}

function calculateInterval(channel) {
    //calculate time interval between two sounds
    for (let i = channel.length - 1; i > 0; i--) {
        channel[i].time -= channel[i - 1].time;
    }
    channel[0].time -= recStartTime;
}


function isChannelEmpty(channel) {
    return (!channel.length);
}

//add 3,2,1 counting making a delay from pressing recording to starting recording