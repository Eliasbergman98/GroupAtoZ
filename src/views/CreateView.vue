<template>
    <header>
    <div>
      <img class="muteButton" @click="toggleMute" :src="buttonImage" alt="Toggle Mute"/>
    </div>
  </header>
  
  <div class="arrow">
    <router-link to="/"><button id="goBack"> <img id="arrow" src="/img/arrow.png" style="width: 3vw;"> </button></router-link>
  </div>
  <h1>
    {{ uiLabels.heading }}
  </h1>
  {{ pollId }}
  <div class="poll">
    <div class="gameInfo a">
      <!--Poll link: 
    <input type="text" v-model="pollId">
    <button v-on:click="createPoll">
      Save gameID 
    </button> <br> <br> -->
    <div id="gameName">
      {{ uiLabels.chooseName }} </div>
      <input v-model="quizName" class="addQuizName" type="text" :placeholder="uiLabels.enterGameName">
    </div>
    <!-- <div class ="earth">
      <img id="earth" src="/img/earth.png" style="width: 180px;">
    </div> -->
    <div class="gameInfo b">
      {{ uiLabels.chooseAvatar }} <br>
      <div id="avatarZone">
      <img class="avatar">
      <button v-for="(avatar, index) in avatars" :key="index" @click="selectAvatar(index)"
        :class="{ 'selected': selectedAvatar === index }">
        <img class="emojies" v-bind:src="avatar.url" alt="😄" >
      </button>
    </div>
    </div>
    <div class="gameInfo c">
      <button class="createbutton" v-on:click="createPoll" > {{ uiLabels.createGame }}</button>
      <AlertComponent ref="alertComponent" :alertContentText="alertContentText">
      </AlertComponent>
    </div>
  </div>
 
</template>

<script>
import io from 'socket.io-client';
import avatar from '../assets/avatar.json';
import pressToMuteImage from "/img/soundon.png";
import pressToUnmuteImage from "/img/soundoff.png";
import AlertComponent from '@/components/AlertComponent.vue';
const socket = io("localhost:3000");

export default {
  name: 'CreateView',
  components: {
    AlertComponent,
  },
  data: function () {
    return {
      lang: localStorage.getItem("lang") || "en",
      pollId: "",
      quizName: '',
      question: "",
      answers: ["", ""],
      questionNumber: 0,
      data: {},
      uiLabels: {},
      selectedAvatar: null,
      avatars: avatar,
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
    
    this.id = this.$route.params.id;

    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels
    })
    socket.on("dataUpdate", (data) =>
      this.data = data
    )
    socket.on("pollCreated",  (data) => console.log("pollId created:", data))
  },
  methods: {
    createPoll: function () {
      if(this.quizName === '' || this.selectedAvatar === null){
        this.alertContentText = this.uiLabels.nameAvatarAlert;
        this.$refs.alertComponent.openAlert();
      }
      else{
    this.pollId = Math.floor(Math.random()*10000);
      socket.emit("createPoll", { pollId: this.pollId, lang: this.lang, quizName: this.quizName, selectedAvatar: this.selectedAvatarUrl })
      this.$router.push('/createquestions/' + this.pollId);
      }
    },
    addQuestion: function () {
      socket.emit("addQuestion", { pollId: this.pollId, q: this.question, a: this.answers })
    },
    addAnswer: function () {
      this.answers.push("");
    },
    runQuestion: function () {
      socket.emit("runQuestion", { pollId: this.pollId, questionNumber: this.questionNumber })
    },
    selectAvatar(index) {
      this.selectedAvatar = index;
      this.avatars.name = "avatar" +index;
      this.selectedAvatarUrl = this.avatars[index].url;
      console.log(this.avatars.name)
      console.log("selected avatar URL:", this.selectedAvatarUrl);
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
.poll {
  position: relative;
  display: grid;
  grid-template-columns: 24vw 26vw 30w;
  grid-template-rows: 5vw 5vw 10vw;
  background-color: rgb(163, 163, 243);
  grid-gap: 4vw;
  background-size: cover;
}


.gameInfo {
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    width: 50vw;
    height: 20vw;
    text-align: left;
    position: left;
    border-radius: 2vw; 
}

.a {
  grid-row-start: 1;
    grid-column-start: 1;
    font-size: 2vw;
    width: 50vw;
    height: 5vw;
    background-size: cover;
    background-color: rgb(201, 241, 244);
    border: 2px solid black;
    margin-left: 24vw;
    display: flex;
    
}

.b {
  grid-row-start: 2;
  grid-column-start: 1;
  text-align: center;
  font-size: 2vw;
  width: 50vw;
  height: 21vh;
  background-size: cover;
  background-color: rgb(201, 241, 244);
  border: 2px solid black;
  margin-left: 24vw;
  padding-top: 2vw;
  padding-bottom: 5vw;
}
#avatarZone{
  width: 75%;
  margin-left: 12.5%;
  margin-top: 3vh;
}
.c{
  grid-row-start: 2;
  grid-column-start: 3;
  margin-top: 23vh;
  width: 10vw;
  height: 2vh;
  margin-left: -12vw;
}

.createbutton:hover, #addQuizNameBtn:hover {
  cursor: pointer;
  background-color: green;
}

.selected {
  background-color: green;

}
#gameName{
  font-weight: bold;
    font-size: 2vw;
    margin-left: 0.5vw;
    padding-top: 1vw;
    padding-left: 1vw;
}

.addQuizName{
    font-weight: bold;
    font-size: 1.2vw;
    background-color: inherit;
    border: none;
    margin-top: 0.8vw;
    width: 73%;
    height: 60%;
    margin-left: 0.5vw;
}

.arrow{
  background-color: rgb(163, 163, 243);
  text-align: left;
  padding: 1vw 0 0 1vw;
}
.arrow button{
  background-color: rgb(163, 163, 243);
  border: 1px solid rgb(163, 163, 243);
}

.emojies{
  width: 2vw;
  height: 2vw;
}

#addQuizName::placeholder {
    color: gray;
}
#title{
  padding-top: 4vh;
}

@media screen and (max-width: 800px) {
h1{
  font-size: 12vw;

}
.a{
  margin-left: 5vw;
  width: 90vw;
  height: 10vw;
}
#gameName{
font-size: 6vw;
margin-bottom: 1vw;
}
.addQuizName{
  font-size: 4vw;
  height: 5vw;
  padding-top: 2vw;
}

.b{
  margin-top: 10vw;
  width: 90vw;
  margin-left: 5vw;
  font-size: 8vw;
  height: 50vh;
  min-height: 60vh;
}
.emojies{
  height: 7vw;
  width: 7vw;
  margin-top: 1vw;
  margin-left: 1vw;
}
.c{
  grid-row-start: 16;
  grid-column-start: 1;
  margin-left: 25vw;
  
}
.createbutton{
  height: 10vh;
  width: 50vw;
  font-size: 5vh;
  margin-bottom: 2vh;
}
}
</style>