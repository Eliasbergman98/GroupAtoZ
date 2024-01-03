<template>
    <div v-if="nextCity">
        <h2>
            {{ uiLabels.city }} {{ questionNumber }}/{{ Object.keys(cities).length }}
        </h2>
        <h1>
            {{ uiLabels.whereTo }}
        </h1>
    </div>
    <div v-else>
        <score-board-component :uiLabels="uiLabels" :participants="participants" :cities="cities"
            :questionNumber="questionNumber"></score-board-component>
    </div>
    <img src="" alt="">
    <div v-if="creator && !nextCity">
        <button id="nextcitybutton" v-on:click="movingToNextCity"> {{ uiLabels.nextCity }} </button>
    </div>
    <footer v-if="nextCity">
        <div class="fuse-container">
            <img id="fuseLine" src="/img/redbar1.png" :style="{ width: fuseWidth + 'vw', height: '15vw' }">
        </div>
    </footer>
</template>
  
<script>
import io from 'socket.io-client';
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
            fuseWidth: 98,
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
        // socket.on("dataUpdate", (data) => {
        //     this.data = data;
        // });
        socket.emit("getPoll", this.pollId);
        socket.on("currentCity", (data) => {
            this.questionNumber = data;
            console.log("hämtar info från update number i currentcity", this.questionNumber)
        });
        socket.on("fullPole", (data) => {
            this.data = data;
            this.questionNumber = data.currentQuestion;
            this.cities = data.cities;
            this.quizName = data.quizName;
            this.participants = data.participants;
            this.checkIfCreator();
            this.nextQuestion();
            this.playerWithMostPoints();
            clearInterval(sessionStorage.getItem("fuseTimer"));
        });
        socket.on("creatorClicked", (data) => {
            this.nextCity = true;
            this.startFuseTimer();
            console.log("CREATORCLICKED THE BUTTON", this.pollId)
        });
    },
    methods: {
        movingToNextCity() {
            clearInterval(sessionStorage.getItem("fuseTimer"));
            this.nextCity = true;
            socket.emit("creatorClick", this.pollId);
            socket.emit("cityUpdate", this.pollId);
            this.startFuseTimer();
        },
        handleFuseBurnout() {
            // Add logic to handle what should happen when the fuse is burned out
            console.log('The fuse is burned out!');
            this.$router.push('/clue/' + this.pollId + '/' + this.yourName);
            clearInterval(sessionStorage.getItem("fuseTimer"));
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
            clearInterval(sessionStorage.getItem("fuseTimer"));

            // Adjust the timer interval based on your preference
            const timerInterval = 10; // 1 second

            sessionStorage.setItem("fuseTimer", setInterval(() => {
                // Decrease the fuse width by a certain percentage
                this.fuseWidth -= 0.2; // Adjust as needed

                // Check if the fuse is completely burned
                if (this.fuseWidth <= 0) {
                    // Handle the event when the fuse is burned out
                    this.handleFuseBurnout();
                }
            }, timerInterval) );
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
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    margin-top: 10vw;
}

#nextcitybutton {
margin-left: 35vw;
background-color: green;
}
@media screen and (max-width:800px) {
    h1 {
        margin-top: 20VW;
        font-size: 7.7vh;
    }

}
</style>
