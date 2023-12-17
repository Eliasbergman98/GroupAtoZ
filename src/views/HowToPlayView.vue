<template>
  <header>
    <div>
      <img class="muteButton" @click="toggleMute" :src="buttonImage" alt="Toggle Mute"/>
    </div>
  </header>
  <div class="arrow">
    <router-link to="/"><button id="goBack"> <img id="arrow" src="/img/arrow.png" style="width: 3vw;"> </button></router-link>
  </div>
  <div>
    <img id="brake" src="/img/brake.png" style="width: 15vw;">
    <h1>
      {{ uiLabels.heading }}
    </h1>
  </div>
  <!-- <audio id="audioPlayer" autoplay loop>
      <source src="/img/villeTrainSounds.mp3" type="audio/mp3" />
      Your browser does not support the audio element.
  </audio> -->
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
import pressToMuteImage from "/img/soundon.png";
import pressToUnmuteImage from "/img/soundoff.png";
const socket = io("localhost:3000");

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
        // Compute the image source based on the button state
        buttonImage() {
            return this.isMuted ? pressToMuteImage : pressToUnmuteImage;
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
    toggleMusic() {
      // Access the audio player from the AppView component
      const audioPlayer = this.$root.$refs.audioPlayer;
      audioPlayer.play();
      this.showMysteryButton = false; // Hide the mysteryButton
    },
    toggleMute() {
      const audioPlayer = this.$root.$refs.audioPlayer;
      audioPlayer.muted = !audioPlayer.muted;
      this.isMuted = !this.isMuted;
      },
  }
}
</script>


<style scoped>

.muteButton{
    position: absolute;
    width: 3vw;
    height: 3vw;
    padding: 0.5vw 0 0 0.5vw; /* Adjusted padding */
    margin-left: 45vw;
    margin-top: 1vw;
}

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