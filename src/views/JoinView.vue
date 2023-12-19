<template>
  <header>
    <div>
      <img class="muteButton" @click="toggleMute" :src="buttonImage" alt="Toggle Mute" />
    </div>
  </header>
  <div class="arrow">
    <router-link to="/"><button id="goBack"> <img id="arrow" src="/img/arrow.png" style="width: 3vw;">
      </button></router-link>
  </div>
  <main>
    <section>
      <img id="brake" src="/img/brake.png">
      <h1 id="heading">
        {{ uiLabels.heading }}
      </h1>
      <div>
        <input type="text" id="gamecode" v-model="gamecode" :placeholder="uiLabels.enterCode">
      </div>
    </section>
    <div>
      <button id="joinbutton" v-on:click="addGameCode"> {{ uiLabels.joinQuiz }} </button>
      <AlertComponent ref="alertComponent" :alertContentText="alertContentText">
      </AlertComponent>
    </div>
  </main>
</template>

<script>
// @ is an alias to /src
import AlertComponent from '@/components/AlertComponent.vue';
import io from 'socket.io-client';
import pressToMuteImage from "/img/soundon.png";
import pressToUnmuteImage from "/img/soundoff.png";
const socket = io("localhost:3000");

export default {
  name: 'JoinView',
  components: {
    AlertComponent,
  },
  data: function () {
    return {
      gamecode: "",
      pollId: "inactive poll",
      submittedAnswers: {},
      uiLabels: {},
      lang: localStorage.getItem("lang") || "en",
      alertContentText: "",
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
    socket.emit("getPoll", this.gamecode);
    socket.on("fullPole", (data) => {
      this.data = data;
    });
  },
  methods: {
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
    addGameCode: async function () {
      this.pollId = this.gameCode
      // Use a Promise to wait for the asynchronous operation
      const fetchData = () => {
        return new Promise((resolve) => {
          socket.emit("getPoll", this.gamecode);
          socket.on("fullPole", (data) => {
            this.data = data;
            resolve(); // Resolve the promise when the data is retrieved
          });
        });
      };

      try {
        // Wait for the data to be retrieved before proceeding
        await fetchData();

        if (this.gamecode === '') {
          this.alertContentText = this.uiLabels.gameCodeAlert;
          this.$refs.alertComponent.openAlert();
        } else if (Object.keys(this.data).length === 0) {
          this.alertContentText = this.uiLabels.gameCodeAlert;
          this.$refs.alertComponent.openAlert();
        } else {
          this.pollId = this.gamecode;
          this.$router.push('/quiz/' + this.pollId);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  }
}
</script>

<style scoped>
#brake {
  margin-top: -5.5vw;
  width: 15vw;
}

#joinbutton:hover {
  background-color: green;
}

#joinbutton {
  font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
  font-size: 14pt;
  color: white;
  background-color: gray;
  border: 2px solid black;
  padding: 2vw;
  border-radius: 20px;
  margin: -10vw;
}

#gamecode {
  padding: 20px;
  font-weight: bold;
}

#gamecode {
  margin-bottom: 5vw;
  margin-top: 2vw;
}

#heading {
  margin-bottom: 1vw;
}

@media screen and (max-width:800px) {

  #brake {
    margin-top: -5.5vw;
    width: 30vw;
  }

  #joinbutton {
    font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
    font-size: 7vw;
    color: white;
    background-color: gray;
    border: 2px solid black;
    padding: 5vw;
    border-radius: 20px;
    margin: 5vw;
  }

  #gamecode {
    margin-top: 1vw;
    padding: 5vw;
    font-weight: bold;
    font-size: 5.5vw;
  }

  #heading {
    margin-bottom: 1vw;
    font-size: 13vw;
  }
}
</style>
