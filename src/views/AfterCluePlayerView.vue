<template>
    <h2>
        {{uiLabels.city}}{{ questionNumber }}
    </h2>
    <h1>
        {{ uiLabels.whereTo }}
    </h1>
    {{data.pollId}}

    <div>
    </div>
</template>
  
<script>
import io from 'socket.io-client';
import avatar from '../assets/avatar.json';
const socket = io("localhost:3000");

export default {
    name: 'AfterClueView',
    data: function () {
        return {
            lang: localStorage.getItem("lang") || "en",
            pollId: "",
            quizName: '',
            cities: {},
            question: "",
            answers: ["", ""],
            questionNumber: 0,
            data: {},
            uiLabels: {},
            selectedAvatar: null,
            avatars: avatar,
            fuseWidth: 100
        }
    },
    created: function () {
        this.pollId = this.$route.params.pollId;
        socket.emit("pageLoaded", this.lang);
        socket.emit("getCity", this.pollId);
        socket.on("init", (labels) => {
            this.uiLabels = labels;
        });
        socket.on("dataUpdate", (data) => {
            this.data = data;
        });
        socket.on("pollCreated", (data) => {
            this.data = data;
        });
        socket.emit("getPoll", this.pollId);
        socket.on("currentCity", (data) => {
            this.questionNumber = data;
            this.questionNumber +=1;
            console.log("hämtar info från update number", this.questionNumber)
        });
        socket.on("updateQuestionNumber", (data) => {
            this.questionNumber = data;
            console.log("hämtar info från update number", this.questionNumber)
        });
        socket.on("fullPole", (data)=> { 
                this.data = data;
                this.questionNumber = data.currentQuestion;
                this.cities = data.cities;
                console.log("här kommer våra städer", this.cities)

            });
            socket.on("creatorClicked", (pollId) => {
            console.log("CREATORCLICKED THE BUTTON", this.pollId)
            this.$router.push('/clue/' + this.pollId);
        });

    },
    methods: {
        handleFuseBurnout() {
            // Add logic to handle what should happen when the fuse is burned out
            console.log('The fuse is burned out!');
            socket.emit("cityUpdate", this.pollId);
            socket.emit("creatorClick", this.pollId);
            clearInterval(this.fuseTimer);
                this.$router.push('/clue/' + this.pollId); 


        },
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
