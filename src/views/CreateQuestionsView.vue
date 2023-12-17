<template>
  <div class="arrow">
    <button @click="goBack()">
      <router-link to="/create/"><button id="goBack"> <img id="arrow" src="/img/arrow.png" style="width: 3vw;">
        </button></router-link>
    </button>
  </div>
  <div class="poll">
    <div class="gameInfo a"> {{ uiLabels.city1 }}
      <input class="fillInfo" type="text" rows="2"/>
    </div>
    <div class="gameInfo b"> {{ uiLabels.clue1 }}
      <textarea class="fillInfo" v-model="clue1" rows="2"></textarea>
    </div>
    <div class="gameInfo c"> {{ uiLabels.clue2 }}
      <textarea class="fillInfo" v-model="clue2" rows="2"></textarea>
    </div>
    <div class="gameInfo d"> {{ uiLabels.clue3 }}
      <textarea class="fillInfo" v-model="clue3" rows="2"></textarea>
    </div>
    <div class="gameInfo f">
      <button class="addTown" v-on:click="addQuestion"> {{
        uiLabels.addTown }} <img id="greentick" src="/img/greentick.png" style="width: 1.5vw; height: 1.5vw"></button>
    </div>
    <div v-if="Object.keys(submittedCities2).length > 0" class="right-section">
      <div id="title">
        {{ uiLabels.myCities }}
      </div>
      <hr>
      <div v-for="(cityName, cityData) in submittedCities2" :key="cityName">
        <p>
          <img id="redCrossRemove" src="/img/redcross.png" style="width: 1.2vw; height:1.2vw" v-on:click="removeCity(cityData)">
        <div id="city">{{ uiLabels.city }} <div id="info"> {{ cityData }}</div></div>
        <div id="clue"> {{ uiLabels.clues }} </div> <div id="info"> {{
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
    }
  },
  computed: {
    areFieldsFilled: function () {
      return this.city && this.clue1 && this.clue2 && this.clue3;
    },
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
  height: 1vw;
  width: 30vw;
  margin-top: 1.7vw;
  border-color: black;
  border-top: 1vw;
  border-left: 1vw;
  border-right: 1vw;
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
  margin-left: 11.5vw;
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

.right-section {
  grid-row-start: 1;
  grid-column-start: 4;
  font-size: 1.2vw;
  width: 20vw;
  height: 31vw;
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

.infofromviewbefore {
  grid-row-start: 6;
  grid-column-start: 1;
}

.createbutton:hover {
  cursor: pointer;
  background-color: green;
}

.createbutton {
  font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
  font-size: 1vw;
  color: white;
  background-color: gray;
  border: 0.2vw solid black;
  padding: 2vw;
  border-radius: 1vw;
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

.arrow {
  background-color: rgb(163, 163, 243);
  text-align: left;
  padding: 1vw 0 0 1vw;
}

.arrow button {
  background-color: rgb(163, 163, 243);
  border: 1px solid rgb(163, 163, 243);
}

.earth {
  width: 10vw;
  grid-column-start: 3;
  grid-row-start: 1;

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
margin-left: 18vw;
margin-top: -1vw;
}
#info{
  color: gray;
}
</style>