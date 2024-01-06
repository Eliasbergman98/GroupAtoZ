<template>
  <header>
    <div>
      <img class="muteButton" @click="toggleMute" :src="buttonImage" alt="Toggle Mute" />
    </div>
  </header>
  <div class="arrow">
    <router-link to="/create/"> <img id="arrow" src="/img/arrow.png"></router-link>
  </div>
  <h1>
    {{ uiLabels.createYourGame }}
  </h1>
  <div class="game">
    <div class="gameInfo a">
      <div id="title"> {{ uiLabels.city1 }} </div>
      <input class="fillInfo" v-model="city" name="cityname" type="text" />
    </div>
    <div class="gameInfo b">
      <div id="title"> {{ uiLabels.clue1 }} </div>
      <textarea class="fillInfo" v-model="clue1" name="clue1" rows="2" maxlength="50"></textarea>
    </div>
    <div class="gameInfo c">
      <div id="title"> {{ uiLabels.clue2 }} </div>
      <textarea class="fillInfo" v-model="clue2" name="clue2" rows="2" maxlength="50"></textarea>
    </div>
    <div class="gameInfo d">
      <div id="title"> {{ uiLabels.clue3 }} </div>
      <textarea class="fillInfo" v-model="clue3" name="clue3" rows="2" maxlength="50"></textarea>
    </div>
    <div class="gameInfo f">
      <button class="addTown" v-on:click="addCity"
        :class="{ 'green-button': city !== '' && clue1 !== '' && clue2 !== '' && clue2 !== '' && clue3 !== '' }"> {{
          uiLabels.addTown }} <img id="greentick" src="/img/greentick.png"></button>
    </div>
    <div class="right-section">
      <div id="title">
        {{ uiLabels.myCities }}
      </div>
      <hr>
      <div v-if="Object.keys(submittedCities).length == 0">
        <br>
        {{ uiLabels.placeholderCities }}
      </div>
      <div v-for="(cityName, cityData) in submittedCities" :key="cityName">
        <p>
          <img id="redCrossRemove" src="/img/redcross.png " v-on:click="removeCity(cityData)">
        <div id="city">{{ uiLabels.city }} <div id="info"> {{ cityData }}</div>
        </div>
        <div id="clue"> {{ uiLabels.clues }} </div>
        <div id="info"> {{
          cityName[0] }}, {{ cityName[1] }}, {{ cityName[2] }}</div>
        </p>
        <hr>
      </div>
    </div>
    <div class="gameInfo e">
      <button id="createbutton" v-on:click="sendInfo"
        :class="{ 'green-button': Object.keys(submittedCities).length > 0 }"> {{ uiLabels.createGame }} </button>
      <AlertComponent ref="alertComponent" :alertContentText="alertContentText"
        :inCreateQuestionsView="inCreateQuestionsView">
      </AlertComponent>
    </div>
  </div>
</template>
  
<script>

import AlertComponent from '@/components/AlertComponent.vue';
import io from 'socket.io-client';
import pressToMuteImage from "/img/soundon.png";
import pressToUnmuteImage from "/img/soundoff.png";
const socket = io(sessionStorage.getItem("localhost"));

