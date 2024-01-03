<template>
    <div class="confetti-container">
        <header>
        </header>
        <main>
            <div v-for="(confetto, index) in confettiArray" :key="index" class="confetto"
                :style="{ left: confetto.left, animationDuration: confetto.animationDuration }"></div>
            <h1>{{ uiLabels.theWinner }}</h1>
            <div id="pics">
                <img class="podium" src="/img/Podium-removebg-preview1.png">
                <img v-if="participants[0]" class="emoji a" :src="participants[0].avatar" width="20" height="20"
                    target="_blank">
                <img v-if="participants[1]" class="emoji b" :src="participants[1].avatar" width="20" height="20"
                    target="_blank">
                <img v-if="participants[2]" class="emoji c" :src="participants[2].avatar" width="20" height="20"
                    target="_blank">
                <div v-if="participants[1]" id="name1">
                    <h2>{{ participants[1].name }}</h2>
                </div>
                <div v-if="participants[0]" id="name2">
                    <h2>{{ participants[0].name }}</h2>
                </div>
                <div v-if="participants[2]" id="name3">
                    <h2>{{ participants[2].name }}</h2>
                </div>
            </div>
            <button v-on:click="backToStart" id="backToStartButton">{{ uiLabels.backToStart }}</button>
        </main>
    </div>
</template>
  
<script>
import io from 'socket.io-client';
import avatar from '../assets/avatar.json';
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
            question: "",
            answers: ["", ""],
            questionNumber: 0,
            data: {},
            uiLabels: {},
            selectedAvatar: null,
            avatars: avatar,
            participants: [],
            participantCount: 0
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
            this.data = data)
        socket.on("fullPole", (data) => {
            console.log("in joiningview", this.pollId)
            this.data = data;
            this.participants = data.participants;
            this.playerWithMostPoints();
        });
    },
    methods: {
        playerWithMostPoints() {
            this.participants.sort((a, b) => b.points - a.points);
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
                this.confettiArray.push({
                    left: `${Math.random() * 100}vw`,
                    animationDuration: `${Math.random() * 2 + 1}s`,

                });
            }
        }
    },
}
</script>
  
<style scoped>
.podium {
    position: absolute;
    height: 40vw;
    width: 40vw;
    right: 30vw;
    top: 5vw;

}

.emoji {
    position: absolute;
    height: 9vw;
    width: 9vw;
}

.a {
    top: 12vw;
    right: 45.5vw;
}

.b {
    top: 15.5vw;
    right: 57.3vw;
}

.c {
    top: 17.3vw;
    right: 33.2vw;
}

#name1 {
    position: absolute;
    display: flex;
    top: 42vw;
    left: 33vw;
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
    /* Remove default margin */
    padding: 0;
    /* Remove default padding */
    font-size: 1.5vw;
}

#name2 {
    position: absolute;
    display: flex;
    top: 42vw;
    left: 45.5vw;
    height: 3vw;
    width: 10vw;
    font-size: 1vw;
    justify-content: space-between;
}



#name3 {
    position: absolute;
    display: flex;
    top: 42vw;
    left: 58vw;
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
    overflow: hidden;
    pointer-events: none;
}

.confetto {
    position: absolute;
    width: 1vw;
    height: 1vw;
    background-color: #ffcc00;
    border-radius: 50%;
    transform: rotate(45deg);
    animation: fallAnimation linear infinite;
}
#backToStartButton{
    margin-left: 75vw;
    margin-top: 50vh;
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

    .podium {
        height: 80vw;
        width: 80vw;
        top: 50vw;
        left: 10vw;
    }

    .emoji {
        height: 15vw;
        width: 15vw;
    }

    .a {
        top: 65vw;
        right: 42.5vw;
    }

    .b {
        top: 73.5vw;
        right: 66.3vw;
    }

    .c {
        top: 77.3vw;
        right: 18.2vw;
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
        position:static; 
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
    }
    #backToStartButton{
        position: absolute;
        margin-top: 800px;
        margin-left: 200px;

    }
    
}
</style>
  