<template>
  
    <div class="arrow">
      <button @click="goBack()">
      <router-link to="/create/"><button id="goBack"> <img id="arrow" src="/img/arrow.png" style="width: 3vw;"> </button></router-link>
    </button>
    </div>
    <div class="poll">
      <div class="gameInfo a">
        <!--Poll link: 
      <input type="text" v-model="pollId">
      <button v-on:click="createPoll">
        Save gameID 
      </button> <br> <br> -->
        <!-- {{ uiLabels.chooseName }} <br>
        <input type="text" v-model="pollNameId">
        <button v-on:click="addPollName">
          {{ uiLabels.addName }}
        </button> -->
      </div>
      <div>
        test
        {{ this.quizName }}
        {{ this.quizName }}
        {{ this.quizName }}
        {{ this.quizName }}
        
      </div>
      <div class="gameInfo b">
        {{ uiLabels.chooseAvatar }} <br>
        <img class="avatar">
        <button v-for="(avatar, index) in avatars" :key="index" @click="selectAvatar(index)"
          :class="{ 'selected': selectedAvatar === index }">
          <img class="emojies" v-bind:src="avatar.url" alt="😄" width="32" height="32">
        </button>
      </div>
  
      <section class="button-container">
        <button id="createbutton"> {{ uiLabels.createGame }}</button>
      </section>
  
      <!-- <div class="gameInfo c">
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
      <router-link v-bind:to="'/result/' + pollId">Check result</router-link>  -->
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
        question: "",
        answers: ["", ""],
        questionNumber: 0,
        data: {},
        uiLabels: {},
        selectedAvatar: null,
        avatars: avatar,
        quizName: ''
      }
    },
    created: function () {
      this.id = this.$route.params.id;
  
      socket.emit("pageLoaded", this.lang);
      socket.on("init", (labels) => {
        this.uiLabels = labels;
      });
      socket.on("addQuizName", quizName => 
      this.quizName = quizName,
      console.log("Updated quizName:",this.quizName)
        
      );
      socket.on("dataUpdate", (data) =>
        this.data = data
      )
      socket.on("pollCreated", (data) =>
        this.data = data)

    },
    methods: {
      // createPoll: function () {
      //   socket.emit("createPoll", { pollId: this.pollId, lang: this.lang })
      // },
      // // addPollName: function () {
      // //   this.pollNameId.push("");
      // // },
      // addQuestion: function () {
      //   socket.emit("addQuestion", { pollId: this.pollId, q: this.question, a: this.answers })
      // },
      // addAnswer: function () {
      //   this.answers.push("");
      // },
      // runQuestion: function () {
      //   socket.emit("runQuestion", { pollId: this.pollId, questionNumber: this.questionNumber })
      // },
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
  
  .c button{
    margin-top: 20vw;
    width: 5vw;
    align-items: left;
    
  }
  
  .selected {
    background-color: green;
  
  }
  
  .button-container {
    bottom: 0;
    left: 0;
    width: 100vw;
    display: flex;
    justify-content: space-between;
    
  }
  
  #createbutton {
    font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
    font-size: 1.5vw;
    color: white;
    background-color: green;
    border: 2px solid black;
    padding: 1vw;
    margin-left: 70vw;
    border-radius: 2px;
  }
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