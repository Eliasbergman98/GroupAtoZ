<template>
    <header>
        <img class="muteButton" @click="toggleMute" :src="buttonImage" alt="Toggle Mute" />
    </header>
    <h2>
        {{ uiLabels.city }}{{ questionNumber }}
    </h2>
    <div> {{ yourName }}</div>
    <h1>
        {{ uiLabels.whereTo }}
    </h1>
    {{ data.pollId }}
    <audio ref="audioPlayer" autoplay loop>
        <source src="/img/train1.mp3" type="audio/mp3" />
        Your browser does not support the audio element.
    </audio>

    <footer>
        <div class="fuse-container">
            <img id="fuseLine" src="/img/test1.png" :style="{ width: fuseWidth + 'vw', height: '10vw' }">
        </div>
    </footer>
</template>
  
<script>
import io from 'socket.io-client';
//import avatar from '../assets/avatar.json';
const socket = io(sessionStorage.getItem("localhost"));
import pressToMuteImage from "/img/soundon.png";
import pressToUnmuteImage from "/img/soundoff.png";

export default {
    name: 'StartingQuizPlayerView',
    data: function () {
        return {
            lang: localStorage.getItem("lang") || "en",
            pollId: "",
            questionNumber: 0,
            data: {},
            uiLabels: {},
            fuseWidth: 100,
            isMuted: false,
            yourName: ""
        }
    },
    computed: {
        // Compute the image source based on the button state
        buttonImage() {
            return this.isMuted ? pressToMuteImage : pressToUnmuteImage;
        }
    },
    created: function () {
        this.pollId = this.$route.params.pollId;
        this.yourName = this.$route.params.yourName;
        socket.emit("pageLoaded", this.lang);
        socket.emit("getCity", this.pollId)
        socket.on("init", (labels) => {
            this.uiLabels = labels;
        });
        socket.emit("joinPoll", this.pollId);
        socket.on("dataUpdate", (data) => {
            console.log(data, "Hej kom igen dataUpdate")
            this.data = data;
        });
        // socket.on("pollCreated", (data) => {
        //     console.log(data, "Hej kom igen pollcreated")
        //     this.data = data;
        // });
        this.startFuseTimer();
        socket.on("currentCity", (data) => {
            this.questionNumber = data;
            console.log("hämtar info från update number i currentcity ", this.questionNumber)
        });
        // socket.on("fullPole", (data) => {
        //     this.data = data;
        //     console.log("this is data ifrån fullPole", data);
        // });
        // socket.on("thisPlayer", (data) => {
        //     this.yourName = data;
        //     console.log(this.yourName, "Hej kom igen thisPlayer lyssnaren")
        // });

    },
    methods: {
        handleFuseBurnout() {
            // Add logic to handle what should happen when the fuse is burned out
            console.log('The fuse is burned out!');
            clearInterval(this.fuseTimer);
            this.$router.push('/clue/' + this.pollId + '/' + this.yourName);
        },
        toggleMute() {
            const audioPlayer = this.$refs.audioPlayer;
            // Toggle the muted attribute
            audioPlayer.muted = !audioPlayer.muted;
            this.isMuted = !this.isMuted;
        },

        startFuseTimer: function () {
            clearInterval(this.fuseTimer);
            // Adjust the timer interval based on your preference
            const timerInterval = 10; // 1 second

            this.fuseTimer = setInterval(() => {

                // Decrease the fuse width by a certain percentage
                this.fuseWidth -= 0.1; // Adjust as needed

                // Check if the fuse is completely burned
                if (this.fuseWidth <= 0) {
                    // Handle the event when the fuse is burned out
                    this.handleFuseBurnout();
                }
            }, timerInterval);
        }
    }
}
</script>  

<style scoped>
/*Explosion och keyframes gör inget atm, ska fixa det sen. */


h1 {
    position: center;
    margin-top: 10vw;
}

h2 {
    position: center;
    margin-top: 10vw;
}

@media screen and (max-width:800px) {
    h1 {
        position: center;
        margin-top: 10vw;
    }

    h2 {
        position: center;
        margin-top: 10vw;
    }
}
</style>