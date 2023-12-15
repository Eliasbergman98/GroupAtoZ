<template>
    <header>
    
    </header>
    <main>
        <div id="pics">
        <!-- v-bind:src="data.selectedAvatar" -->
        <img class="podium" src="/img/Podium-removebg-preview.png">
        <img class="emoji1" src="/img/earth.png">
    </div>
    </main>
  </template>
  
  <script>
import io from 'socket.io-client';
import avatar from '../assets/avatar.json';
const socket = io("localhost:3000");

  export default {
    name: 'LastResult',
    components: {
    },
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
            participants: [],
            participantCount: 0
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
            socket.emit("startingGame", { pollId: this.pollId, questionNumber: this.questionNumber });
            this.$router.push('/startingquiz/' + this.pollId);
        },
    }
  }
  </script>
  
  <style scoped>

.podium{
position: absolute;
height: 40vw;
width: 40vw;
right: 30vw;

}
.emoji1{
position: absolute;
height: 6.5vw;
width: 6.5vw;
top: 8vw;
right: 46.5vw;
}
  </style>
  