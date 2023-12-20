<template>
    <div v-if="nextCity">
        <h2>
            {{ uiLabels.city }}{{ questionNumber }}
        </h2>
        <h1>
            {{ uiLabels.whereTo }}
        </h1>
    </div>
    <div v-else>
        <score-board-component :uiLabels="uiLabels" :nextCity="nextCity"
            :participants="participants"></score-board-component>
    </div>
    <img src="" alt="">
    <div v-if="creator && !nextCity">
        <button id="nextcitybutton" v-on:click="movingToNextCity"> {{uiLabels.nextCity}} </button>
    </div>
    <footer v-if="nextCity">
        <div class="fuse-container">
            <img id="fuseLine" src="/img/test1.png" :style="{ width: fuseWidth + 'vw', height: '10vw' }">
        </div>
    </footer>
</template>
  
<script>
import io from 'socket.io-client';
import avatar from '../assets/avatar.json';
const socket = io(sessionStorage.getItem("localhost"));
import ScoreBoardComponent from '@/components/ScoreBoardComponent.vue';

export default {
    name: 'AfterClueView',
    components: {
        ScoreBoardComponent,
    },
    data: function () {
        return {
            lang: localStorage.getItem("lang") || "en",
            pollId: "",
            quizName: '',
            cities: {},
            questionNumber: 0,
            data: {},
            uiLabels: {},
            selectedAvatar: null,
            avatars: avatar,
            fuseWidth: 100,
            yourName: "",
            creator: false,
            participants: [],
            nextCity: false,
        }
    },
    created: function () {
        this.pollId = this.$route.params.pollId;
        this.yourName = this.$route.params.yourName;
        socket.emit("pageLoaded", this.lang);
        socket.emit("joinPoll", this.pollId);
        socket.emit("getCity", this.pollId);
        socket.on("init", (labels) => {
            this.uiLabels = labels;
        });
        socket.on("dataUpdate", (data) => {
            this.data = data;
        });
        // socket.on("pollCreated", (data) => {
        //     this.data = data;
        //     console.log("hello in pollcreated")
        // });
        socket.emit("getPoll", this.pollId);
        socket.on("currentCity", (data) => {
            this.questionNumber = data;
            console.log("hämtar info från update number i currentcity", this.questionNumber)
        });
        // socket.on("updateQuestionNumber", (data) => {
        //     this.questionNumber = data;
        //     console.log("hämtar info från update number i updatequestionNumber", this.questionNumber)
        // });
        socket.on("fullPole", (data) => {
            this.data = data;
            this.questionNumber = data.currentQuestion;
            this.cities = data.cities;
            this.quizName = data.quizName;
            this.participants = data.participants;
            this.checkIfCreator();
            this.nextQuestion();
            this.playerWithMostPoints();
        });
        socket.on("creatorClicked", (data) => {
            this.nextCity = true;
            this.startFuseTimer();
            console.log("CREATORCLICKED THE BUTTON", this.pollId)
        });
    },
    methods: {
        movingToNextCity() {
            clearInterval(this.fuseTimer);
            this.nextCity = true;
            socket.emit("creatorClick", this.pollId);
            socket.emit("cityUpdate", this.pollId);
            this.startFuseTimer();
        },
        handleFuseBurnout() {
            // Add logic to handle what should happen when the fuse is burned out
            console.log('The fuse is burned out!');
            this.$router.push('/clue/' + this.pollId + '/' + this.yourName);
            clearInterval(this.fuseTimer);
        },
        checkIfCreator() {
            if (this.yourName === this.quizName) {
                this.creator = true;
            }
        },
        nextQuestion() {
            this.questionNumber += 1
        },
        playerWithMostPoints() {
            this.participants.sort((a, b) => b.points - a.points);
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
</style>
