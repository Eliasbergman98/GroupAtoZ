<template>
  
  <div class="arrow">
    <button @click="goBack()">
    <router-link to="/"><button id="goBack"> <img id="arrow" src="/img/arrow.png" style="width: 3vw;"> </button></router-link>
  </button>
  </div>
  <h1>
    {{ uiLabels.heading }}
  </h1>
  {{ pollId }}
  <div class="poll">
    <div class="gameInfo a">
      <!--Poll link: 
    <input type="text" v-model="pollId">
    <button v-on:click="createPoll">
      Save gameID 
    </button> <br> <br> -->
      {{ uiLabels.chooseName }} <br>
      <input v-model="quizName" id="addQuizName" name="addQuizName" type="text" >
      <button id="addQuizName" name="addQuizName">
        {{ uiLabels.addName }}
      </button>
    </div>
    <!-- <div class ="earth">
      <img id="earth" src="/img/earth.png" style="width: 180px;">
    </div> -->
    <div class="gameInfo b">
      {{ uiLabels.chooseAvatar }} <br>
      <img class="avatar">
      <button v-for="(avatar, index) in avatars" :key="index" @click="selectAvatar(index)"
        :class="{ 'selected': selectedAvatar === index }">
        <img class="emojies" v-bind:src="avatar.url" alt="😄" width="32" height="32">
      </button>
    </div>
    <div class="gameInfo c">
      <button class="createbutton" v-on:click="createPoll" > {{ uiLabels.createGame }}</button>
    </div>
  </div>
  <div>
    {{ avatars.name }}
    {{ avatars.url }}
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
    socket.on("pollCreated",  (data) => console.log("pollId created:", data))
  },
  methods: {
    createPoll: function () {
    this.pollId = Math.floor(Math.random()*10000);
      socket.emit("createPoll", { pollId: this.pollId, lang: this.lang, quizName: this.quizName, selectedAvatar: this.selectedAvatarUrl })
      console.log("the pollId:",this.pollId)
      this.$router.push('/createquestions/' + this.pollId);
      
    },
    addGameCode: function () {
      if (this.gamecode === '') {
        alert('Please enter a game code');
      }
      else {
        this.$router.push('//')
      }
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
      this.avatars.name = "avatar" +index;
      this.selectAvatarUrl = this.avatars[index].url;
      console.log(this.avatars.name)
      console.log("selected avatar URL:", this.selectAvatarUrl);
    }
  }

}
</script>

<style scoped>
.poll {
  position: relative;
  display: grid;
  grid-template-columns: 50vw 10vw 30w;
  grid-template-rows: 5vw 5vw 25vw;
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
  text-align: center;
  font-size: 2vw;
  width: 50vw;
  height: 10vw;
  background-size: cover;
  background-color: rgb(201, 241, 244);
  border: 2px solid black;
  margin-left: 10vw;
  padding-top: 2vw;
  padding-bottom: 4vw;
}

.c{
  grid-row-start: 2;
  grid-column-start: 3;
  margin-top: 10vw;
  width: 10vw;
  
}

.earth{
  width: 10vw;
  grid-column-start: 3;
  grid-row-start: 1;
  
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


.selected {
  background-color: green;

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