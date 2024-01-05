<template>
  <header>
    <div>
      <img class="muteButton" @click="toggleMute" :src="buttonImage" alt="Toggle Mute" />
    </div>
  </header>

  <div class="arrow">
    <router-link to="/"> <img id="arrow" src="/img/arrow.png">
    </router-link>
  </div>
  <h1>
    {{ uiLabels.createYourGame }}
  </h1>
  {{ pollId }}
  <div class="poll">
    <div class="gameInfo a">
      <div id="gameName">
        {{ uiLabels.chooseName }} </div>
      <input v-model="quizName" class="addQuizName" name="quizname" type="text" :placeholder="uiLabels.enterGameName"
        maxlength="15">
    </div>
    <div class="gameInfo b">
      {{ uiLabels.chooseAvatar }} <br>
      <div id="avatarZone">
        <div v-for="(avatarRow, rowIndex) in Math.ceil(avatars.length / 8)" :key="rowIndex" class="avatar-row">
          <button v-for="(avatar, colIndex) in avatars.slice(rowIndex * 8, (rowIndex + 1) * 8)" :key="colIndex"
            @click="selectAvatar(rowIndex * 8 + colIndex)"
            :class="{ 'selected': selectedAvatar === rowIndex * 8 + colIndex }">
            <img class="emojis" v-bind:src="avatar.url">
          </button>
        </div>
      </div>
    </div>
    <div class="gameInfo c">
      <button id="createbutton" v-on:click="createPoll" :class="{ 'green-button': quizName !== '' && selectedAvatar !== null }"> {{ uiLabels.next }}</button>
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
const socket = io(sessionStorage.getItem("localhost"));

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
      // data: {},
      uiLabels: {},
      selectedAvatar: null,
      avatars: avatar,
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
    this.id = this.$route.params.id;

    socket.on("init", (labels) => {
      this.uiLabels = labels
    })
    socket.emit("pageLoaded", this.lang);
    //socket.on("pollCreated", (data) => console.log("pollId created in createview:", data))     TA INTE BORT DENNA
    // Check sessionStorage for muted state
    const isMuted = sessionStorage.getItem("isMuted");
    if (isMuted) {
      this.isMuted = JSON.parse(isMuted);
    }
  },
  methods: {
    createPoll: function () {
      if (this.quizName === '' || this.selectedAvatar === null) {
        this.alertContentText = this.uiLabels.nameAvatarAlert;
        this.$refs.alertComponent.openAlert();
      }
      else {
        this.pollId = Math.floor(Math.random() * 100000);
        socket.emit("createPoll", { pollId: this.pollId, lang: this.lang, quizName: this.quizName, selectedAvatar: this.selectedAvatarUrl })
        this.$router.push('/createquestions/' + this.pollId);
      }
    },
    selectAvatar(index) {
      this.selectedAvatar = index;
      this.avatars.name = "avatar" + index;
      this.selectedAvatarUrl = this.avatars[index].url;
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
h1 {
  margin-top: 2vw;
  font-size: 5vw;
}

.poll {
  top: 5vw;
  position: relative;
  display: grid;
  grid-template-columns: 24vw 26vw 30vw;
  grid-template-rows: 5vw 5vw 10vw;
  grid-gap: 1vw;
  background-size: cover;
  margin-top: -6vw;
}

.gameInfo {
  width: 50vw;
  height: 20vw;
  text-align: left;
  position: left;
  border-radius: 2vw;
}

.a {
  margin-top: -7vw;
  grid-row-start: 2;
  grid-column-start: 1;
  font-size: 2vw;
  width: 50vw;
  height: 5vw;
  background-size: cover;
  background-color: rgb(201, 241, 244);
  border: 2px solid black;
  margin-left: 25vw;
  display: flex;

}

.b {
  margin-top: -1vw;
  grid-row-start: 2;
  grid-column-start: 1;
  text-align: center;
  font-size: 2vw;
  width: 50vw;
  height: 15vw;
  background-size: cover;
  background-color: rgb(201, 241, 244);
  border: 2px solid black;
  margin-left: 25vw;
  padding-top: 2vw;
  padding-bottom: 4vw;
}

#avatarZone {
  width: 90%;
  margin-left: 5%;
  margin-top: 1vw;
}

.c {
  grid-row-start: 2;
  grid-column-start: 3;
  margin-top: 20vw;
  width: 10vw;
  height: 2vh;
  margin-left: 8vw;
}

.selected {
  background-color: green;
}

.emojis {
  width: 3vw;
  height: 3vw;

}

#gameName {
  font-size: 2vw;
  margin-left: 0.5vw;
  padding-top: 1vw;
  padding-left: 1vw;
}

.addQuizName {
  font-weight: bold;
  font-size: 1.2vw;
  background-color: inherit;
  border: none;
  margin-top: 0.8vw;
  width: 70%;
  height: 60%;
  margin-left: 0.5vw;
}

.muteButton {
  margin-top: -1vw;

}

#createbutton {
  margin-top: 1vw;
}

#addQuizName::placeholder {
  color: gray;
}

#title {
  padding-top: 4vh;
}

#arrow {
  position: absolute;
  top: -0.2vw;
}

#gameName,
.b {
  font-weight: bold;
}

@media screen and (max-width: 800px) {

  .muteButton {
    margin-top: -3vw;

  }

  h1 {
    font-size: 11.5vw;
    margin-top: 5vw;

  }

  .poll {
    position: relative;
    display: grid;
    grid-template-columns: 24vw 16vw 10vw;
    grid-template-rows: 5vw 5vw 10vw;
    grid-gap: 4vw;
    background-size: cover;
    margin-top: 2vw;
  }

  .a {
    display: flex;
    margin-left: 5vw;
    margin-top: -18vw;
    width: 90vw;
    height: 10vw;
  }

  #gameName {
    font-size: 4vw;
    padding-top: 3vw;
    width: 25vw;
    margin-bottom: 3vw;
  }

  .addQuizName {
    width: 60vw;
    font-size: 3.8vw;
    height: 5vw;
    padding-top: 2vw;
    margin-left: -1vw;
  }

  .b {
    margin-top: -6vw;
    width: 90vw;
    margin-left: 5vw;
    font-size: 5vw;
    height: 30vw;

  }

  .c {
    grid-row-start: 3;
    grid-column-start: 1;
    margin-left: 25vw;
    margin-top: 23vw;
  }

  .emojis {
    height: 4vw;
    width: 4vw;
  }

  #createbutton {
    height: 10vw;
    width: 50vw;
    font-size: 3vw;
    margin-bottom: 2vh;
  }

  .avatar-row {
    /* margin-top: -1vh; */
    width: 90vw;
    margin-left: -10vw;
  }

  #avatarZone {
    margin-left: 10vw;
  }
}</style>