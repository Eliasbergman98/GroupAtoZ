<template>
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
      <router-link to="/quiz/"><button id="joinbutton"> {{ uiLabels.joinQuiz }}</button></router-link>
    </div>
  </main>
</template>

<script>
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
  }
}
</script>

<style>
#section {
  position: absolute;
}

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
  margin-left: 40vw;
}

header {
  background-color: rgb(163, 163, 243);
}

#gamecode {
  padding: 20px;

}

h1 {
  margin-top: 50px;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  text-transform: uppercase;
  font-size: 30pt;
  font-style: italic;
  color: rgb(177, 27, 27);
}

body {
  background-color: rgb(163, 163, 243);
}
</style>
