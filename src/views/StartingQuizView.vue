<template>
    <header>
        <div>
        <img class="muteButton" @click="toggleMute" :src="buttonImage" alt="Toggle Mute" />
    </div>
    </header>
    <h2>
        {{ uiLabels.city }} {{ questionNumber }}/{{ Object.keys(cities).length }}
    </h2>
    <h1>
        {{ uiLabels.whereTo }}
    </h1>
    <audio ref="audioPlayer" autoplay loop>
        <source src="/img/train1.mp3" type="audio/mp3" />
        Your browser does not support the audio element.
    </audio>
    <footer>
        <div class="fuse-container">
            <img id="fuseLine" src="/img/redbar.png" :style="{ width: fuseWidth + 'vw', height: '30vw' }">
        </div>
    </footer>
</template>
  
<script>
import io from 'socket.io-client';
const socket = io(sessionStorage.getItem("localhost"));
import pressToMuteImage from "/img/soundon.png";
import pressToUnmuteImage from "/img/soundoff.png";

export default {
    name: 'StartingQuizView',
    data: function () {
        return {
            lang: localStorage.getItem("lang") || "en",
            pollId: "",
            questionNumber: 0,
            uiLabels: {},
            fuseWidth: 100,
            isMuted: false,
            yourName: "",
            cities: {}
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
        socket.emit("cityUpdate", this.pollId);
        socket.emit("pageLoaded", this.lang);
        socket.emit("getPoll", this.pollId)
        socket.emit("getCity", this.pollId);
        socket.on("init", (labels) => {
            this.uiLabels = labels;
        });
        socket.on("currentCity", (data) => {
            this.questionNumber = data;
        });
        socket.on("fullPole", (data) => {
            console.log(data);
            this.cities = data.cities;
        });
        this.startFuseTimer();
    },
    methods: {
        handleFuseBurnout() {
            // Add logic to handle what should happen when the fuse is burned out
            console.log('The fuse is burned out!');
            clearInterval(sessionStorage.getItem("fuseTimer"));
            this.$router.push('/clue/' + this.pollId + '/' + this.yourName);
        },
        toggleMute() {
            const audioPlayer = this.$refs.audioPlayer;

            // Toggle the muted attribute
            audioPlayer.muted = !audioPlayer.muted;

            this.isMuted = !this.isMuted;
        },

        startFuseTimer: function () {
            clearInterval(sessionStorage.getItem("fuseTimer"));

            // Adjust the timer interval based on your preference
            const timerInterval = 10; // 1 second
            sessionStorage.setItem("fuseTimer", setInterval(() => {
                // Decrease the fuse width by a certain percentage
                this.fuseWidth -= 0.00000001; // Adjust as needed

                // Check if the fuse is completely burned
                if (this.fuseWidth <= 0) {
                    // Handle the event when the fuse is burned out
                    this.handleFuseBurnout();
                }
            }, timerInterval));

        }
    }
}
</script>  

<style scoped>
h1 {
    position: center;
    margin-top: 10vw;
}
 /* .muteButton {
  position: absolute;
  width: 2.5vw;
  height: 2.5vw;
  padding: 0.5vw 0 0 0.5vw;
  margin-left: 45vw;
  margin-top: -8vh;
}  */

h2 {
    position: center;
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    margin-top: 10vw;
}

@media screen and (max-width: 800px) {

    h1 {
        font-size: 7.7vh;
    }

}
</style>