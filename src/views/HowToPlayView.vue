<template>
  <div class="arrow">
    <router-link to="/"><button id="goBack"> <img id="arrow" src="/img/arrow.png" style="width: 3vw;"> </button></router-link>
  </div>
  <div>
    <img src="/img/brake.png" style="width: 200px;">
    <h1>
      {{ uiLabels.heading }}
    </h1>
  </div>
  <section id="howtoplay">
    <h2>{{ uiLabels.aboutText }}</h2>
    <p>{{ uiLabels.information1 }}</p>
    <br><br>
    <p>{{ uiLabels.information2 }}</p>
  </section>
  <section id="howtocreate">
    <h2> {{ uiLabels.createGame1 }} </h2>
    <br><br>
    <p>{{ uiLabels.information3 }}</p>
    <br><br>
    <p>{{ uiLabels.information4 }}</p>
    <br><br>
    <p>{{ uiLabels.information5 }}</p>
    <br><br>
    <p>{{ uiLabels.information6 }}</p>
  </section>
</template>

<script>
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
  name: 'HowToPlay',
  data: function () {
    return {
      uiLabels: {},
      lang: localStorage.getItem("lang") || "en",
    }
  },
  created: function () {
    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels
    })
  }
}
</script>


<style scoped>
h1 {
  margin-top: 5vw;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  text-transform: uppercase;
  font-size: 30pt;
  font-style: italic;
  color: rgb(177, 27, 27);
}

h2 {
  font-size: 25px;
}
p {
  margin-top: 20px;
  font-style: italic;
  font-size: 20px;
  text-align: center;
}

#howtoplay, #howtocreate {
  width: 50vw;
  border: 2px solid black;
  margin: 20px;
  background-color: white;
  margin-left: 20vw;
  margin-right: 25vw;
  padding: 5vw;
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