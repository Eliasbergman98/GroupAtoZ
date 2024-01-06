<template>
    <h1>
        {{ quizName }}<img class="selected-avatar" v-bind:src="selectedAvatar" alt="Selected Avatar" />
    </h1>
    <h6>{{ uiLabels.gameTag }} {{ gameId }}</h6>
    <h5>{{ uiLabels.waitingForHost }}</h5>
    <div class="game">
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
            <button v-on:click="exitGame" id="exitGamebutton">{{ uiLabels.exitGame }}</button>
            <button id="playerJoinedbutton">{{ participants.length }} {{ uiLabels.participantCount }} </button>
        </div>
    </div>
</template>
  
<script>
import io from 'socket.io-client';
const socket = io(sessionStorage.getItem("localhost"));

export default {
    name: 'PlayerWaitingView',
    data: function () {
        return {
            lang: localStorage.getItem("lang") || "en",
            gameId: "",
            quizName: "",
            uiLabels: {},
            participants: [],
            playerColumns: [],
            playersPerColumn: 6,
            yourName: "",
            selectedAvatar: null,
        }
    },

    watch: {
        participants: function () {
            this.updatePlayerColumns();
        },
    },
    created: function () {
        this.gameId = this.$route.params.gameId;

        socket.emit("pageLoaded", this.lang);
        socket.on("init", (labels) => {
            this.uiLabels = labels;
        });
        socket.emit("joinGame", this.gameId);
        socket.emit("getGame", this.gameId);
        socket.on("fullGame", (data) => {
            this.quizName = data.quizName;
            this.selectedAvatar = data.selectedAvatar;
        });
        socket.on("participantsUpdate", (participants) => {
            this.participants = participants;
            this.getParticipantName(this.participants);
            console.log("hej här kommer nya joinare i playerwaiting", this.participants)
        });
        socket.on("creatorStarting", (gameId) => {
            this.$router.push('/startingquizplayer/' + this.gameId + '/' + this.yourName);
        });
        window.addEventListener('resize', this.applyFunctionBasedOnMediaQuery);
        socket.on("gameEnded", (gameId) => {
            this.$router.push('/');
        })
    },

    methods: {

        exitGame() {
            socket.emit("playerExited", { gameId: this.gameId, name: this.yourName })
            this.$router.push('/');
            this.applyFunctionBasedOnMediaQuery();
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
                console.log("Media query matches! Run your function here.");
            } else {
                this.playersPerColumn = 6;
                this.playerColumns = this.chunkArray(this.participants, this.playersPerColumn);
            }
        },
    },
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

h5 {
    animation: flash 2.3s infinite;
}

#exitGamebutton,
#playerJoinedbutton {
    font-size: 1.7vw;
    border: 0.2vw solid black;
    border-radius: 1.5vw;
    padding: 1.7vw;
    width: 12em;
    color: white;
}

#exitGamebutton {
    background-color: rgb(177, 27, 27);
}

#playerJoinedbutton {
    background-color: rgba(4, 51, 192, 0.966)
}

.game {
    font-size: 1.7vw;
    color: black;
    position: center;
    font-weight: bold;
    height: 15vw;
}

.button-container {
    margin-top: -2vw;
    position: relative;
    width: 80vw;
    display: flex;
    justify-content: space-between;
    padding: 1em;
    margin-left: 8vw;
    margin-bottom: 100vw;
}

.participants {
    position: absolute;
}

.emojies {
    width: 2vw;
    height: 2vw;
    margin-bottom: -0.4vw;
}

.selected-avatar {
    width: 4vw;
    height: 4vw;
    margin-left: 2vw;
    margin-bottom: -0.2vw;
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
    h1 {
        font-size: 10vw;
    }

    h2 {
        font-size: 7vw;
    }

    .game {
        font-size: 8vw;
        font-weight: bold;
    }

    .button-container {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    #exitGamebutton {
        order: 2;
        width: 60vw;
        height: 10vh;
        font-size: 3.6vh;
        margin-left: -10vw;
        border-radius: 5vw;

    }

    #playerJoinedbutton {
        order: 1;
        width: 60vw;
        height: 10vh;
        font-size: 3.6vh;
        margin-left: -10vw;
        border-radius: 5vw;
        margin-bottom: 20px;
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

    .selected-avatar {
        width: 7vw;
        height: 7vw;
        margin-left: 4vw;
        margin-bottom: -0.5vw;
    }
}
</style>

