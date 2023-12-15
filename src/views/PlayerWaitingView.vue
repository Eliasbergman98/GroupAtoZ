<template>
    <h1>
        {{ data.quizName }}
    </h1>
    <h2>{{ uiLabels.waitingForHost }}</h2>
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
            <!--<div class="participants" v-for="person in participants" :key="participants.name" :style="getPositionStyle()">
                {{ person.name }} <img class="emojies" v-bind:src="person.avatar" target="_blank" width="32" height="32">
            </div>-->
            <section class="button-container">
                <button id="gameIDbutton">{{ uiLabels.gameTag }} {{ pollId }}</button>
                <router-link to="//"><button id="exitGamebutton">{{ uiLabels.exitGame }}</button></router-link>
                <button id="playerJoinedbutton">{{ participants.length }} {{ uiLabels.participantCount }} </button>
            </section>
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
            playersPerColumn: 8,
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

        socket.on("participantsUpdate", (participants) =>
            this.participants = participants,
            console.log("hej här kommer nya joinare", this.participants)
        )

        /*socket.on("participantsUpdate", (participants) => {
            this.participants = participants.map((participant) => ({
                ...participant,
                position: this.getPositionStyle(), // Add the position property
            }));
            console.log("hej här kommer nya joinare", this.participants);
        });*/

        socket.on("creatorStarting", (pollId) => {
            this.$router.push('/startingquizplayer/' + this.pollId);
        });

    },
    methods: {
        updatePlayerColumns() {
            this.playerColumns = this.chunkArray(this.participants, this.playersPerColumn);
        },
        chunkArray(array, size) {
            const result = [];
            for (let i = 0; i < array.length; i += size) {
                result.push(array.slice(i, i + size));
            }
            return result;
        },
        /*getPositionStyle() {
            const position = {
                bottom: `${Math.random() * 30 + 40}%`, // Adjust the bottom position between 40% and 70%
                top: `${Math.random() * 30 + 40}%`,    // Adjust the top position between 40% and 70%
                left: `${Math.random() * 30 + 40}%`,   // Adjust the left position between 40% and 70%
                right: `${Math.random() * 30 + 40}%`,  // Adjust the right position between 40% and 70%
            };

            const isCollision = this.participants.some((participant) => {
                const existingPosition = participant.position;
                const horizontalCollision =
                    Math.abs(position.left - existingPosition.left) < this.fuseWidth;
                const verticalCollision =
                    Math.abs(position.top - existingPosition.top) < this.fuseWidth;
                return horizontalCollision && verticalCollision;
            });

            // If collision occurs, recursively try again with a new position
            if (isCollision) {
                return this.getPositionStyle();
            }

            return {
                ...position,
                position: 'absolute',
            };
        },*/
    },
}
</script>  

<style scoped>
@keyframes flash {
    0% {
        opacity: 0.05;
    }

    50% {
        opacity: 1;
    }

    100% {
        opacity: 0.05;
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
    animation: flash 2.5s infinite;
}

.columns-wrapper {
    display: flex;
    justify-content: space-around;
    /* Adjust this property based on your layout requirements */
}

.column {
    flex-grow: 1;
    margin: 0 10px;
    /* Adjust the margin based on your layout preferences */
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
    position: absolute;
    bottom: 0;
    left: 0;
    width: 90%;
    display: flex;
    justify-content: space-between;
    padding: 1em;
    margin-bottom: 2vw;
    ;
    margin-left: 3vw;
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
    height: 30vw;
    /* Ensure the wrapper takes the full height of the container */
}

.scroll-wrapper ul {
    list-style: none;
    padding: 0;
    margin: 0;
}
</style>

