<template>
    <div class="arrow">
        <button @click="goBack()">
            <router-link to="/createquestions/"><button id="goBack"> <img id="arrow" src="/img/arrow.png" style="width: 3vw;">
                </button></router-link>
        </button>
    </div>
   
    <div class="poll">
        <div class="gameInfo a">
            {{ uiLabels.players }} <br>
        </div>
        <div class="gameInfo b">
            {{ uiLabels.gameTag }} <br>
        </div>

        <div class="earth">
            <img id="earth" src="/img/earth.png" style="width: 180px;">
        </div>

        <div class="gameInfo c">
            <router-link to="/startingquiz/"><button class="createbutton"> {{uiLabels.startGame}}</button></router-link>
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
            quizName: '',
            question: "",
            answers: ["", ""],
            questionNumber: 0,
            data: {},
            uiLabels: {},
            selectedAvatar: null,
            avatars: avatar
        }
    },
    created: function () {
        this.id = this.$route.params.id;

        socket.emit("pageLoaded", this.lang);
        socket.on("init", (labels) => {
            this.uiLabels = labels
        })
        socket.on("dataUpdate", (data) =>
            this.data = data
        )
        socket.on("pollCreated", (data) =>
            this.data = data)
    },
    methods: {
        createPoll: function () {
            socket.emit("createPoll", { pollId: this.pollId, lang: this.lang })
        },
        addQuizName: function () {
            socket.emit("addQuizName", this.quizName)
            //this.quizName.push("");
            console.log(this.quizName)
            socket.on("addQuizName", (data) => console.log("hej"))

        },
        addQuestion: function () {
            socket.emit("addQuestion", { pollId: this.pollId, q: this.question, a: this.answers })
        },
        addAnswer: function () {
            this.answers.push("");
        },
        runQuestion: function () {
            socket.emit("runQuestion", { pollId: this.pollId, questionNumber: this.questionNumber })
        },
        selectAvatar(index) {
            this.selectedAvatar = index;
        }
    }

}
</script>
  
<style scoped>
.poll {
    position: relative;
  display: grid;
  grid-template-columns: 30vw 10vw 1vw;
  grid-template-rows: 5vw 15vw 14vw ;
  background-color: rgb(163, 163, 243);
  grid-gap: 3vw;
  background-size: cover;
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
    font-size: 2vw;
    width: 30vw;
    height: 30vw;
    background-size: cover;
    background-color: white;
    border: 0.5em solid black;
    margin-left: 5vw;
    margin-right: 3vw;
    padding: 0.7em 0  0 1em;
}

.b {
    grid-row-start: 1;
    grid-column-start: 2;
    text-align: left;
    font-size: 2vw;
    width: 30vw;
    height: 3vw;
    background-size: cover;
    background-color: white;
    border: 0.5em solid black;
    margin-left: 15vw;
    padding: 0.7em 0  0 1em;
}

.c {
    grid-row-start: 3;
    grid-column-start: 4;
    justify-self: center;
    margin-top: 7vw;
}

.earth {
    grid-column-start: 4;
    grid-row-start: 1;
    margin-top: 10vw;
}

.createbutton:hover {
    cursor: pointer;
    background-color: green;
}

.createbutton {
    font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
    font-size: 14pt;
    background-color: gray;
    color: white;
    border: 2px solid black;
    padding: 20px;
    border-radius: 20px;
    margin-left: 20vw;
}
</style>