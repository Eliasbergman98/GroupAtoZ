<template>
  <header>
    <div class="langimg">
      <img id="sweimg" src="/img/sweflag.png" style="width: 4vw;" v-on:click="switchLanguage('sv')">
      <img id="ukimg" src="/img/ukflag.png" style="width: 4vw;" v-on:click="switchLanguage('en')">
    </div>
  </header>
  <audio ref="audioPlayer" autoplay loop>
      <source src="/img/villeTrainSounds.mp3" type="audio/mp3" />
      Your browser does not support the audio element.
    </audio>
  <main>
    <section id="section1">
      <img id="brake" src="/img/brake.png" style="width: 15vw;">
      <h1>{{ uiLabels.heading }}</h1>
      <div>
        <!--<img id="map" src="/img/map.webp" style="width: 150px;">-->
        <img id="earth" src="/img/spinning_globe.gif" style="width: 18vw;">
        <!--<img id="train" src="/img/train.gif" style="width: 150px;"><-->
      </div>
      <h2>{{ uiLabels["sales-pitch2"] }}</h2>
    </section>
    <section class="button-container">
      <router-link to="/create/"><button id="createbutton"> {{ uiLabels.createGame }}</button></router-link>
      <router-link to="/howtoplay/"><button id="howtoplaybutton"> {{ uiLabels.about }}</button></router-link>
      <router-link to="/join/"><button id="joinbutton"> {{ uiLabels.joinQuiz }}</button></router-link>
    </section>
  </main>
</template>

<script>
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
  name: 'StartView',
  components: {
  },
  data: function () {
    return {
      uiLabels: {},
      id: "",
      lang: localStorage.getItem("lang") || "en",
    }
  },
  created: function () {
    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels
    })
  },
  methods: {
    switchLanguage: function (lang) {
      this.lang = lang;
      localStorage.setItem("lang", this.lang);
      socket.emit("switchLanguage", this.lang)
    }
  }
}
</script>

<style scoped>
body {
  overflow:hidden;
}

#brake{
  margin-top:-1vw;
}

#earth{
  margin-top:-6vw;
  margin-bottom:-6vw;
}

.langimg {
  margin-top: 15px;
  position: fixed;
  display: flex;
  justify-content: space-between;
}

#sweimg {
  margin-left: 20px;
  margin-right: 10px;
}

#ukimg {
  margin-right: 10px;
}

.button-container {
  margin-top: -1em;
  bottom: 0;
  left: 0;
  width: calc(100% - 4em);
  display: flex;
  justify-content: space-between;
  padding: 2em;
}

.button-container button {
  pointer-events: auto;
}

.button-container {
  pointer-events: none;
}

#createbutton {
  margin-left: 15vw;
}

#howtoplaybutton {
  margin-left: 2vw;
  margin-right: 2vw;
}

#joinbutton {
  margin-right: 15vw;
}

h2 {
  margin-top: 6vw;
  font-style: italic;
  font-size: 1.4vw;
}
</style>
