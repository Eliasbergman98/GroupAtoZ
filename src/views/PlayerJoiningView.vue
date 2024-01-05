<template>
    <header>
        <img class="muteButton" @click="toggleMute" :src="buttonImage" alt="Toggle Mute" />
    </header>

    <h1>{{ data.quizName }}</h1>
    <h6>{{ uiLabels.gameTag }} {{ pollId }}</h6>
    <h2>{{ uiLabels.waitingForPlayers }}</h2>
    <div class="poll">
        <div class="columns-wrapper">
            <div v-for="(column, index) in playerColumns" :key="index" class="column">
                <div class="scroll-wrapper">
                    <ul v-for="person in column" :key="person.name">
                        <li>
                            {{ person.name }} <img class="emojies" v-bind:src="person.avatar" target="_blank" width="32"
                                height="32">
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="button-container">
            <button v-on:click="endGame" id="endGamebutton">{{ uiLabels.endGame }}</button>
            <button id="playerJoinedbutton">{{ participants.length }} {{ uiLabels.participantCount }} </button>
            <AlertComponent ref="alertComponent" :alertContentText="alertContentText"></AlertComponent>
            <button id="createbutton" v-on:click="stopMusicAndStartGame"> {{ uiLabels.startGame }}</button>
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
            playerColumns: [],
            playersPerColumn: 6,
            yourName: ""

        }
    },
    computed: {
        buttonImage() {
            return this.isMuted ? pressToMuteImage : pressToUnmuteImage;
        }
    },

    watch: {
        participants: function () {
            this.updatePlayerColumns();
        },
    },
    created: function () {
        this.pollId = this.$route.params.pollId;
        socket.emit("pageLoaded", this.lang);
        socket.on("init", (labels) => {
            this.uiLabels = labels
        })
        socket.on("participantsUpdate", (participants) => {
            this.participants = participants;
            this.getParticipantName(this.participants);
        });
        socket.emit("joinPoll", this.pollId);
        socket.emit("getPoll", this.pollId);
        socket.on("fullPole", (data) => {
            this.data = data;
            this.quizName = data.quizName;
        });
        window.addEventListener('resize', this.applyFunctionBasedOnMediaQuery);
        // Check sessionStorage for muted state
        const isMuted = sessionStorage.getItem("isMuted");
        if (isMuted) {
            this.isMuted = JSON.parse(isMuted);
        }
    },
    methods: {

        endGame() {
            socket.emit("playerExited", { pollId: this.pollId, name: this.yourName })
            this.$router.push('/');
            this.applyFunctionBasedOnMediaQuery();
        },
        sendInfo: function () {
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
            sessionStorage.setItem("isMuted", JSON.stringify(this.isMuted));
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
        updatePlayerColumns() {
            //this.playerColumns = this.chunkArray(this.participants, this.playersPerColumn);
            this.applyFunctionBasedOnMediaQuery();
        },
        chunkArray(array, size) {
            const result = [];
            for (let i = 0; i < array.length; i += size) {
                result.push(array.slice(i, i + size));
            }
            return result;
        },
        getParticipantName() {
            if (this.participants.length > 0 && this.yourName === "") {
                this.yourName = this.participants[this.participants.length - 1].name;
            }
        },
        applyFunctionBasedOnMediaQuery() {
            if (window.matchMedia("(max-width: 800px)").matches) {
                this.playersPerColumn = 100;
                this.playerColumns = this.chunkArray(this.participants, this.playersPerColumn);
            } else {
                this.playersPerColumn = 6;
                this.playerColumns = this.chunkArray(this.participants, this.playersPerColumn);
            }
        },
    }
}
</script>
  
<style scoped>
@keyframes flash {
    0% {
        opacity: 0.1;
    }

    50% {
        opacity: 1;
    }

    100% {
        opacity: 0.1;
    }
}

h1 {
    text-align: center;
}

h2 {
    margin-top: -8vw;
    text-align: center;
    text-transform: uppercase;
    font-size: 3vw;
    color: green;
    text-shadow:
        -0.075vw -0.075vw 0 #000,
        0.075vw -0.075vw 0 #000,
        -0.075vw 0.075vw 0 #000,
        0.075vw 0.075vw 0 #000;
    padding: 10px;
    animation: flash 2.3s infinite;
}

#createbutton,
#playerJoinedbutton,
#endGamebutton {
    font-size: 1.7vw;
    border: 0.2vw solid black;
    border-radius: 1.5vw;
    padding: 1.7vw;
    width: 12em;
    color: white;
}

#endGamebutton {
    order:1;
    background-color: rgb(177, 27, 27);
}

#playerJoinedbutton {
    order:2;
    background-color: rgba(4, 51, 192, 0.966);

}

#createbutton {
    order:3;
    background-color: green;
}

.poll {
    font-size: 1.7vw;
    color: black;
    position: center;
    font-weight: bold;
    height:15vw;
}

.button-container {
    margin-top: -2vw;
    position: relative;
    width: 80vw;
    display: flex;
    justify-content: space-between;
    padding: 1em;
    margin-left: 8vw;
    margin-bottom:-10vw;
}

.participants {
    position: absolute;
}

.emojies {
    width: 2vw;
    height: 2vw;
    margin-bottom: -0.4vw;
}

.scroll-wrapper {
    overflow-y: auto;
    height: 15vw;
}

.scroll-wrapper ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.columns-wrapper {
    display: flex;
    justify-content: space-around;
    min-height: 13vw;
}

.column {
    flex-grow: 1;
    margin: 0 10px;
}

@media screen and (max-width:800px) {

    .muteButton {
        position: relative;
        width: 5vw;
        height: 5vw;
        padding: 0.5vw 0 0 0.5vw;
        margin-left: 88vw;
    }

    h1 {
        font-size: 10vw;
        margin-top: 1vw;
    }

    h2 {
        font-size: 7vw;
    }
    .poll {
        font-size: 8vw;
        font-weight: bold;
    }

    .button-container {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    #endGamebutton {
        order:3;
        width: 60vw;
        height: 10vh;
        font-size: 3.6vh;
        margin-left: -10vw;
        border-radius: 5vw;
        
    }

    #createbutton {
        order:1;
        width: 60vw;
        height: 10vh;
        font-size: 3.6vh;
        margin-left: -10vw;
        border-radius: 5vw;
        margin-bottom:5vw;
        
    }

    #playerJoinedbutton {
        order:2;
        width: 60vw;
        height: 10vh;
        font-size: 3.6vh;
        margin-left: -10vw;
        border-radius: 5vw;
        margin-bottom:5vw;
    }

    .scroll-wrapper {
        overflow-y: auto;
        height: 50vw;
    }

    .emojies {
        width: 7vw;
        height: 7vw;
        margin-bottom: -0.4vw;
    }
}
</style>
