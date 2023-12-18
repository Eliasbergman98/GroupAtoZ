<template>
    <header>
        <div>
        <img class="muteButton" @click="toggleMute" :src="buttonImage" alt="Toggle Mute"/>
        </div>
  </header>
    <div class="arrow">
        <button>
            <router-link :to="'/createquestions/' + pollId"><button id="goBack"> <img id="arrow" src="/img/arrow.png"
                        style="width: 3vw;">
                </button></router-link>
        </button>
    </div>

    <div class="poll">
        <div class="gameInfo a">
            {{ uiLabels.players }} <br>
            <hr>
            <div class="scroll-wrapper">
                <ul v-for="person in participants" :key="participants.name">
                    <li>
                        {{ person.name }} <img class="emojies" v-bind:src="person.avatar" target="_blank" width="32"
                            height="32">
                    </li>
                </ul>
            </div>
        </div>
        <div class="gameInfo b">
            {{ data.quizName }} <img class="emojies" v-bind:src="data.selectedAvatar" width="20" height="20"
                target="_blank"> <br> <hr>
            {{ uiLabels.gameTag }} {{ pollId }} <br>
            {{ participants.length }} {{ uiLabels.participantCount }}
        </div>
        <div class="gameInfo c">
            <button id="createbutton" v-on:click="stopMusicAndStartGame"> {{ uiLabels.startGame }}</button>
        </div>
    </div>
</template>
  
<script>
import io from 'socket.io-client';
import avatar from '../assets/avatar.json';
import pressToMuteImage from "/img/soundon.png";
import pressToUnmuteImage from "/img/soundoff.png";
const socket = io("localhost:3000");

export default {
    name: 'PlayerJoiningView',
    data: function () {
        return {
            lang: localStorage.getItem("lang") || "en",
            pollId: "",
            question: "",
            answers: ["", ""],
            questionNumber: 0,
            data: {},
            uiLabels: {},
            selectedAvatar: null,
            avatars: avatar,
            participants: [],
            participantCount: 0,
            isMuted: false,
            showMysteryButton: true,
            quizName: ""
        }
    },
    computed: {
        buttonImage() {
            return this.isMuted ? pressToMuteImage : pressToUnmuteImage;
        }
    },
    created: function () {
        this.pollId = this.$route.params.pollId;
        socket.emit("pageLoaded", this.lang);
        socket.on("init", (labels) => {
            this.uiLabels = labels
        })
        socket.on("dataUpdate", (data) =>
            this.data = data
        )
        socket.on("participantsUpdate", (participants) =>
            this.participants = participants,
            console.log("hej här kommer nya joinare", this.participants)
        )
        socket.emit("joinPoll", this.pollId);
        socket.emit("getPoll", this.pollId);
        socket.on("pollCreated", (data) =>
            this.data = data )
        socket.on("fullPole", (data) => {
            this.data = data;
            this.quizName = data.quizName;
            console.log("in joiningview", this.quizName)
        });
    },
    methods: {
        sendInfo: function () {
            socket.emit("startingGame", {pollId: this.pollId, questionNumber: this.questionNumber})
            this.$router.push('/startingquiz/' + this.pollId + "/" + this.quizName)
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
            this.sendInfo();
            },
    }
}
</script>
  
<style scoped>
.poll {
    position: relative;
    display: grid;
    grid-template-columns: 30vw 10vw 1vw;
    grid-template-rows: 5vw 15vw 14vw;
    background-color: rgb(163, 163, 243);
    grid-gap: 3vw;
    background-size: cover;
    font-size: 2vw;
}

.gameInfo {
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    width: 50vw;
    height: 1vw;
    text-align: left;
    position: left;
}

.a {
    grid-row-start: 1;
    grid-column-start: 1;
    padding: 10em auto 2em 2em;
    text-align: left;
    width: 30vw;
    height: 38vw;
    background-size: cover;
    background-color: rgb(201, 241, 244);
    border: 2px solid black;
    margin-left: 10vw;
    border-radius: 20px;
    margin-right: 3vw;
    padding: 0.7em 0 0 1em;
    overflow-y: hidden;
}

.scroll-wrapper {
    overflow-y: auto;
    height: 30vw;
    /* Ensure the wrapper takes the full height of the container */
}

.scroll-wrapper ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.b {
    grid-row-start: 1;
    grid-column-start: 2;
    text-align: left;
    position: relative;
    width: 30vw;
    height: 10vw;
    background-color: rgb(201, 241, 244);
    border: 2px solid black;
    margin-left: 10vw;
    border-radius: 20px;
    margin-left: 15vw;
    padding: 0.7em 0 0 1em;
}

.c {
    grid-row-start: 3;
    grid-column-start: 4;
    justify-self: center;
    margin-top: 8vw;
}

#createbutton:hover {
    cursor: pointer;
    background-color: green;
}

#createbutton {
    background-color: gray;
    margin-left: 15vw;
}

.emojies {
    width: 2vw;
    height: 2vw;
}
</style>