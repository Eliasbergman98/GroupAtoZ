<template>
  <header>
    <div>
      <img class="muteButton" @click="toggleMute" :src="buttonImage" alt="Toggle Mute" />
    </div>
  </header>
  
  <div class="arrow">
    <router-link to="/create/"><button id="goBack"> <img id="arrow" src="/img/arrow.png"> </button></router-link>
  </div>

  <div class="poll">
    <div class="gameInfo a">
      <div id="title"> {{ uiLabels.city1 }} </div>
      <input class="fillInfo" v-model="city" type="text" />
    </div>
    <div class="gameInfo b">
      <div id="title"> {{ uiLabels.clue1 }} </div>
      <textarea class="fillInfo" v-model="clue1" rows="2"></textarea>
    </div>
    <div class="gameInfo c">
      <div id="title"> {{ uiLabels.clue2 }} </div>
      <textarea class="fillInfo" v-model="clue2" rows="2"></textarea>
    </div>
    <div class="gameInfo d">
      <div id="title"> {{ uiLabels.clue3 }} </div>
      <textarea class="fillInfo" v-model="clue3" rows="2"></textarea>
    </div>
    <div class="gameInfo f">
      <button class="addTown" v-on:click="addQuestion"> {{
        uiLabels.addTown }} <img id="greentick" src="/img/greentick.png"></button>
    </div>
    <div v-if="Object.keys(submittedCities2).length > 0" class="right-section">
      <div id="title">
        {{ uiLabels.myCities }}
      </div>
      <hr>
      <div v-for="(cityName, cityData) in submittedCities2" :key="cityName">
        <p>
          <img id="redCrossRemove" src="/img/redcross.png "
            v-on:click="removeCity(cityData)">
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
      <button class="createbutton" v-on:click="sendInfo"> {{ uiLabels.createGame }} </button>
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
import avatar from '../assets/avatar.json';
const socket = io("localhost:3000");

export default {
  name: 'CreateQuestions',
  components: {
    AlertComponent,
  },
  data: function () {
    return {
      showRightSection: false,
      lang: localStorage.getItem("lang") || "en",
      pollId: "",
      question: "",
      answers: ["", ""],
      questionNumber: 0,
      data: {},
      uiLabels: {},
      selectedAvatar: null,
      avatars: avatar,
      quizName: "",
      city: "",
      clue1: "",
      clue2: "",
      clue3: "",
      alertContentText: "",
      inCreateQuestionsView: true,
      // Separate variables to hold submitted data
      // submittedCities: [], 
      submittedCities2: {},
      isMuted: false,
      showMysteryButton: true,
    }
  },
  computed: {
    areFieldsFilled: function () {
      return this.city && this.clue1 && this.clue2 && this.clue3;
    },
    buttonImage() {
      return this.isMuted ? pressToMuteImage : pressToUnmuteImage;
    }
  },

  created: function () {
    this.pollId = this.$route.params.pollId;
    this.selectedAvatarUrl = this.avatarUrl;

    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels;
    });

    socket.on("dataUpdate", (data) =>
      this.data = data);

    console.log("Updated quizName:", this.pollId)
    socket.emit("getPoll", this.pollId);
    socket.on("pollCreated", (data) => console.log("pollId created in createquestion:", data));
    socket.on("fullPole", (data) => {
      console.log("in createquest", this.pollId)
      this.data = data;
    });

  },
  methods: {
    createPoll: function () {
      socket.emit("createPoll", { pollId: this.pollId, lang: this.lang, selectedAvatar: this.selectedAvatarUrl })
    },
    addPollName: function () {
      this.pollNameId.push("");
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
    sendInfo: function () {
      if (Object.keys(this.submittedCities2).length === 0) {
        this.alertContentText = this.uiLabels.emptyGameAlert;
        this.$refs.alertComponent.openAlert();
      }
      else {
        this.alertContentText = this.uiLabels.createGameAlert;
        this.yesText = this.uiLabels.yesHeading;
        this.noText = this.uiLabels.noHeading;
        this.$refs.alertComponent.openAlert(this.inCreateQuestionsView, this.pollId, this.yesText, this.noText);
      }
    },
    addQuestion: function () {
      if (!this.areFieldsFilled) {
        this.alertContentText = this.uiLabels.emptyCityAlert;
        this.$refs.alertComponent.openAlert();
        return;
      }
      if (Object.keys(this.submittedCities2).length >= 5) {
        this.alertContentText = this.uiLabels.maxCitiesAlert;
        this.$refs.alertComponent.openAlert();
        return;
      }
      else {
        socket.emit("addQuestion", {
          //vill emit dessa som nyckel-stad och värden-clues?
          pollId: this.pollId,
          city: this.city,
          clue1: this.clue1,
          clue2: this.clue2,
          clue3: this.clue3
        });
        console.log("emitting city info:", this.pollId,
          this.city,
          this.clue1,
          this.clue2,
          this.clue3)
      }
      if (!this.submittedCities2[this.city]) {
        this.submittedCities2[this.city] = [];
        this.submittedCities2[this.city].push(
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
    addAnswer: function () {
      this.answers.push("");
    },
    runQuestion: function () {
      socket.emit("runQuestion", { pollId: this.pollId, questionNumber: this.questionNumber })
    },
    selectAvatar(index) {
      this.selectedAvatar = index;
      console.log(this.data.selectedAvatar)
    },
    removeCity: function (cityData) {
      this.city = cityData;
      console.log(this.submittedCities2, "INNAN")
      socket.emit("removeCity", { pollId: this.pollId, city: this.city });
      // Remove the city from the local submittedCities2 object
      delete this.submittedCities2[cityData];
      console.log(this.submittedCities2, "EFTER")
      console.log("stadnamn", this.city);


    }


  },
}

</script>
  
<style scoped>
.fillInfo {
  height: 2vw;
  width: 30vw;
  margin-top: 1.7vw;
  border-color: black;
  border-top: 1vw;
  border-left: 1vw;
  border-right: 1vw;
  max-height: 6vh;
  max-width: 30vw;
  margin-left: 1vw;
  font-size: 1.4vw;
  background-color: rgb(201, 241, 244);
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}

#saveButton {
  font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
  font-size: 1.5vw;
  color: white;
  background-color: green;
  border: 2px solid black;
  padding: 1vw;
  border-radius: 2px;
}

.poll {
  position: relative;
  display: grid;
  grid-template-columns: 30vw 30vw 7vw;
  grid-template-rows: 7vw 7vw 7vw 7vw 7vw;
  background-color: rgb(163, 163, 243);
  grid-gap: 1vw;
  background-size: cover;
}


.gameInfo {
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  width: 30vw;
  height: 1vw;
  text-align: left;
  position: left;
  border-radius: 20px;

}

.a,
.b,
.c,
.d {
  padding: 10em auto 2em 2em;
  text-align: left;
  padding-left: 5vw;
  font-size: 2vw;
  width: 50vw;
  height: 5vw;
  background-size: cover;
  background-color: rgb(201, 241, 244);
  border: 2px solid black;
  margin-left: 10vw;
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
  padding: 10vw auto 2vw 2vw;
  text-align: center;
  font-size: 3vw;
  width: 55vw;
  height: 5vw;
  background-size: cover;
  background-color: rgb(201, 241, 244);
  margin-left: 10vw;
}
#greentick{
  height: 1.2vw;
  width: 1.2vw;
}
.right-section {
  grid-row-start: 1;
  grid-column-start: 4;
  font-size: 1.2vw;
  width: 20vw;
  height: 21vw;
  background-size: cover;
  background-color: rgb(201, 241, 244);
  border: 0.2vw solid black;
  border-radius: 20px;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  font-style: oblique;
  overflow-y: auto;
}

.right-section::-webkit-scrollbar {
  width: 0.5em;
}

.right-section::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0);
}

