<template>
    <div class="arrow">
        <button @click="goBack()">
            <router-link to="/createquestions/"><button id="goBack"> <img id="arrow" src="/img/arrow.png"
                        style="width: 3vw;">
                </button></router-link>
        </button>
    </div>

    <div class="poll">
        <div class="gameInfo a">
            {{ uiLabels.players }} <br>
            <div class="scroll-wrapper">
                <ul v-for="person in participants" :key="participants.name">
                    <li>
                        {{ person.name }} <img v-bind:src="person.avatar" target="_blank" width="32" height="32">
                    </li>
                </ul>
            </div>
        </div>
        <div class="gameInfo b">
            {{ data.quizName }} <img v-bind:src="data.selectedAvatar" width="20" height="20" target="_blank"> <br>
            {{ uiLabels.gameTag }} {{ pollId }} <br>
        </div>
        <div class="gameInfo c">
            <button class="createbutton" v-on:click="sendInfo"> {{ uiLabels.startGame }}</button>
        </div>
    </div>
</template>
  
<script>
import io from 'socket.io-client';
import avatar from '../assets/avatar.json';
const socket = io("localhost:3000");

export default {
    name: 'PlayerJoiningView',
    data: function () {
        return {
            lang: localStorage.getItem("lang") || "en",
            pollId: "",
            question: "",
            answers: ["", ""],
            questionNumber: 0,
            data: {},
            uiLabels: {},
            selectedAvatar: null,
            avatars: avatar,
            participants: []
        }
    },
    created: function () {
        this.pollId = this.$route.params.pollId;
        socket.emit("pageLoaded", this.lang);
        socket.on("init", (labels) => {
            this.uiLabels = labels
        })
        socket.on("dataUpdate", (data) =>
            this.data = data
        )
        socket.on("participantsUpdate", (participants) =>
            this.participants = participants,
            console.log("hej här kommer nya joinare", this.participants)
        )
        socket.emit("joinPoll", this.pollId);
        socket.emit("getPoll", this.pollId);
        socket.on("pollCreated", (data) =>
            this.data = data)
        socket.on("fullPole", (data) => {
            console.log("in joiningview", this.pollId)
            this.data = data;
        });
    },
    methods: {
        sendInfo: function () {
            this.$router.push('/startingquiz/' + this.pollId)
        }
    }
}
</script>
  
<style scoped>
.poll {
    position: relative;
    display: grid;
    grid-template-columns: 30vw 10vw 1vw;
    grid-template-rows: 5vw 15vw 14vw;
    background-color: rgb(163, 163, 243);
    grid-gap: 3vw;
    background-size: cover;
    font-size: 2vw;
}

.gameInfo {
    font-family: Georgia, 'Times New Roman', Times, serif;
    width: 50vw;
    height: 1vw;
    text-align: left;
    position: left;
}

.a {
    grid-row-start: 1;
    grid-column-start: 1;
    padding: 10em auto 2em 2em;
    text-align: left;
    width: 30vw;
    height: 38vw;
    background-size: cover;
    background-color: rgb(201, 241, 244);
    border: 2px solid black;
    margin-left: 10vw;
    border-radius: 20px;
    margin-right: 3vw;
    padding: 0.7em 0 0 1em;
    overflow-y: hidden;
}

.scroll-wrapper {
    overflow-y: auto;
    height: 35vw; /* Ensure the wrapper takes the full height of the container */
    border-radius: 18px; /* Adjust this value to match your border-radius */
}

.scroll-wrapper ul {
    list-style: none;
    padding: 0;
    margin: 0;
}
.b {
    grid-row-start: 1;
    grid-column-start: 2;
    text-align: left;
    position: relative;
    width: 30vw;
    height: 6vw;
    background-color: rgb(201, 241, 244);
    border: 2px solid black;
    margin-left: 10vw;
    border-radius: 20px;
    margin-left: 15vw;
    padding: 0.7em 0 0 1em;
}

.c {
    grid-row-start: 3;
    grid-column-start: 4;
    justify-self: center;
    margin-top: 7vw;
}

.createbutton:hover {
    cursor: pointer;
    background-color: green;
}

.createbutton {
    font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
    background-color: gray;
    color: white;
    border: 2px solid black;
    padding: 20px;
    border-radius: 20px;
    margin-left: 20vw;
}


</style>