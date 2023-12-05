<template>
  
    <div class="arrow">
      <button @click="goBack()">
      <router-link to="/create/"><button id="goBack"> <img id="arrow" src="/img/arrow.png" style="width: 3vw;"> </button></router-link>
    </button>
    </div>
    <div class="poll">
      <div class="gameInfo a"> {{uiLabels.city1}}
        <input type="text" v-model="city1">
        </div>
        <div class="gameInfo b"> {{ uiLabels.clue1 }}
        <input type="text" v-model="clue1">
        </div>
        <div class="gameInfo c"> {{ uiLabels.clue2 }}
        <input type="text" v-model="clue2">
      </div>
      <div class="gameInfo d"> {{ uiLabels.clue3 }}
        <input type="text" v-model="clue3">
      </div>
      <div class ="earth">
        <img id="earth" src="/img/earth.png" style="width: 180px;">
      </div>
      
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
    
      <!-- <div class="gameInfo b">
        {{ uiLabels.chooseAvatar }} <br>
        <img class="avatar">
        <button v-for="(avatar, index) in avatars" :key="index" @click="selectAvatar(index)"
          :class="{ 'selected': selectedAvatar === index }">
          <img class="emojies" v-bind:src="avatar.url" alt="😄" width="32" height="32">
        </button>
      </div> -->
  
      <div class="gameInfo e"> 
        <router-link to="/playerjoining/"> <button class="createbutton"> {{ uiLabels.createGame }}</button> </router-link>
      </div>
      <div class="gameInfo f"> 
        <button class="addTown" v-on:click="addQuestion"> {{ uiLabels.addTown }}</button>
      </div>

      <div class="infofromviewbefore">
        test
        {{ pollId}}
        {{ data }}
       
      </div>
  
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
    name: 'CreateQuestions',
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
        quizName: "",
        city1: "",
        clue1: "",
        clue2: "",
        clue3: ""
      }
    },
    created: function () {
      this.quizName = this.$route.params.quizName;
  
      socket.emit("pageLoaded", this.lang);
      socket.on("init", (labels) => {
        this.uiLabels = labels;
      });
      
      socket.on("dataUpdate", (data) =>
       this.data = data );
      // socket.emit("getPoll", this.pollId);
      
      console.log("Updated quizName:",this.pollId)
      socket.emit("getPoll");

      socket.on("fullPole", (data) => {
        console.log("in create", this.pollId)
        this.data = data;
      });
        

    },
    methods: {
      createPoll: function () {
       socket.emit("createPoll", { pollId: this.pollId, lang: this.lang })
      },
       addPollName: function () {
        this.pollNameId.push("");
       },
       addQuestion: function () {
       socket.emit("addQuestion", { pollId: this.pollId, q: this.city1, a: this.clue1, b: this.clue2, c: this.clue3 })
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

  #saveButton{
    font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
    font-size: 1.5vw;
    color: white;
    background-color: green;
    border: 2px solid black;
    padding: 1vw;
    border-radius: 2px;
  }
  .poll {
    position: relative;
    display: grid;
    grid-template-columns: 50vw 30vw 10vw;
    grid-template-rows: 7vw 7vw 7vw 7vw 7vw 10vw;
    background-color: rgb(163, 163, 243);
    grid-gap: 1vw;
    background-size: cover;
  }
  
  
  .gameInfo {
    font-family: Georgia, 'Times New Roman', Times, serif;
    width: 50vw;
    height: 1vw;
    text-align: left;
    position: left;
    border-radius: 20px;
  
  }
  
  .a {
  grid-row-start: 1;
  grid-column-start: 1;
  padding: 10em auto 2em 2em;
  text-align: center;
  font-size:2vw;
  width: 50vw;
  height: 5vw;
  background-size: cover;
  background-color: rgb(201, 241, 244);
  border: 2px solid black;
  margin-left: 10vw;
  }
  
  .b {
  grid-row-start: 2;
  grid-column-start: 1;
  padding: 10em auto 2em 2em;
  text-align: center;
  font-size:2vw;
  width: 50vw;
  height: 5vw;
  background-size: cover;
  background-color: rgb(201, 241, 244);
  border: 2px solid black;
  margin-left: 10vw;
}
  
.c {
  grid-row-start: 3;
  grid-column-start: 1;
  padding: 10em auto 2em 2em;
  text-align: center;
  font-size:2vw;
  width: 50vw;
  height: 5vw;
  background-size: cover;
  background-color: rgb(201, 241, 244);
  border: 2px solid black;
  margin-left: 10vw;
}
.d {
  grid-row-start: 4;
  grid-column-start: 1;
  padding: 10em auto 2em 2em;
  text-align: center;
  font-size:2vw;
  width: 50vw;
  height: 5vw;
  background-size: cover;
  background-color: rgb(201, 241, 244);
  border: 2px solid black;
  margin-left: 10vw;
}
.e{
  margin-bottom: 0;
  grid-row-start: 4;
  grid-column-start: 3;
  width: 10vw;
  
}

.f{
  grid-row-start: 5;
  grid-column-start: 1;
  padding: 10em auto 2em 2em;
  text-align: center;
  font-size:3vw;
  width: 50vw;
  height: 5vw;
  background-size: cover;
  background-color: rgb(201, 241, 244);
  margin-left: 10vw;
}
.infofromviewbefore{
    grid-row-start:6 ;
    grid-column-start: 1;
  }
  
  .selected {
    background-color: green;
  
  }
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
  padding: 20px;
  border-radius: 20px;
} 
.addTown:hover {
  cursor: pointer;
  background-color: green;
}
.addTown{
  font-family: Georgia, 'Times New Roman', Times, serif;
  width: 100%;
  height: 100%;
  text-align: center;
  font-size:2vw;
  background-color:rgb(201, 241, 244) ;
  border: 2px solid black;
  padding: 20px;
  border-radius: 20px;
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

  .earth{
  width: 10vw;
  grid-column-start: 3;
  grid-row-start: 1;
  
}
  </style>