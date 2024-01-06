<template>
    <header>
        <img class="muteButton" @click="toggleMute" :src="buttonImage" alt="Toggle Mute" />
    </header>
    <div class="titelClass">
        <h2>
            {{ uiLabels.city }} {{ questionNumber }}/{{ Object.keys(cities).length }}
        </h2>
        <h1>
            {{ uiLabels.whereTo }}
        </h1>
    </div>
    <audio ref="audioPlayer" autoplay loop>
        <source src="/img/train1.mp3" type="audio/mp3" />
        Your browser does not support the audio element.
    </audio>
    <footer>
        <div class="fuse-container">
            <img id="fuseLine" src="/img/redbar1.png" :style="{ width: fuseWidth + 'vw', height: '15vw' }">
        </div>
    </footer>
</template>
  
<script>
import io from 'socket.io-client';
const socket = io(sessionStorage.getItem("localhost"));
import pressToMuteImage from "/img/soundon.png";
import pressToUnmuteImage from "/img/soundoff.png";

export default {
    name: 'StartingQuizPlayerView',
    data: function () {
        return {
            lang: localStorage.getItem("lang") || "en",
            gameId: "",
            questionNumber: 0,
            uiLabels: {},
            fuseWidth: 98,
            isMuted: false,
            yourName: "",
            cities: {}
        }
    },
    computed: {
        buttonImage() {
            return this.isMuted ? pressToUnmuteImage : pressToMuteImage; 
        }
    },
    created: function () {
        this.gameId = this.$route.params.gameId;
        this.yourName = this.$route.params.yourName;
        socket.on("init", (labels) => {
            this.uiLabels = labels;
        });
        socket.emit("joinGame", this.gameId);
        this.startFuseTimer();
        socket.on("currentCity", (data) => {
            this.questionNumber = data;
        });
        socket.on("fullGame", (data) => {
            this.cities = data.cities;
        });
        socket.emit("pageLoaded", this.lang);
        socket.emit("getCity", this.gameId);
        socket.emit("getGame", this.gameId);
    },
    methods: {
        handleFuseBurnout() {
            // Add logic to handle what should happen when the fuse is burned out
            console.log('The fuse is burned out!');
            clearInterval(sessionStorage.getItem("fuseTimer"));
            this.$router.push('/clue/' + this.gameId + '/' + this.yourName);
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
                this.fuseWidth -= 0.1; // Adjust as needed
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
.titelClass {
    margin-top: 5vw;
}

.muteButton {
    position: relative;
    width: 2.5vw;
    height: 2.5vw;
    padding: 0.5vw 0 0 0.5vw;
    margin-left: 92vw;

}

h1 {
    position: center;
    /* margin-top: 10vw; */
}

h2 {
    position: center;
}

@media screen and (max-width:800px) {
    h1 {
        margin-top: 20VW;
        font-size: 7.7vh;
    }

    .muteButton {
        position: absolute;
        width: 4vw;
        height: 4vw;
        padding: 0.5vw 0 0 0.5vw;
        margin-left: 42vw;
        margin-top: -2vw;
    }

}
</style>