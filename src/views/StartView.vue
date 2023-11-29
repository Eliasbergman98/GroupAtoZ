<template>
  <header>
    <!-- <div v-bind:class="['hamburger', { 'close': !hideNav }]" v-on:click="toggleNav">
    </div>
    <div class="logo">
      <img src="/img/brake.png">
      <img src="/img/train.png">
    </div> -->
    <div class="langimg">
      <img id="sweimg" src="/img/sweflag.png" style="width: 50px;" v-on:click="switchLanguage('sv')">
      <img id="ukimg" src="/img/ukflag.png" style="width: 50px;" v-on:click="switchLanguage('en')">
      </div>
  </header>
  <main>
  <!-- <ResponsiveNav v-bind:hideNav="hideNav">
    <button v-on:click="switchLanguage">{{ uiLabels.changeLanguage }}</button>
    <a href="">{{ uiLabels.about }}</a>
  </ResponsiveNav> -->
  <section id="section1">
    <img src="/img/brake.png" style="width: 200px;">
    <h1>{{ uiLabels.heading }}</h1>
    <div>
      <img id="map" src="/img/map.webp" style="width: 150px;">
      <img id="earth" src="/img/earth.png" style="width: 180px;">
      <img id="train" src="/img/train.gif" style="width: 150px;">
    </div>
    <h2>{{ uiLabels["sales-pitch2"] }}</h2>
  </section>
  <!-- <label>
    Write poll id: 
    <input type="text" v-model="id">
  </label>
  <router-link v-bind:to="'/poll/'+id">{{uiLabels.participatePoll}}</router-link> -->
  <section class="button-container">
    <router-link to="/create/"><button id="createbutton"> {{ uiLabels.createGame }}</button></router-link>
    <router-link to="/howtoplay/"><button id="howtoplaybutton"> {{ uiLabels.about }}</button></router-link>
    <router-link to="/poll/"><button id="joinbutton"> {{ uiLabels.joinQuiz }}</button></router-link>
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
    },
    toggleNav: function () {
      this.hideNav = !this.hideNav;
    }
  }
}
</script>

<style scoped>

header {
  background-color: rgb(163, 163, 243);
}

#section {
position: absolute;
}

#train, #map {
  margin-left: 20px;
  margin-right: 20px;
}

.logo {
  text-transform: uppercase;
  letter-spacing: 0.25em;
  font-size: 2.5rem;
  color: white;
  padding-top: 0.2em;
}

.logo img {
  height: 2.5rem;
  vertical-align: bottom;
  margin-right: 0.5rem;
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

#createbutton:hover, #howtoplaybutton:hover,#joinbutton:hover, img[id=ukimg], img[id=sweimg]:hover  {
  cursor: pointer;
}

.hamburger {
  color: white;
  width: 1em;
  display: flex;
  align-items: center;
  justify-content: left;
  padding: 0.5rem;
  top: 0;
  left: 0;
  height: 2rem;
  cursor: pointer;
  font-size: 1.5rem;
}

.button-container {
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 2em;
}

#createbutton {
  font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
  font-size: 14pt;
  color: white;
  background-color: green;
  border: 2px solid black;
  padding: 20px;
  margin-left: 100px;
  border-radius: 25px;
}

#howtoplaybutton {
  font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
  font-size: 14pt;
  color: white;
  background-color: green;
  border: 2px solid black;
  padding: 20px;
  margin-left: 50px;
  border-radius: 25px;
}

#joinbutton {
  font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
  font-size: 14pt;
  color: white;
  background-color: green;
  border: 2px solid black;
  padding: 20px;
  margin-right: 250px;
  border-radius: 25px;
}



h1 {
  margin-top: 50px;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  text-transform: uppercase;
  font-size: 30pt;
  font-style: italic;
  color: rgb(177, 27, 27);
}

h2 {
  margin-top: 20px;
  font-style: italic;
  font-size: 15px;
}

@media screen and (max-width:50em) {
  .logo {
    font-size: 5vw;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .hamburger::before {
    content: "☰";
  }

  .close::before {
    content: "✕";
  }

  .hide {
    left: -12em;
  }
}

main {
  background-color: rgb(163, 163, 243);
}

</style>
