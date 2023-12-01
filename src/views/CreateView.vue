<template>
  
  <div class="arrow">
    <button @click="goBack()">
    <router-link to="/"><button id="goBack"> <img id="arrow" src="/img/arrow.png" style="width: 3vw;"> </button></router-link>
  </button>
  </div>
  <div class="poll">
    <div class="gameInfo a">
      <!--Poll link: 
    <input type="text" v-model="pollId">
    <button v-on:click="createPoll">
      Save gameID 
    </button> <br> <br> -->
      {{ uiLabels.chooseName }} <br>
      <input v-model="quizName" id="quizName" name="quizName" type="text" >
      <button id="quizName" name="quizName" v-on:click="addQuizName">
        {{ uiLabels.addName }}
      </button>
    </div>
    <div class ="earth">
      <img id="earth" src="/img/earth.png" style="width: 180px;">
    </div>
    <div class="gameInfo b">
      {{ uiLabels.chooseAvatar }} <br>
      <img class="avatar">
      <button v-for="(avatar, index) in avatars" :key="index" @click="selectAvatar(index)"
        :class="{ 'selected': selectedAvatar === index }">
        <img class="emojies" v-bind:src="avatar.url" alt="😄" width="32" height="32">
      </button>
    </div>
    <div>
      <router-link to="/createquestions/"><button class="createbutton"> {{ uiLabels.createGame }}</button></router-link>
    </div>

    <!--<div class="gameInfo c">
      {{ uiLabels.question }}:
      <input type="text" v-model="question">
      <div>
        Answers:
        <input v-for="(_, i) in answers" v-model="answers[i]" v-bind:key="'answer' + i">
        <button v-on:click="addAnswer">
          Add answer alternative
        </button>
      </div>
    </div>
    <button v-on:click="addQuestion">
      Add question
    </button>
    <input type="number" v-model="questionNumber">
    <button v-on:click="runQuestion">
      Run question
    </button>
    {{ data }}
    <router-link v-bind:to="'/result/' + pollId">Check result</router-link> -->
  </div>
</template>

<script>
import io from 'socket.io-client';
import avatar from '../assets/avatar.json';
const socket = io("localhost:3000");

export default {
  name: 'CreateView',
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
      socket.emit("quizName",  this.quizName)
      //this.quizName.push("");
      console.log(this.quizName)
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
  grid-template-columns: 50vw 50vw;
  grid-template-rows: 5vw 15vw 25vw;
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
  text-align: center;
  font-size: 2vw;
  width: 50vw;
  height: 5vw;
  background-size: cover;
  background-color: white;
  border: 0.5em solid black;
  margin-left: 5vw;
}

.b {
  grid-row-start: 2;
  grid-column-start: 1;
  text-align: center;
  font-size: 2vw;
  width: 50vw;
  height: 10vw;
  background-size: cover;
  background-color: white;
  border: 0.5em solid black;
  margin-top: 2vw;
  margin-left: 5vw;
  padding-top: 2vw;
  padding-bottom: 4vw;
}

.earth{
  grid-column-start: 2;
  grid-row-start: 1;
}

/* .c button{
  margin-top: 20vw;
  width: 5vw;
  align-items: left;
} */

.createbutton:hover {
  cursor: pointer;
  background-color: green;
}

.createbutton {
  font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
  font-size: 14pt;
  color: white;
  background-color: gray;
  border: 2px solid black;
  grid-column-start: 2;
  grid-row-start: 3;
  padding: 20px;
  border-radius: 20px;
  /* margin-top: 15vw; */
  /* margin-top: 10vw;
  margin-left: 60vw;  */
}


.selected {
  background-color: green;

}

/* .button-container {
  grid-column-start: 2;
  grid-row-start: 2;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
} */

.arrow{
  background-color: rgb(163, 163, 243);
  text-align: left;
  padding: 1vw 0 0 1vw;
}
.arrow button{
  background-color: rgb(163, 163, 243);
  border: 1px solid rgb(163, 163, 243);
}
</style>