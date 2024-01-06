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
    <div v-else-if="!creator && !nextCity" id="waiting-next-city">
        {{ uiLabels.waitingNextCity }}</div>
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
            gameId: "",
            quizName: '',
            cities: {},
            questionNumber: 0,
            uiLabels: {},
            fuseWidth: 98,
            yourName: "",
            creator: false,
            participants: [],
            nextCity: false,
        }
    },
    created: function () {
        this.gameId = this.$route.params.gameId;
        this.yourName = this.$route.params.yourName;
        socket.emit("pageLoaded", this.lang);
        socket.emit("joinGame", this.gameId);
        socket.on("init", (labels) => {
            this.uiLabels = labels;
        });
        socket.emit("getGame", this.gameId);
        socket.on("fullGame", (data) => {
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
        });
    },
    methods: {
        movingToNextCity() {
            clearInterval(sessionStorage.getItem("fuseTimer"));
            this.nextCity = true;
            socket.emit("creatorClick", this.gameId);
            socket.emit("cityUpdate", this.gameId);
            this.startFuseTimer();
        },
        handleFuseBurnout() {
            // Add logic to handle what should happen when the fuse is burned out
            console.log('The fuse is burned out!');
            this.$router.push('/clue/' + this.gameId + '/' + this.yourName);
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

h2 {
    position: center;
    margin-top: 10vw;
}

#nextcitybutton {
    margin-left: 35vw;
    background-color: green;
}

#waiting-next-city {
    font-size: 3vw;
    font-weight: bold;
}

@media screen and (max-width:900px) {
    h1 {
        margin-top: 20VW;
        font-size: 7.7vh;
    }
    #nextcitybutton {
        margin-left: 60vw;
        font-size: 7vw;
        color: white;
        border: 2px solid black;
        padding: 3vw;
        margin: 5vw;
    }
}

</style>
