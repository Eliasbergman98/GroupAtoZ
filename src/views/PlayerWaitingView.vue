<template>
    <h1>
        {{ data.quizName }}
    </h1>
    <h2>WAITING FOR HOST TO START GAME...</h2>
    <div class="poll">
        <div class="a">
            <div class="participants" v-for="person in participants" :key="participants.name" :style="getPositionStyle()">
                {{ person.name }} <img class="emojies" v-bind:src="person.avatar" target="_blank" width="32" height="32">
            </div>
            <section class="button-container">
                <button id="gameIDbutton">{{ uiLabels.gameTag }} {{ pollId }}</button>
                <router-link to="//"><button id="exitGamebutton">{{ uiLabels.exitGame }}</button></router-link>
                <button id="playerJoinedbutton">{{ participants.length }} {{ uiLabels.participantCount }} </button>
            </section>
        </div>
    </div>
</template>
  
<script>
import io from 'socket.io-client';
import avatar from '../assets/avatar.json';
const socket = io("localhost:3000");

export default {
    name: 'PlayerWaitingView',
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
            participants: []
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
        socket.emit("joinPoll", this.pollId);
        socket.emit("getPoll", this.pollId);
        socket.on("fullPole", (data) => {
            console.log("in joiningview", this.pollId)
            this.data = data;
        });
        socket.on("participantsUpdate", (participants) => {
            this.participants = participants,
                console.log("hej här kommer nya joinare", this.participants)
        });

        socket.on("creatorStarting", (pollId) => {
            this.$router.push('/startingquiz/' + this.pollId);
        });

    },
    methods: {
        getPositionStyle() {
            const position = {
                bottom: `${Math.random() * 30 + 40}%`, // Adjust the bottom position between 40% and 60%
                top: `${Math.random() * 30 + 40}%`,    // Adjust the top position between 40% and 60%
                left: `${Math.random() * 30 + 40}%`,   // Adjust the left position between 40% and 60%
                right: `${Math.random() * 30 + 40}%`,  // Adjust the right position between 40% and 60%
            };

            return position;
        }
    }
}
</script>  

<style scoped>
h1 {
    position: center;
}

h2 {
    margin-top: -3vw;
    position: center;
    font-family: Courier, Trebuchet MS, Verdana, Geneva, Tahoma, sans-serif;
    text-transform: uppercase;
    font-size: 3vw;
    /*font-style: italic;*/
    color: green;
    text-shadow:
        -0.075vw -0.075vw 0 #000,
        0.075vw -0.075vw 0 #000,
        -0.075vw 0.075vw 0 #000,
        0.075vw 0.075vw 0 #000;
}


#exitGamebutton {
    font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
    font-size: 1.7vw;
    background-color: red;
    border: 0.2vw solid black;
    border-radius: 1.5vw;
    padding: 1.7vw;
    width: 12em;
    color: white;
}

#gameIDbutton {
    font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
    font-size: 1.7vw;
    background-color: green;
    border: 0.2vw solid black;
    border-radius: 1.5vw;
    padding: 1.7vw;
    width: 12em;
    color: white;
}

#playerJoinedbutton {
    font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
    font-size: 1.7vw;
    background-color: green;
    border: 0.2vw solid black;
    border-radius: 1.5vw;
    padding: 1.7vw;
    width: 12em;
    color: white;
}

.poll {
    font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
    font-size: 1.7vw;
    color: black;
    position: center;
}

.button-container {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 90%;
    display: flex;
    justify-content: space-between;
    padding: 1em;
    margin-bottom: 2vw;
    ;
    margin-left: 3vw;
}

.participants {
    position: absolute;
}
</style>

