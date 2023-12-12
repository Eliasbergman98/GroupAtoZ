<template>
  

  <div class="arrow">
    <router-link to="/"><button id="goBack"> <img id="arrow" src="/img/arrow.png" style="width: 3vw;"> </button></router-link>
  </div>
  <div>
    <img id="brake" src="/img/brake.png" style="width: 15vw;">
    <h1>
      {{ uiLabels.heading }}
    </h1>
  </div>
  <section id="box-container">
  <section id="aboutus" class="text">
    <h2>{{ uiLabels.aboutText }}</h2>
    <p>{{ uiLabels.information1 }}</p>
    <p style="margin-bottom:1em">{{ uiLabels.information15 }}</p>
  </section>
  <section id="howtoplay" class="text">
    <h2>{{ uiLabels.aboutText2 }}</h2>
    <p>{{ uiLabels.information2 }}</p>
    <p style="margin-bottom:1em">{{ uiLabels.information25 }}</p>
  </section>
  <section id="howtocreate" class="text">
    <h2> {{ uiLabels.createGame1 }} </h2>
    <p>{{ uiLabels.information3 }}</p>
    <p>{{ uiLabels.information4 }}</p>
    <p>{{ uiLabels.information5 }}</p>
    <p>{{ uiLabels.information6 }}</p>
  </section>
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

#brake {
  margin-top:-7vw;
}

#box-container{
  display:inline-flex;
}

#aboutus, #howtoplay, #howtocreate {
  border: 0.2vw solid black;
  color: white;
  background-color: green;
  margin: 1vw;
  margin-top: -1vw;
  padding: 1vw;
  height: 19vw;
  width: 26vw;
  border-radius: 1.5vw;
}

/*Svart outline taget från Fred Meyer https://wpshout.com/quick-guides/create-text-outline-css/#gref */
.text {
	text-shadow:
		-0.05vw -0.05vw 0 #000,
		0.05vw -0.05vw 0 #000,
		-0.05vw 0.05vw 0 #000,
		0.05vw 0.05vw 0 #000;
    font-size: 1.15vw;
}
.arrow{
  background-color: rgb(163, 163, 243);
  text-align: left;
  padding: 1vw 0 0 1vw;
}
.arrow button{
  background-color: rgb(163, 163, 243);
  border: 1vw solid rgb(163, 163, 243);
}
</style>