export default {
  name: 'CreateQuestions',
  components: {
    AlertComponent,
  },
  data: function () {
    return {
      lang: localStorage.getItem("lang") || "en",
      gameId: "",
      uiLabels: {},
      city: "",
      clue1: "",
      clue2: "",
      clue3: "",
      alertContentText: "",
      inCreateQuestionsView: true,
      // Separate variables to hold submitted data
      submittedCities: {},
      isMuted: false,
      showMysteryButton: true,
    }
  },
  computed: {
    areFieldsFilled: function () {
      return this.city && this.clue1 && this.clue2 && this.clue3;
    },
    buttonImage() {
      return this.isMuted ? pressToUnmuteImage : pressToMuteImage; 
    }
  },

  created: function () {
    this.gameId = this.$route.params.gameId;
    this.selectedAvatarUrl = this.avatarUrl;

    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels;
    });
    // Check sessionStorage for muted state
    const isMuted = sessionStorage.getItem("isMuted");
    if (isMuted) {
      this.isMuted = JSON.parse(isMuted);
    }
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
      sessionStorage.setItem("isMuted", JSON.stringify(this.isMuted));

    },
    sendInfo: function () {
      if (Object.keys(this.submittedCities).length === 0) {
        this.alertContentText = this.uiLabels.emptyGameAlert;
        this.$refs.alertComponent.openAlert();
      }
      else {
        this.alertContentText = this.uiLabels.createGameAlert;
        this.yesText = this.uiLabels.yesHeading;
        this.noText = this.uiLabels.noHeading;
        this.$refs.alertComponent.openAlert(this.inCreateQuestionsView, this.gameId, this.yesText, this.noText);
      }
    },
    addCity: function () {
      for (let i = 0; i < Object.keys(this.submittedCities).length; i++) {
        if (this.city.toLowerCase() === Object.keys(this.submittedCities)[i].toLowerCase()) {
          this.alertContentText = this.uiLabels.sameCityAlert;
          this.$refs.alertComponent.openAlert();
          return;
        }
      }
      if (!this.areFieldsFilled) {
        this.alertContentText = this.uiLabels.emptyCityAlert;
        this.$refs.alertComponent.openAlert();
        return;
      }
      if (Object.keys(this.submittedCities).length >= 5) {
        this.alertContentText = this.uiLabels.maxCitiesAlert;
        this.$refs.alertComponent.openAlert();
        return;
      }
      else {
        socket.emit("addCity", {
          gameId: this.gameId,
          city: this.city,
          clue1: this.clue1,
          clue2: this.clue2,
          clue3: this.clue3
        });
      }
      if (!this.submittedCities[this.city]) {
        this.submittedCities[this.city] = [];
        this.submittedCities[this.city].push(
          this.clue1,
          this.clue2,
          this.clue3
        );
        this.city = "";
        this.clue1 = "";
        this.clue2 = "";
        this.clue3 = "";
      }
    },
    removeCity: function (cityData) {
      this.city = cityData;
      socket.emit("removeCity", { gameId: this.gameId, city: this.city });
      delete this.submittedCities[cityData];
      this.city = "";

    }


  },
}
</script>
  
<style scoped>
h1 {
  font-size: 5vw;
  margin-top: 1.5vw;
}

.fillInfo {
  font-family: Helvetica, Arial, sans-serif;
  height: 2vw;
  width: 25vw;
  margin-top: 1.5vw;
  border-color: black;
  border-top: 0.5vw;
  border-left: 1vw;
  border-right: 1vw;
  max-height: 2vw;
  max-width: 20vw;
  margin-left: 1vw;
  font-size: 1.4vw;
  background-color: rgb(201, 241, 244);
}

.game {
  margin-top: 2vw;
  position: relative;
  display: grid;
  grid-template-columns: 30vw 30vw 7vw;
  grid-template-rows: 7vw 7vw 7vw 7vw 7vw;
  background-size: cover;
}


.gameInfo {
  width: 30vw;
  height: 1vw;
  text-align: left;
  position: left;
  border-radius: 2vw;

}

.a {
  padding: 10em auto 2em 2em;
  text-align: left;
  padding-left: 5vw;
  font-size: 1.5vw;
  width: 40vw;
  height: 5vw;
  background-size: cover;
  background-color: rgb(201, 241, 244);
  border: 2px solid black;
  margin-left: 6vw;
  display: flex;
  overflow: hidden;
}

.b,
.c,
.d {
  text-align: left;
  padding-left: 5vw;
  font-size: 1.5vw;
  width: 40vw;
  height: 5vw;
  background-size: cover;
  background-color: rgb(201, 241, 244);
  border: 2px solid black;
  margin-left: 6vw;
  display: flex;
  overflow: hidden;
}

.a {
  grid-row-start: 1;
  grid-column-start: 1;
}

.b {
  grid-row-start: 2;
  grid-column-start: 1;
}

.c {
  grid-row-start: 3;
  grid-column-start: 1;
}

.d {
  grid-row-start: 4;
  grid-column-start: 1;
}

.e {
  grid-row-start: 5;
  grid-column-start: 4;
  margin-left: 4.5vw;
  width: 2vw;
}

.f {
  grid-row-start: 5;
  grid-column-start: 1;
}

