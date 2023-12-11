<template>
  <div class="arrow">
    <router-link to="/"><button id="goBack"> <img id="arrow" src="/img/arrow.png" style="width: 3vw;">
      </button></router-link>
  </div>
  <main>
    <section>
      <img src="/img/brake.png" style="width: 200px;">
      <h1 id="heading">
        {{ uiLabels.heading }}
      </h1>
      <div id="gamecodeheading">
        {{ uiLabels.gameCode }}:
      </div>
      <div>
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
    // socket.on("dataUpdate", answers =>
    //   this.submittedAnswers = answers
    // )
    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels
    })
    socket.on("pollCreated", (data) => console.log("pollId created:", data))
    socket.emit("getPoll", this.pollId);
    socket.on("fullPole", (data) => {
      this.data = data;
      console.log("data hämtad i joinview", this.data)
    });
  },
  methods: {
    submitAnswer: function (answer) {
      socket.emit("submitAnswer", { pollId: this.pollId, answer: answer })
    },
    addGameCode: function () {
      if (this.gamecode === '') {
        alert('Please enter a game code');
      }
      // if (this.gamecode === this.pollId) {
      //   this.$router.push('/quiz/' + this.gamecode)
      // }
      else {
       this.$router.push('/quiz/' + this.gamecode)
       }
    }
  }
}
</script>

<style scoped>
#joinbutton:hover {
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
  margin-bottom: 5vw;
  margin-left: 60vw;
}

#gamecode,
#gamecodeheading {
  padding: 20px;
  font-weight: bold;
}

#gamecode {
  margin-bottom: 4vw;
}

#heading {
  margin-bottom: 1vw;
}
</style>
