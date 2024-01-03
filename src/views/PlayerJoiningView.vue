<template>
    <header>
            <img class="muteButton" @click="toggleMute" :src="buttonImage" alt="Toggle Mute" />
    </header>
    <div>
        <h1>
            {{ uiLabels.waitingForPlayers }}
        </h1>
    </div>
    <div class="poll">
        <div class="gameInfo b">
            {{ quizName }} <img class="emojies" v-bind:src="data.selectedAvatar" target="_blank"> <br>
            <hr>
            {{ uiLabels.gameCode }}: {{ pollId }} <br>
            {{ participants.length }} {{ uiLabels.participantCount }}
        </div>
        <div class="gameInfo a">
            {{ uiLabels.players }} <br>
            <hr>
            <div class="scroll-wrapper">
                <ul v-for="person in participants" :key="participants.name">
                    <li>
                        {{ person.name }} <img class="emojies" v-bind:src="person.avatar" target="_blank">
                    </li>
                </ul>
            </div>
        </div>
        <div class="gameInfo c">
            <button id="createbutton" v-on:click="stopMusicAndStartGame"> {{ uiLabels.startGame }}</button>
            <AlertComponent ref="alertComponent" :alertContentText="alertContentText"></AlertComponent>
        </div>
    </div>
</template>
  
<script>
import AlertComponent from '@/components/AlertComponent.vue';
import io from 'socket.io-client';
import avatar from '../assets/avatar.json';
import pressToMuteImage from "/img/soundon.png";
import pressToUnmuteImage from "/img/soundoff.png";
const socket = io(sessionStorage.getItem("localhost"));

export default {
    name: 'PlayerJoiningView',
    components: {
        AlertComponent,
    },
    data: function () {
        return {
            lang: localStorage.getItem("lang") || "en",
            pollId: "",
            questionNumber: 0,
            data: {},
            uiLabels: {},
            selectedAvatar: null,
            avatars: avatar,
            participants: [],
            participantCount: 0,
            isMuted: false,
            showMysteryButton: true,
            quizName: "",
            alertContentText: "",
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
        socket.on("participantsUpdate", (participants) =>
            this.participants = participants,
            console.log("hej här kommer nya joinare i participantsupdate", this.participants)
        )
        socket.emit("joinPoll", this.pollId);
        socket.emit("getPoll", this.pollId);
        socket.on("pollCreated", (data) =>
            this.data = data)
        socket.on("fullPole", (data) => {
            this.data = data;
            this.quizName = data.quizName;
            console.log("lyssnar på fullPole och detta ör quizname: ", this.quizName)
        });
    },
    methods: {
        sendInfo: function () {
            console.log("så här många players", this.participants)
            if (this.participants != 0) {
                socket.emit("startingGame", { pollId: this.pollId, questionNumber: this.questionNumber })
                this.$router.push('/startingquiz/' + this.pollId + "/" + this.quizName)
            }
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
        },
        stopMusicAndStartGame() {
            const audioPlayer = this.$root.$refs.audioPlayer;

            if (this.participants.length === 0) {
                this.alertContentText = this.uiLabels.noPlayersJoined;
                this.$refs.alertComponent.openAlert();
                return;
            }

            if (!audioPlayer.paused) {
                audioPlayer.pause();
                audioPlayer.currentTime = 0;
            }

            this.sendInfo();
        },


    }
}
</script>
  
<style scoped>
h1 {
    font-size: 4vw;
    margin-top: 10vh;
}

.muteButton {
  position: absolute;
  width: 2.5vw;
  height: 2.5vw;
  padding: 0.5vw 0 0 0.5vw;
  margin-left: 45vw;
  margin-top: -8vh;
}

.poll {
    position: relative;
    display: grid;
    grid-template-columns: 30vw 10vw 1vw;
    grid-template-rows: 5vw 15vw 14vw;
    background-color: rgb(163, 163, 243);
    grid-gap: 1vw;
    background-size: cover;
    font-size: 2vw;
}

.gameInfo {
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
    width: 35vw;
    height: 25vw;
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
    width: 35vw;
    height: 10vw;
    background-color: rgb(201, 241, 244);
    border: 2px solid black;
    margin-left: 10vw;
    border-radius: 20px;
    margin-left: 20vw;
    padding: 0.7em 0 0 1em;
}

.c {
    grid-row-start: 3;
    grid-column-start: 4;
    justify-self: center;
    margin-top: -18vh;
    margin-left: 14vw;
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

@media screen and (max-width: 800px) {
    .b {
        grid-column-start: 1;
        width: 65vw;
        height: 23vh;
        font-size: 3.6vh;
        margin-left: 0vw;
    }

    .a {
        grid-row-start: 3;
        font-size: 4vh;
        width: 65vw;
        height: 50vh;
        margin-left: 3vw;
    }

    .c {
        grid-row-start: 5;
        grid-column-start: 3;
        margin-left: -5vw;
    }

    #createbutton {
        height: 7vh;
        width: 50vw;
        font-size: 2vh;
        margin-left: 2.5vw;
    }

    .emojies {
        width: 3vh;
        height: 3vh;
    }

    .scroll-wrapper ul {
        overflow-y: auto;
        max-height: 200vh;
        height: auto;
    }

    .poll {
        margin-top: 2vw;
        display: flex;
        flex-direction: column;
        align-items: center;

    }
}
</style>

