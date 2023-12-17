<template>
    <header>
        <div>
            <img class="muteButton" @click="toggleMute" :src="buttonImage" alt="Toggle Mute"/>
        </div>
    </header>
    <div class="arrow">
        <router-link to="/join/"><button id="goBack"> <img id="arrow" src="/img/arrow.png" style="width: 3vw;">
            </button></router-link>
    </div>
    <main>
        <h1>
        {{uiLabels.joining}} {{ data.quizName }}
        </h1>
        <section class="player">
            <div class="gameInfo a" id="name">
                {{ uiLabels.yourName }}:
                <input type="text" id="yourname" v-model="yourName" :placeholder="uiLabels.enterName">
            </div>

            <div class="gameInfo b">
                {{ uiLabels.chooseAvatar }} <br>
                <div id="avatarZone">
                <img class="avatar">
                <button v-for="(avatar, index) in avatars" :key="index" @click="selectAvatar(index)"
                    :class="{ 'selected': selectedAvatar === index }">
                    <img class="emojis" v-bind:src="avatar.url" alt="😄" width="32" height="32">
                </button>
            </div>
            </div>
            <div class="gameInfo c">
                <button v-on:click="stopMusicAndStartGame" id="donebutton"> {{ uiLabels.doneButton }}</button>
                <AlertComponent ref="alertComponent" :alertContentText="alertContentText">
                </AlertComponent>
            </div>
        </section>
    </main>
</template>
  
<script>
// @ is an alias to /src
import AlertComponent from '@/components/AlertComponent.vue';
import io from 'socket.io-client';
import avatar from '../assets/avatar.json';
import pressToMuteImage from "/img/soundon.png";
import pressToUnmuteImage from "/img/soundoff.png";
const socket = io("localhost:3000");

export default {
    name: 'QuizView',
    components: {
        AlertComponent
    },
    data: function () {
        return {
            selectedAvatar: null,
            avatars: avatar,
            gamecode: "",
            question: {
                q: "",
                a: [],
            },
            submittedAnswers: {},
            uiLabels: {},
            lang: localStorage.getItem("lang") || "en",
            data: {},
            quizName: '',
            yourName: '',
            pollId: "",
            alertContentText: "",
            checkName: "",
            isMuted: false,
            showMysteryButton: true,

        }

    },
    computed: {
        buttonImage() {
            return this.isMuted ? pressToMuteImage : pressToUnmuteImage;
        }
    },
    created: function () {
        this.pollId = this.$route.params.pollId
        socket.emit('joinPoll', this.pollId)
        socket.on("newQuestion", q =>
            this.question = q
        )
        // socket.on("dataUpdate", answers =>
        //     this.submittedAnswers = answers
        // )
        socket.emit("pageLoaded", this.lang);
        socket.on("init", (labels) => {
            this.uiLabels = labels
        })
        socket.emit("getPoll", this.pollId);
        socket.on("fullPole", (data) => {
            this.data = data;
            console.log("data hämtad", this.pollId)

        });

    },
    methods: {
        selectAvatar(index) {
            this.selectedAvatar = index;
            this.selectedAvatarUrl = this.avatars[index].url;
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
        stopMusicAndStartGame() {
            // Access the audio player from the AppView component
            const audioPlayer = this.$root.$refs.audioPlayer;
            
            // Pause the music if it's playing
            if (!audioPlayer.paused) {
                audioPlayer.pause();
                audioPlayer.currentTime = 0;
            }

            // Start the game
            this.addParticipant();
            },
        addParticipant: async function () {
            console.log("selAv", this.selectedAvatar)
            console.log("selAvUrl", this.selectedAvatarUrl)
            // Check if 'yourName' or 'selectedAvatarUrl' is empty
            if (this.yourName === '' || this.selectedAvatar === null) {
                this.alertContentText = this.uiLabels.nameAvatarAlert;
                this.$refs.alertComponent.openAlert();
                return;
            }

            if (this.selectedAvatarUrl === null) {
                this.alertContentText = this.uiLabels.nameAvatarAlert;
                this.$refs.alertComponent.openAlert();
                return;
            }

            try {
                // Use a promise to wait for the result of socket.emit
                const addParticipantResult = await new Promise((resolve, reject) => {
                    // Emit 'addParticipant' event to the server
                    socket.emit("addParticipant", { pollId: this.pollId, name: this.yourName, selectedAvatar: this.selectedAvatarUrl });
                    socket.on("checkPlayer", (data) => {
                        // Resolve the promise with the received data
                        resolve(data);
                    });
                });
                // Set 'checkName' with the result from the server
                this.checkName = addParticipantResult;

                if (this.checkName === "invalidName") {
                    console.log("hjälp jag måste ta bort mitt namn lol", this.checkName);
                    this.alertContentText = this.uiLabels.nameTakenAlert;
                    this.$refs.alertComponent.openAlert();
                    this.checkName = "";
                } else {
                    // Log a message and navigate to the specified route if conditions are false
                    console.log("added one participant now", this.pollId, this.yourName, this.selectedAvatarUrl);
                    this.$router.push('/playerwaiting/' + this.pollId);
                }
            } catch (error) {
                console.error("Error adding participant:", error);
            }
        }
    }
}
</script>

<style scoped>
.emojis {
    width: 2vw;
    height: 2vw;
}

h1 {
    /* margin-left: 6vw; */
    font-size: 6vw;

}

.player {
    position: relative;
    display: grid;
    grid-template-columns: 50vw 35vw ;
    grid-template-rows: 5vw 5vw;
    background-color: rgb(163, 163, 243);
    grid-gap: 3vw;
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
    padding: 10em auto 2em 2em;
    text-align: center;
    font-size: 2vw;
    width: 50vw;
    height: 5vw;
    background-size: cover;
    background-color: rgb(201, 241, 244);
    border: 2px solid black;
    margin-left: 24vw;
    margin-top: 3px;

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
    margin-top: 2.8vh;
    padding-top: 2vw;
    padding-bottom: 4vw;
}
#avatarZone{
  width: 75%;
  margin-left: 12.5%;
  margin-top: 3vh;
}
.c{
  grid-row-start: 2;
  grid-column-start: 3;
  width: 2vw;
  margin-top: 11.7vw;
  margin-left: -8.9vw;
  height: 2vw;
}

#donebutton:hover {
    background-color: green;
}

#yourname {
    margin-top: 0.8vw;
    font-weight: bold;
    font-size: 1.2vw;
    background-color: inherit;
    border: none;
    padding: 1vw;
    width: 73%;
    margin-left: 0.5vw;
    position: relative;
}

#yourname::placeholder {
    color: gray;
}

.selected {
    background-color: green;
}
</style>