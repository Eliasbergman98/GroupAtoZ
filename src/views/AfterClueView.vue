<template>
    <h2>
        {{uiLabels.city}}{{ questionNumber }}
    </h2>
    <h1>
        {{ uiLabels.whereTo }}
    </h1>
    {{data.pollId}}

    <div>
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
        
        socket.emit("cityUpdate", this.pollId);
        socket.on("updateQuestionNumber", (data) => {
            this.questionNumber = data;
            console.log("hämtar info från update number", this.questionNumber)
        });
        socket.on("fullPole", (data)=> { 
                this.data = data;
                
                this.cities = data.cities;
                console.log("här kommer våra städer", this.cities)

            });

    },
    methods: {
        handleFuseBurnout() {
            // Add logic to handle what should happen when the fuse is burned out
            console.log('The fuse is burned out!');
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
