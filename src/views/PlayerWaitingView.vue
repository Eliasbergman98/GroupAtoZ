<template>
    <h1>
        {{ uiLabels.whereTo }}
    </h1>
    <div>
        {{ participants }}
    </div>
    <div class="gameInfo b">
            {{ data.quizName }} <img class="emojies" v-bind:src="data.selectedAvatar" width="20" height="20"
                target="_blank"> <br> <hr>
            {{ uiLabels.gameTag }} {{ pollId }} <br>
            {{ participants.length }} {{ uiLabels.participantCount }}
        </div>
    <div>
            {{ uiLabels.players }} <br>
            <div>
                <ul v-for="person in participants" :key="participants.name">
                    <li>
                        {{ person.name }} <img class="emojies" v-bind:src="person.avatar" target="_blank" width="32"
                            height="32">
                    </li>
                </ul>
            </div>
        </div>
    <footer>
        <div class="fuse-container">
            <img id="fuseLine" src="/img/test1.png" :style="{ width: fuseWidth + 'vw', height: '10vw' }">
        </div>
    </footer>
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
            participants: []
        }
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
        );
        //this.startFuseTimer();

    },
    methods: {
        // createPoll: function () {
        //     socket.emit("createPoll", { pollId: this.pollId, lang: this.lang });
        // },
        // addQuizName: function () {
        //     socket.emit("addQuizName", this.quizName);
        //     console.log(this.quizName);
        //     socket.on("addQuizName", (data) => console.log("hej"));
        // },
        // addQuestion: function () {
        //     socket.emit("addQuestion", { pollId: this.pollId, q: this.question, a: this.answers });
        // },
        // addAnswer: function () {
        //     this.answers.push("");
        // },
        // runQuestion: function () {
        //     socket.emit("runQuestion", { pollId: this.pollId, questionNumber: this.questionNumber });
        // },
        // selectAvatar(index) {
        //     this.selectedAvatar = index;
        // },
        handleFuseBurnout() {
            // Add logic to handle what should happen when the fuse is burned out
            console.log('The fuse is burned out!');
            clearInterval(this.fuseTimer);
            this.$router.push('/clue/' + this.pollId);            


        },

    startFuseTimer: function () {
        clearInterval(this.fuseTimer);

        // Adjust the timer interval based on your preference
        const timerInterval = 10; // 1 second

        this.fuseTimer = setInterval(() => {
            // Decrease the fuse width by a certain percentage
            this.fuseWidth -= 0.5; // Adjust as needed

            // Check if the fuse is completely burned
            if (this.fuseWidth <= 0) {
                // Handle the event when the fuse is burned out
                this.handleFuseBurnout();
            }
        },timerInterval);
    }
}}
</script>  

<style scoped>
/*Explosion och keyframes gör inget atm, ska fixa det sen. */

h1 {
    position: center;
    margin-top: 10vw;
}

h2 {
    position: center;
    margin-top: 10vw;
}
</style>

<style scoped>
h1 {
    position: center;
    margin-top: 10vw;
}

h2 {
    position: center;
    margin-top: 10vw;
}
</style>