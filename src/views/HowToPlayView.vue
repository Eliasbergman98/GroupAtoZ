<template>
  <header>
    <div>
      <img class="muteButton" @click="toggleMute" :src="buttonImage" alt="Toggle Mute"/>
    </div>
  </header>
  <div class="arrow">
    <router-link to="/"><button id="goBack"> <img id="arrow" src="/img/arrow.png"> </button></router-link>
  </div>
  <div>
    <img id="brake" src="/img/brake.png">
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
    <p>{{ uiLabels.information25 }}</p>
    <p style="margin-bottom:1em">{{ uiLabels.extraPoints }}</p>
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
import pressToMuteImage from "/img/soundon.png";
import pressToUnmuteImage from "/img/soundoff.png";
const socket = io(sessionStorage.getItem("localhost"));

export default {
  name: 'HowToPlay',
  data: function () {
    return {
      uiLabels: {},
      lang: localStorage.getItem("lang") || "en",
      isMuted: false,
      showMysteryButton: true,
    }
  },
  computed: {
        buttonImage() {
            return this.isMuted ? pressToUnmuteImage : pressToMuteImage; 
        }
  },
  created: function () {
    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels
    })
    // Check sessionStorage for muted state
    const isMuted = sessionStorage.getItem("isMuted");
      if (isMuted) {
        this.isMuted = JSON.parse(isMuted);
      }
  },
  methods: {
    switchLanguage: function (lang) {
      this.lang = lang;
      localStorage.setItem("lang", this.lang);
      socket.emit("switchLanguage", this.lang)
    },
    toggleMusic() {
      const audioPlayer = this.$root.$refs.audioPlayer;
      audioPlayer.play();
      this.showMysteryButton = false;
    },
    toggleMute() {
      const audioPlayer = this.$root.$refs.audioPlayer;
      audioPlayer.muted = !audioPlayer.muted;
      this.isMuted = !this.isMuted;
      sessionStorage.setItem("isMuted", JSON.stringify(this.isMuted));

      },
  }
}
</script>


<style scoped>


#brake {
  margin-top:-5vw;
  width: 15vw;
}

#box-container{
  display:inline-flex;
}

#aboutus, #howtoplay, #howtocreate {
  border: 0.2vw solid black;
  color: white;
  background-color: green;
  margin: 1vw;
  margin-top: -2vw;
  padding: 1vw;
  height: 23vw;
  width: 26vw;
  border-radius: 1.5vw;
}

.text {
	text-shadow:
		-0.05vw -0.05vw 0 #000,
		0.05vw -0.05vw 0 #000,
		-0.05vw 0.05vw 0 #000,
		0.05vw 0.05vw 0 #000;
    font-size: 1.15vw;
}

@media screen and (max-width: 800px) {

h1{
  font-size: 10vw;
}

#box-container{
 display: flex;
 flex-direction: column;
 align-items: center;

}

#aboutus, #howtoplay, #howtocreate {
  border: 0.2vw solid black;
  color: white;
  background-color: green;
  margin: 1vw;
  margin-bottom: 5vh;
  padding: 1vw;
  height: auto;
  width: 80vw;
  border-radius: 1.5vw;
}
.text {
	text-shadow:
		-0.05vw -0.05vw 0 #000,
		0.05vw -0.05vw 0 #000,
		-0.05vw 0.05vw 0 #000,
		0.05vw 0.05vw 0 #000;
    font-size: 3vw;
}
}
</style>