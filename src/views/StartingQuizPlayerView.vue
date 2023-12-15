<template>
    <header>
        <button  class="muteButton" @click="toggleMute"><img :src="buttonImage" alt="Toggle Mute" style="width: 5vw;"/></button>

    </header>
    <h2>
        {{uiLabels.city}}{{ questionNumber }}
    </h2>
    <h1>
        {{ uiLabels.whereTo }}
    </h1>
    {{data.pollId}}
    <audio ref="audioPlayer" autoplay loop>
      <source src="/img/6398985.mp3" type="audio/mp3" />
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
import avatar from '../assets/avatar.json';
const socket = io("localhost:3000");
import pressToMuteImage from "/img/6398985.png";
import pressToUnmuteImage from "/img/pressToMute.png";

export default {
    name: 'StartingQuizPlayerView',
    data: function () {
        return {
            lang: localStorage.getItem("lang") || "en",
            pollId: "",
            quizName: '',
            question: "",
            answers: ["", ""],
            questionNumber: 0,
            data: {},
            uiLabels: {},
            selectedAvatar: null,
            avatars: avatar,
            fuseWidth: 100,
            isMuted: false,
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

        socket.emit("pageLoaded", this.lang);
        socket.on("init", (labels) => {
            this.uiLabels = labels;
        });
        socket.on("dataUpdate", (data) => {
            this.questionNumber = data.currentQuestion;
            console.log(data, "Hej kom igen")
            this.data = data;
        });
        socket.on("pollCreated", (data) => {
            this.questionNumber = data.currentQuestion;
            console.log(data, "Hej kom igen")
            this.data = data;
        });
        this.startFuseTimer();
        socket.on("updateQuestionNumber", (data) => {
            this.questionNumber = data;
            console.log("hämtar info från update number", this.questionNumber)
        });
        socket.on("fullPole", (data)=> { 
                this.data = data;
                this.questionNumber = data.currentQuestion;
                console.log("this is data", data);

            });

    },
    methods: {
        handleFuseBurnout() {
            // Add logic to handle what should happen when the fuse is burned out
            console.log('The fuse is burned out!');
            clearInterval(this.fuseTimer);
            this.$router.push('/clue/' + this.pollId);            
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
        },timerInterval);
    }
}}
</script>  

<style scoped>
/*Explosion och keyframes gör inget atm, ska fixa det sen. */

.muteButton{
    width: 2vw;
    right: auto;
}

h1 {
    position: center;
    margin-top: 10vw;
}

h2 {
    position: center;
    margin-top: 10vw;
}
</style>

<style scoped>
h1 {
    position: center;
    margin-top: 10vw;
}

h2 {
    position: center;
    margin-top: 10vw;
}
</style>