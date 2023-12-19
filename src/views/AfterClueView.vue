<template>
    <h2>
        {{ uiLabels.city }}{{ questionNumber }}
    </h2>
    <h1>
        {{ uiLabels.whereTo }}
    </h1>
    {{ participants }}
    <img src="" alt="">
    <div v-if="creator">
        <button v-on:click="handleFuseBurnout"> </button>
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
            questionNumber: 0,
            data: {},
            uiLabels: {},
            selectedAvatar: null,
            avatars: avatar,
            fuseWidth: 100,
            yourName: "",
            creator: false,
            participants: [] 
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
            console.log("CREATORCLICKED THE BUTTON", this.pollId)
            this.$router.push('/clue/' + this.pollId + '/' + this.yourName);
        });
    },
    methods: {
        handleFuseBurnout() {
            // Add logic to handle what should happen when the fuse is burned out
            console.log('The fuse is burned out!');
            socket.emit("cityUpdate", this.pollId);
            socket.emit("creatorClick", this.pollId);
            clearInterval(this.fuseTimer);
        },
        checkIfCreator() {
            if (this.yourName === this.quizName) {
                this.creator = true;
            }
        },
        nextQuestion() {
            this.questionNumber +=1
        },
        playerWithMostPoints(){
    //         let participantWithHighestPoint = this.participants[0];
    //         for (let i = 1; i < this.participants.length; i++) {
    //             const currentParticipant = this.participants[i];

    //             if(currentParticipant.points > participantWithHighestPoint.points){
    //                 participantWithHighestPoint = currentParticipant;
    //             }
        
    //   }
      //console.log("Detta är spelaren med högst poäng: ", participantWithHighestPoint )
      this.participants.sort((a, b) => b.points - a.points);
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
