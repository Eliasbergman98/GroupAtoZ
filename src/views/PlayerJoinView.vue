<template>
  <header>
    <div>
      <img class="muteButton" @click="toggleMute" :src="buttonImage" alt="Toggle Mute" />
    </div>
  </header>
  <div class="arrow">
    <router-link to="/"> <img id="arrow" src="/img/arrow.png"></router-link>
  </div>

  <main>
    <section>
      <img id="brake" src="/img/brake.png">
      <h1 id="heading">
        {{ uiLabels.joinQuiz }}
      </h1>
      <div>
        <input type="text" id="gamecode" v-model="gamecode" :placeholder="uiLabels.enterCode">
      </div>
    </section>
    <div>
      <button id="joinbutton" v-on:click="addGameCode" :class="{ 'green-button': gamecode !== '' }"> {{ uiLabels.joinQuiz
      }} </button>
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
const socket = io(sessionStorage.getItem("localhost"));

export default {
  name: 'PlayerJoinView',
  components: {
    AlertComponent,
  },
  data: function () {
    return {
      gamecode: "",
      pollId: "inactive poll",
      uiLabels: {},
      data: {},
      lang: localStorage.getItem("lang") || "en",
      alertContentText: "",
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
    this.pollId = this.$route.params.id
    socket.emit('joinPoll', this.pollId);
    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels
    });
    const isMuted = sessionStorage.getItem("isMuted");
    if (isMuted) {
      this.isMuted = JSON.parse(isMuted);
    }
  },
  methods: {
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
    addGameCode: async function () {
      const fetchData = () => {
        return new Promise((resolve) => {
          socket.emit("getPoll", this.gamecode);
          socket.on("fullPole", (data) => {
            this.data = data;
            resolve();
          });
        });
      };
      try {
        await fetchData();
        if (this.gamecode === '') {
          this.alertContentText = this.uiLabels.gameCodeAlert;
          this.$refs.alertComponent.openAlert();
        } else if (Object.keys(this.data).length === 0) {
          this.alertContentText = this.uiLabels.gameCodeAlert;
          this.$refs.alertComponent.openAlert();
        } else {
          this.pollId = this.gamecode;
          this.$router.push('/playername/' + this.pollId);
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
  margin-top: -5.15vw;
  width: 15vw;
}
#arrow {
    margin-left: -94vw;
    margin-top: 2vw;
  }

#joinbutton {
  margin: -8vw;
}

#gamecode {
  font-size: 90%;
  padding: 2vw;
  font-weight: bold;
  width: 15vw;
  margin-bottom: 5vw;
  margin-top: 2vw;
}

#gamecode::placeholder {
  font-size: 100%;
  color: #999;
  text-align: center;
}

#heading {
  margin-bottom: 1vw;
}

@media screen and (max-width:800px) {

  .muteButton {
    margin-top: 3vw;
  }

  #arrow {
    margin-left: -86vw;
    margin-top: 2vw;
  }

  h1 {
    margin-top: 10vw;
  }

  #brake {
    margin-top: -5.5vw;
    width: 30vw;
  }

  #joinbutton {
    font-size: 7vw;
    color: white;
    border: 2px solid black;
    padding: 5vw;
    margin: 5vw;
    margin-top: 20vw;
  }

  #gamecode {
    margin-top: 20vw;
    padding: 5vw;
    font-weight: bold;
    font-size: 200%;
    width: 50%;
  }

  #gamecode::placeholder {
    font-size: 3vw;
    color: #999;
    text-align: center;
  }

  #heading {
    margin-bottom: 1vw;
    font-size: 13vw;
  }
}
</style>
