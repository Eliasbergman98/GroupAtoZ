<template>
    <h1>
        {{ data.quizName }}
    </h1>
    <h2>{{ uiLabels.waitingForHost }}</h2>
    {{ yourName }}
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
            <button id="gameIDbutton">{{ uiLabels.gameTag }} {{ pollId }}</button>
            <button v-on:click="exitGame" id="exitGamebutton">{{ uiLabels.exitGame }}</button>
            <button id="playerJoinedbutton">{{ participants.length }} {{ uiLabels.participantCount }} </button>
        </div>
    </div>
</template>
  
<script>
import io from 'socket.io-client';
import avatar from '../assets/avatar.json';
const socket = io("localhost:3000");

export default {
    name: 'PlayerWaitingView',
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
            fuseWidth: 100,
            participants: [],
            playerColumns: [],
            playersPerColumn: 6,
            yourName: ""
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
            this.uiLabels = labels;
        });
        socket.on("dataUpdate", (data) => {
            this.data = data;
        });
        socket.on("pollCreated", (data) => {
            this.data = data;
        });
        socket.emit("joinPoll", this.pollId);
        socket.emit("getPoll", this.pollId);
        socket.on("fullPole", (data) => {
            console.log("in joiningview", this.pollId)
            this.data = data;
        });

        socket.on("participantsUpdate", (participants) => {
            this.participants = participants;
            this.getParticipantName(this.participants);
            console.log("hej här kommer nya joinare", this.participants)
        });

        socket.on("creatorStarting", (pollId) => {
            socket.emit("getThisParticipant", this.pollId, this.yourName)
            this.$router.push('/startingquizplayer/' + this.pollId + '/' + this.yourName);
        });
        window.addEventListener('resize', this.applyFunctionBasedOnMediaQuery);

    },
    methods: {

         exitGame(){
            socket.emit("playerExited", { pollId: this.pollId, name: this.yourName })
            this.$router.push('//');
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
            console.log("getParticipantName called");
            if (this.participants.length > 0 && this.yourName === "") {
                this.yourName = this.participants[this.participants.length - 1].name;
                console.log("I getParticipantName", this.yourName);
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

h2 {
    margin-top: -3vw;
    text-align: center;
    font-family: Courier, Trebuchet MS, Verdana, Geneva, Tahoma, sans-serif;
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

.columns-wrapper {
    display: flex;
    justify-content: space-around;
}

.column {
    flex-grow: 1;
    margin: 0 10px;
}


#exitGamebutton {
    font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
    font-size: 1.7vw;
    background-color: red;
    border: 0.2vw solid black;
    border-radius: 1.5vw;
    padding: 1.7vw;
    width: 12em;
    color: white;
}

#gameIDbutton {
    font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
    font-size: 1.7vw;
    background-color: green;
    border: 0.2vw solid black;
    border-radius: 1.5vw;
    padding: 1.7vw;
    width: 12em;
    color: white;
}

#playerJoinedbutton {
    font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
    font-size: 1.7vw;
    background-color: green;
    border: 0.2vw solid black;
    border-radius: 1.5vw;
    padding: 1.7vw;
    width: 12em;
    color: white;
}

.poll {
    font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
    font-size: 1.7vw;
    color: black;
    position: center;
}

.button-container {
    margin-top: 2vw;
    position: relative;
    width: 80vw;
    display: flex;
    justify-content: space-between;
    padding: 1em;
    margin-bottom: 2vw;
    margin-left: 10vw;
}

.participants {
    position: absolute;
}

.emojies {
    width: 2vw;
    height: 2vw;
}

.scroll-wrapper {
    overflow-y: auto;
    height: 15vw;
    /* Ensure the wrapper takes the full height of the container */
}

.scroll-wrapper ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

@media screen and (max-width:800px) {
    h1 {
        font-size: 12vw;
    }

    h2 {
        font-size: 8vw;
    }

    .poll {
        font-size: 8vw;
    }

    .button-container {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    #gameIDbutton {
        width: 60vw;
        height: 10vh;
        font-size: 3.6vh;
        margin-left: -10vw;
        border-radius: 5vw;
        margin-bottom: 20px;
    }

    #exitGamebutton {
        width: 60vw;
        height: 10vh;
        font-size: 3.6vh;
        margin-left: -10vw;
        border-radius: 5vw;
        margin-bottom: 20px;
    }

    #playerJoinedbutton {
        width: 60vw;
        height: 10vh;
        font-size: 3.6vh;
        margin-left: -10vw;
        border-radius: 5vw;
    }

    .scroll-wrapper {
        overflow-y: auto;
        height: 50vw;
    }

    .emojies {
        width: 7vw;
        height: 7vw;
    }
}</style>

