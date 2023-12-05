<template>
  <div class="arrow">
    <router-link to="/"><button id="goBack"> <img id="arrow" src="/img/arrow.png" style="width: 3vw;">
      </button></router-link>
  </div>
  <main>
    <section>
      <img src="/img/brake.png" style="width: 200px;">
      <h1>
        {{ uiLabels.heading }}
      </h1>
      <div id="gamecode">
        {{ uiLabels.gameCode }}:
        <input type="text" id="gamecode" v-model="gamecode" :placeholder="uiLabels.enterCode">
      </div>
    </section>
    <div>
        <button id="joinbutton" v-on:click="addGameCode"> {{ uiLabels.joinQuiz }}</button>
    </div>
  </main>
</template>

<script>
// @ is an alias to /src
import QuestionComponent from '@/components/QuestionComponent.vue';
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
  name: 'JoinView',
  components: {
    QuestionComponent
  },
  data: function () {
    return {
      gamecode: "",
      question: {
        q: "",
        a: [],
      },
      pollId: "inactive poll",
      submittedAnswers: {},
      uiLabels: {},
      lang: localStorage.getItem("lang") || "en"
    }

  },
  created: function () {
    this.pollId = this.$route.params.id
    socket.emit('joinPoll', this.pollId)
    socket.on("newQuestion", q =>
      this.question = q
    )
    socket.on("dataUpdate", answers =>
      this.submittedAnswers = answers
    )
    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels
    })
  },
  methods: {
    submitAnswer: function (answer) {
      socket.emit("submitAnswer", { pollId: this.pollId, answer: answer })
    },
    addGameCode: function () {
      if (this.gamecode === '') {
        alert('Please enter a game code');
      }
      else {
        this.$router.push('/quiz/')
      }
    }
  }
}
</script>

<style scoped>
/* #section {
  position: absolute;
} */

#joinbutton:hover {
  cursor: pointer;
  background-color: green;
}

#joinbutton {
  font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
  font-size: 14pt;
  color: white;
  background-color: gray;
  border: 2px solid black;
  padding: 20px;
  border-radius: 20px;
  margin-top: 5vw;
  margin-left: 60vw;
}

#gamecode {
  padding: 20px;
  font-weight: bold;
}

h1 {
  margin-top: 50px;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  text-transform: uppercase;
  font-size: 30pt;
  font-style: italic;
  color: rgb(177, 27, 27);
}

.arrow {
  background-color: rgb(163, 163, 243);
  text-align: left;
  padding: 1vw 0 0 1vw;
}

.arrow button {
  background-color: rgb(163, 163, 243);
  border: 1px solid rgb(163, 163, 243);
  
}</style>
