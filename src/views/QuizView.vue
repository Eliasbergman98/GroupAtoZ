<template>
    <header>
        <div>
            <img class="muteButton" @click="toggleMute" :src="buttonImage" alt="Toggle Mute" />
        </div>
    </header>
    <div class="arrow">
        <router-link to="/join/"><button id="goBack"> <img id="arrow" src="/img/arrow.png">
            </button></router-link>
    </div>
    <main>
        <h1>
            {{ uiLabels.joining }} {{ quizName }}
        </h1>
        <section class="player">
            <div class="gameInfo a" id="name">
                {{ uiLabels.yourName }}:
                <input type="text" id="yourname" v-model="yourName" :placeholder="uiLabels.enterName" maxlength="13">
            </div>
            <div class="gameInfo b">
                {{ uiLabels.chooseAvatar }} <br>
                <div id="avatarZone">
                    <div v-for="(avatarRow, rowIndex) in Math.ceil(avatars.length / 8)" :key="rowIndex" class="avatar-row">
                        <button v-for="(avatar, colIndex) in avatars.slice(rowIndex * 8, (rowIndex + 1) * 8)"
                            :key="colIndex" @click="selectAvatar(rowIndex * 8 + colIndex)"
                            :class="{ 'selected': selectedAvatar === rowIndex * 8 + colIndex }">
                            <img class="emojis" v-bind:src="avatar.url" alt="😄" width="32" height="32">
                        </button>
                    </div>
                </div>
            </div>
            <div class="gameInfo c">
                <button id="donebutton" v-on:click="stopMusicAndStartGame" :class="{ 'green-button': yourName !== '' && selectedAvatar !== null}"> {{
                    uiLabels.doneButton }}</button>
                <AlertComponent ref="alertComponent" :alertContentText="alertContentText">
                </AlertComponent>
            </div>
        </section>
    </main>
</template>
  
<script>
import AlertComponent from '@/components/AlertComponent.vue';
import io from 'socket.io-client';
import avatar from '../assets/avatar.json';
import pressToMuteImage from "/img/soundon.png";
import pressToUnmuteImage from "/img/soundoff.png";
const socket = io(sessionStorage.getItem("localhost"));

export default {
    name: 'QuizView',
    components: {
        AlertComponent
    },
    data: function () {
        return {
            selectedAvatar: null,
            avatars: avatar,
            uiLabels: {},
            lang: localStorage.getItem("lang") || "en",
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
        socket.emit("pageLoaded", this.lang);
        socket.on("init", (labels) => {
            this.uiLabels = labels
        })
        socket.emit("getPoll", this.pollId);
        socket.on("fullPole", (data) => {
            this.quizName = data.quizName;
        });
            // Check sessionStorage for muted state
        const isMuted = sessionStorage.getItem("isMuted");
            if (isMuted) {
                this.isMuted = JSON.parse(isMuted);}

    },
    methods: {
        selectAvatar(index) {
            this.selectedAvatar = index;
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
        stopMusicAndStartGame() {
            const audioPlayer = this.$root.$refs.audioPlayer;

            if (!audioPlayer.paused) {
                audioPlayer.pause();
                audioPlayer.currentTime = 0;
            }

            this.addParticipant();
        },
        addParticipant: async function () {
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
                const addParticipantResult = await new Promise((resolve) => {
                    socket.emit("addParticipant", { pollId: this.pollId, name: this.yourName, selectedAvatar: this.selectedAvatarUrl, quizName: this.quizName });
                    socket.on("checkPlayer", (data) => {
                        resolve(data);
                    });
                });
                this.checkName = addParticipantResult;

                if (this.checkName === "invalidName") {
                    this.alertContentText = this.uiLabels.nameTakenAlert;
                    this.$refs.alertComponent.openAlert();
                    this.checkName = "";
                } else {
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
h1 {
    font-size: 5vw;
}

.player {
    position: relative;
    display: grid;
    grid-template-columns: 50vw 35vw;
    grid-template-rows: 5vw 5vw;
    background-color: rgb(163, 163, 243);
    grid-gap: 1vw;
    background-size: cover;
    margin-top: -3vw;
}

.gameInfo {
    font-weight: bold;
    width: 50vw;
    height: 20vw;
    text-align: left;
    position: left;
    border-radius: 2vw;
}

.a {
    grid-row-start: 1;
    grid-column-start: 1;
    /* padding: 10em auto 2em 2em; */
    text-align: center;
    font-size: 2vw;
    width: 50vw;
    height: 5vw;
    background-size: cover;
    background-color: rgb(201, 241, 244);
    border: 2px solid black;
    margin-left: 25vw;
    /* margin-top: 3px; */

}

.b {
    grid-row-start: 2;
    grid-column-start: 1;
    text-align: center;
    font-size: 2vw;
    width: 50vw;
    height: 13vw;
    background-size: cover;
    background-color: rgb(201, 241, 244);
    border: 2px solid black;
    margin-left: 25vw;
    /* margin-top: 2vh; */
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
    width: 10vw;
    margin-top: 20vw;
    margin-left: -27vw;
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
    width: 70%;
    margin-left: 0.5vw;
    position: relative;
}

#yourname::placeholder {
    color: gray;
}

#name, .b {
  font-weight: bold;
}

.selected {
    background-color: green;
}
.emojis{
    height:3vw;
    width: 3vw;
}

@media screen and (max-width: 800px) {
    h1 {
        font-size: 12vw;
    }

    .player {
        margin-top: 2vw;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .a {
        margin-left: 0vw;
        /* padding-top: 1vh;
        padding-left: 2vw; */
        font-size: 5vw;
        width: 90vw;
        height: 10vw;
    }

    #yourname {
        font-size: 4vw;
        padding-top: 3vw;
        margin-bottom: 3vw;
    }
    .b {
        width: 90vw;
        height: 30vw;
        margin-left: 0vw;
        margin-top: 1vw;
        font-size: 5vw;
    }

    .emojis {
        height: 4vw;
        width: 4vw;
      
    }

    .c {
        margin-left: -40vw;
        margin-top: 2vw;
    }

    #donebutton {
        height: 10vw;
        width: 50vw;
        font-size: 3vw;
        margin-bottom: 2vw;
    }

    .avatar-row {
        width: 91vw;
        margin-left: -10vw;
    }
    #avatarZone{
        margin-left: 10vw;
    }
}
</style>