#greentick {
  height: 1.2vw;
  width: 1.2vw;
}

.right-section {
  grid-row-start: 1;
  grid-column-start: 3;
  font-size: 1.2vw;
  width: 40vw;
  height: 25.8vw;
  background-size: cover;
  background-color: rgb(201, 241, 244);
  border: 2px solid black;
  border-radius: 2vw;
  font-style: oblique;
  overflow-y: auto;
  margin-left: -5vw;
}

.right-section::-webkit-scrollbar {
  width: 0.5em;
}

.right-section::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0);
}

.addTown {
  grid-row-start: 5;
  grid-column-start: 1;
  /* margin-top: 60vh; */
  margin-left: 34vw;
  width: 10em;

}

#createbutton {
  margin-left: 8vw;
}

#arrow {
  position: absolute;
  top: -0.2vw;
}

#title {
  font-weight: bolder;
  font-size: larger;
}

#city {
  font-weight: bolder;
}

#clue {
  font-weight: bolder;

}

.right-section p {
  display: flex;
  flex-direction: column;
}

#redCrossRemove {
  height: 1.2vw;
  width: 1.2vw;
  margin-left: 38vw;
  margin-top: -2vh;
}

#info {
  color: gray;
}

#title {
  padding-top: 2vw;
}

.muteButton {
  margin-top: -1vw;

}

@media screen and (max-width: 1000px) {

  .muteButton {
    position: absolute;
    width: 5vw;
    height: 5vw;
    padding: 0.5vw 0 0 0.5vw;
    margin-top: -9vw;
    margin-left: 40vw;
  }

  #arrow {
    text-align: left;
    width: 7vw;
    height: 7vw;
    margin-left: -47vw;
    margin-top: 1vw;
  }

  .arrow button {
    border: 1px solid rgb(163, 163, 243);
    text-align: left;
  }

  h1 {
    margin-top: 10vw;
    font-size: 8vw;
  }

  .game {
    position: relative;
    display: grid;
    grid-template-columns: 39vw 39vw 9.1vw;
    grid-template-rows: 17vw 17vw 17vw 17vw 5vw 50vw 14vw;
    grid-gap: 6vw;
    margin-top: 5vw;
    background-size: cover;

  }

  .a,
  .b,
  .c,
  .d {
    padding: 10em auto 2em 2em;
    text-align: left;
    padding-left: 5vw;
    padding-top: 2vw;
    font-size: 4vw;
    width: 75vw;
    height: 15vw;
    background-size: cover;
    border: 2px solid black;
    margin-left: 10vw;
    margin-top: 5vw;
    display: flex;
    overflow: hidden;
  }

  .f {
    margin-top: 5vw;
  }

  .fillInfo {
    height: 5vw;
    width: 35vw;
    margin-top: 1.7vw;
    border-color: black;
    border-top: 1vw;
    border-left: 1vw;
    border-right: 1vw;
    max-height: 6vw;
    max-width: 30vw;
    margin-left: 1vw;
    font-size: 2.8vw;
    background-color: rgb(201, 241, 244);
  }

  .e {
    grid-row-start: 7;
    grid-column-start: 1;
    margin-left: 4.5vw;
    width: 80vw;
  }

  #createbutton {
    height: 11vh;
    width: 50vw;
    font-size: 4vh;
    margin-left: 20vw;
    margin-top: 55vw;
    margin-bottom: 5vw;
  }

  .addTown {
    height: 10vh;
    width: 50vw;
    font-size: 4vh;
    margin-left: 24.5vw;
  }

  .right-section {
    grid-row-start: 6;
    grid-column-start: 1;
    font-size: 2.4vw;
    margin-left: 10vw;
    margin-top: 35vw;
    width: 80vw;
    height: 70vw;
    background-size: cover;
    background-color: rgb(201, 241, 244);
    border: 0.2vw solid black;
    border-radius: 20px;
    font-style: oblique;
    overflow-y: auto;
  }

  #greentick {
    width: 3vw;
    height: 3vw;
  }

  #redCrossRemove {
    height: 3vw;
    width: 3vw;
    position: relative;
    top: 1vw;
    right: -38vw;
  }


}
</style>