.createbutton:hover {
  cursor: pointer;
  background-color: green;
}

.addTown:hover {
  cursor: pointer;
  background-color: green;
}

.addTown {
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  width: 100%;
  height: 100%;
  text-align: center;
  font-size: 2vw;
  background-color: rgb(201, 241, 244);
  border: 2px solid black;
  border-radius: 20px;
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
  margin-left: 18vw;
  margin-top: -1vw;
}

#info {
  color: gray;
}

#title {
  padding-top: 2vh;
}
@media screen and (max-width: 800px) {
  .poll {
  position: relative;
  display: grid;
  grid-template-columns: 39vw 39vw 9.1vw;
  grid-template-rows: 10vw 10vw 10vw 10vw 5vw 50vw 14vw;
  background-color: rgb(163, 163, 243);
  grid-gap: 6vw;
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
  height: 10vw;
  background-size: cover;
  background-color: rgb(201, 241, 244);
  border: 2px solid black;
  margin-left: 10vw;
  display: flex;
  overflow: hidden;
}

.addTown {
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  width: 100%;
  height: 100%;
  text-align: center;
  font-size: 4vw;
  background-color: rgb(201, 241, 244);
  border: 2px solid black;
  border-radius: 20px;
}

.f {
  padding: 10vw auto 2vw 2vw;
  text-align: center;
  font-size: 4vw;
  width: 80vw;
  height: 10vw;
  background-size: cover;
  background-color: rgb(201, 241, 244);
  margin-left: 10vw;
}
.fillInfo {
  height: 5vw;
  width: 35vw;
  margin-top: 1.7vw;
  border-color: black;
  border-top: 1vw;
  border-left: 1vw;
  border-right: 1vw;
  max-height: 6vh;
  max-width: 30vw;
  margin-left: 1vw;
  font-size: 2.8vw;
  background-color: rgb(201, 241, 244);
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}
.e {
  grid-row-start: 7;
  grid-column-start: 1;
  margin-left: 4.5vw;
  width: 80vw;
}
.createbutton{
  height: 10vh;
  width: 50vw;
  font-size: 4vh;
  margin-left: 20vw;
  margin-top: 10vw;
}
.right-section {
  grid-row-start: 6;
  grid-column-start: 1;
  font-size: 2.4vw;
  margin-left: 30vw;
  margin-top: 3vw;
  width: 40vw;
  height: 58vw;
  background-size: cover;
  background-color: rgb(201, 241, 244);
  border: 0.2vw solid black;
  border-radius: 20px;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  font-style: oblique;
  overflow-y: auto;
}
  #greentick{
    width: 3vw;
    height: 3vw;
  }
#redCrossRemove{
  height: 3vw;
  width: 3vw;
  position: relative;
  top: 3vh;
  right: 10vw;
}


}</style>