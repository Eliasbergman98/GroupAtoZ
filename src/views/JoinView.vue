<template>
    <header>
    <div>
      <img class="muteButton" @click="toggleMute" :src="buttonImage" alt="Toggle Mute"/>
    </div>
  </header>
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
      question: {
        q: "",
        a: [],
      },
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
      // this.pollId = data.poll.pollId;
      console.log("data hämtad i joinview", this.data)
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
            console.log("data hämtad när vi försöker hitta en poll", this.data);
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
          console.log('gamecode = pollId i joinview');
          console.log("Här är gamecode: ", this.gamecode);
          console.log("Här är pollId: ", this.pollId);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
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

@media screen and (max-width: 800px){
  
 h1{
  font-size: 17vw;
 } 

}
</style>
