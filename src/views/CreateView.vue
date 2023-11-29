<template>
  <div class="poll">
    <div class="gameInfo a">
    Poll link: 
    <input type="text" v-model="pollId">
    <button v-on:click="createPoll">
      Save gameID 
    </button> <br> <br>
    Choose name for your quiz:
    <input type="text" v-model="pollNameId">
    <button v-on:click="addPollName">
      Add name
    </button>
    </div>
    <div class="gameInfo b">
    <br> <br>
    Choose your avatar: <br>
    <img class="avatar">
    <button v-for="(avatar, index) in avatars" :key="index" @click="selectAvatar(index)" :class="{ 'selected': selectedAvatar === index }">
      <img class="emojies" v-bind:src="avatar.url" alt="😄" width="32" height="32">
    </button>
    </div>

    <div class="gameInfo c">
      {{uiLabels.question}}:
      <input type="text" v-model="question">
      <div>
        Answers:
        <input v-for="(_, i) in answers" 
               v-model="answers[i]" 
               v-bind:key="'answer'+i">
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
    {{data}}
    <router-link v-bind:to="'/result/'+pollId">Check result</router-link>
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
      pollNameId:"",
      question: "",
      answers: ["", ""],
      questionNumber: 0,
      data: {},
      uiLabels: {},
      selectedAvatar: null,
      avatars:avatar
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
      socket.emit("createPoll", {pollId: this.pollId, lang: this.lang })
    },
    addPollName: function(){
      this.pollNameId.push("");
    },
    addQuestion: function () {
      socket.emit("addQuestion", {pollId: this.pollId, q: this.question, a: this.answers } )
    },
    addAnswer: function () {
      this.answers.push("");
    },
    runQuestion: function () {
      socket.emit("runQuestion", {pollId: this.pollId, questionNumber: this.questionNumber})
    },
    selectAvatar(index) {
      this.selectedAvatar = index;
    }
  }

  }
</script>

<style>

.poll{
  display: grid;
  grid-gap: 3em;
  background-color: aqua;
}


.gameInfo{
  width: 50vw;
  height: 1vw;
  text-align: left;
  position: left;

}
.a{
  margin-top: 5vw;
  margin-left: 5vw;

}

.b{
  width: 15vw;
  margin-top: 2vw;
  margin-left: 5vw;
}

.c{
  margin-top: 20vw;
  margin-left: 5vw;
}

.selected {
  background-color: black;
 
}

</style>