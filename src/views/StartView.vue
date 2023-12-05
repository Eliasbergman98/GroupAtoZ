<template>
  <header>
    <div class="langimg">
      <img id="sweimg" src="/img/sweflag.png" style="width: 50px;" v-on:click="switchLanguage('sv')">
      <img id="ukimg" src="/img/ukflag.png" style="width: 50px;" v-on:click="switchLanguage('en')">
    </div>
  </header>
  <main>
    <section id="section1">
      <img src="/img/brake.png" style="width: 200px;">
      <h1>{{ uiLabels.heading }}</h1>
      <div>
        <!--<img id="map" src="/img/map.webp" style="width: 150px;">-->
        <img id="earth" src="/img/spinning_globe.gif" style="width: 250px;">
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
import ResponsiveNav from '@/components/ResponsiveNav.vue';
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
  name: 'StartView',
  components: {
    ResponsiveNav
  },
  data: function () {
    return {
      uiLabels: {},
      id: "",
      lang: localStorage.getItem("lang") || "en",
      hideNav: true,
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
/* #section {
  position: absolute;
} */

#train,
#map {
  margin-left: 20px;
  margin-right: 20px;
}

#earth{
  margin-top:-90px;
  margin-bottom:-40px;
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
  bottom: 0;
  left: 0;
  width: calc(100% - 4em);
  display: flex;
  justify-content: space-between;
  padding: 2em;
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
  margin-top: 20px;
  font-style: italic;
  font-size: 15px;
}

</style>
