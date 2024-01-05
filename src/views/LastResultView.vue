<template>
    <div class="confetti-container">
        <header>
            <div class="arrow">
                <router-link to="/"><img id="arrow" src="/img/arrow.png"> </router-link>
            </div>
        </header>
        <main>
            <div v-for="(confetto, index) in confettiArray" :key="index" class="confetto"
                :style="{ left: confetto.left, animationDuration: confetto.animationDuration, backgroundColor: confetto.backgroundColor }">
            </div>
            <h1>{{ uiLabels.resultScore }}  <br> {{ uiLabels.for }} {{ quizName }} </h1>
            <div id="pics">
                <img v-if="participants.length== 1" class="podium" src="/img/Podium-removebg-preview4 (2).png" 
                    target="_blank">
                <img v-if="participants.length== 2" class="podium" src="/img/Podium-removebg-preview3.png" 
                    target="_blank">
                <img v-if="participants.length >2" class="podium" src="/img/Podium-removebg-preview1.png" 
                    target="_blank">
                <img v-if="participants[0]" class="emoji a" :src="participants[0].avatar" width="20" height="20"
                    target="_blank">
                <img v-if="participants[1]" class="emoji b" :src="participants[1].avatar" width="20" height="20"
                    target="_blank">
                <img v-if="participants[2]" class="emoji c" :src="participants[2].avatar" width="20" height="20"
                    target="_blank">
            </div>
            <div class="score-board-component">
                <h3>{{ uiLabels.scoreboard }}</h3>
                <div class="participant-list">
                    <ol>
                        <li v-for="person in participants" :key="person.name" class="participant-item">
                            <div class="participant-info">
                                <div class="name-avatar">
                                    {{ person.name }} <img class="emojies" v-bind:src="person.avatar" target="_blank">
                                </div>
                                <span class="points">{{ person.points }}</span>
                            </div>
                        </li>
                    </ol>
                </div>
            </div>
        </main>
    </div>
</template>
  
<script>
import io from 'socket.io-client';
const socket = io(sessionStorage.getItem("localhost"));

export default {
    name: 'LastResult',
    components: {
    },
    mounted() {
        this.generateConfetti();
    },
    data: function () {
        return {
            confettiArray: [],
            lang: localStorage.getItem("lang") || "en",
            pollId: "",
            questionNumber: 0,
            uiLabels: {},
            participants: [],
            quizName: ""
        }
    },
    created: function () {
        this.pollId = this.$route.params.pollId;
        socket.emit("pageLoaded", this.lang);
        socket.on("init", (labels) => {
            this.uiLabels = labels
        })
        socket.emit("joinPoll", this.pollId);
        socket.emit("getPoll", this.pollId);
        socket.on("fullPole", (data) => {
            this.participants = data.participants;
            this.quizName = data.quizName;
            this.playerWithMostPoints();
        });
    },
    methods: {
        playerWithMostPoints() {
            this.participants = this.participants.sort((a, b) => {
                if (a.points < b.points) return 1;
                if (a.points > b.points) return -1;
                console.log("participantlista i funken", this.participants)
                if (a.time > b.time) return -1;
                if (a.time < b.time) return 1;
                return 0;
            })

        },
        backToStart() {
            this.$router.push('/');
        },
        sendInfo: function () {
            socket.emit("startingGame", { pollId: this.pollId, questionNumber: this.questionNumber });
            this.$router.push('/startingquiz/' + this.pollId);
        },
        generateConfetti: function () {
            for (let i = 0; i < 50; i++) {
                const color = Math.random() < 0.8 ? '#ffcc00' : '#ffffff'; 
                this.confettiArray.push({
                    left: `${Math.random() * 100}vw`,
                    animationDuration: `${Math.random() * 2 + 1}s`,
                    backgroundColor: color,
                });
            }
        },

    },
}
</script>
  
<style scoped>
h1 {
    margin-top: auto;
    font-size: 4vw;
}

