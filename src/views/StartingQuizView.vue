<template>
    <h2>
        Stad 1
    </h2>
    <h1>
        {{ uiLabels.whereTo }}
    </h1>
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
h1 {
    position: center;
    margin-top: 10vw;
}

h2 {
    position: center;
    margin-top: 10vw;
}
</style>