.podium {
    position: absolute;
    height: 30vw;
    width: 30vw;
    left: 7.5vw;
    top: 10vw;

}

#arrow {
    position: relative;
    left: -22vw;
}

.emoji {
    position: absolute;
    height: 7vw;
    width: 7vw;
}

.a {
    top: 14.5vw;
    left: 19vw;
}

.b {
    top: 18vw;
    left: 10vw;
}

.c {
    top: 19vw;
    left: 28.2vw;
}

#name1 {
    position: absolute;
    display: flex;
    top: 39vw;
    left: 9vw;
    height: 3vw;
    width: 10vw;
    font-size: 1vw;
}

h2 {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    margin: 0;
    padding: 0;
    font-size: 1.5vw;
}

h3 {
    font-weight: bold;
}

#name2 {
    position: absolute;
    display: flex;
    top: 38vw;
    left: 18vw;
    height: 3vw;
    width: 10vw;
    font-size: 1vw;
    justify-content: space-between;
}

#name3 {
    position: absolute;
    display: flex;
    top: 39vw;
    left: 27vw;
    height: 3vw;
    width: 10vw;
    font-size: 1vw;
    justify-content: space-between;
}

.confetti-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9999;
}

.confetto {
    position: absolute;
    width: 1vw;
    height: 1vw;
    /* background-color: #ffcc00; */
    /* border-radius: 50%; */
    /* transform: rotate(45deg); */
    animation: fallAnimation linear infinite;
    z-index: 1000;
}

.participant-item {
    padding: 1vw;
    margin-bottom: 0.5vw;
}

.participant-item:nth-child(odd) {
    background-color: rgb(168, 89, 208);
}

.participant-item:nth-child(even) {
    background-color: #5567ce;
}

.score-board-component {
    position: absolute;
    padding: 10em auto 2em 2em;
    font-size: 2vw;
    width: 45vw;
    height: 32vw;
    border-radius: 2vw;
    background-color: none;
    left: 50vw;

}

.participant-list {
    padding: 10em auto 2em 2em;
    margin-left: 1vw;
    margin-right: 4vw;
    text-align: left;
    max-height: 35vw;
    overflow-y: auto;
}

.participant-item {
    list-style-type: none;
}

.participant-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.emojies {
    width: 2vw;
    height: 2vw;
}

.points {
    text-align: right;
}

@keyframes fallAnimation {
    to {
        transform: translateY(120vh) rotate(45deg);
    }
}

@media screen and (max-width: 800px) {

    h1 {
        font-size: 12vw;
    }

    h3 {
        margin-left: 6vw;
        font-size: 5vw;
    }

    .podium {
        height: 80vw;
        width: 80vw;
        top: 30vw;
        left: 10vw;
    }

    .emoji {
        height: 15vw;
        width: 15vw;
    }

    .a {
        top: 45vw;
        left: 42.5vw;
    }

    .b {
        top: 53.5vw;
        left: 19vw;
    }

    .c {
        top: 57.3vw;
        left: 66.7vw;
    }

    #name1 {
        top: 132vw;
        left: 20vw;
    }

    h2 {
        font-size: 5vw;
    }

    #name2 {
        top: 130vw;
        left: 45.5vw;
    }

    #name3 {
        top: 132vw;
        left: 70vw;
    }

    .confetti-container {
        position: static;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
    }
    .score-board-component {
        position: absolute;
        padding: 10em auto 2em 2em;
        font-size: 2vw;
        width: 85vw;
        height: 52vw;
        border-radius: 2vw;
        background-color: none;
        top: 110vw;
        left: 5vw;
    }

    .participant-list {
        padding: 10em auto 2em 2em;
        margin-left: 1vw;
        margin-right: 4vw;
        text-align: left;
        max-height: 50vw;
        overflow-y: auto;
        font-size: large;
    }

    .participant-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .emojies {
        width: 4vw;
        height: 4vw;
    }
}
</style>
  