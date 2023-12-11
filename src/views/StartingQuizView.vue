<template>
    <h2>
        {{uiLabels.city}}
    </h2>
    <h1>
        {{ uiLabels.whereTo }}
    </h1>

    <footer>
        <div class="fuse-container">
            <img id="fuseLine" src="/img/test1.png" style="width: 70vw; height: 10vw;">
        </div>
    </footer>
</template>
  
<script>
import io from 'socket.io-client';
import avatar from '../assets/avatar.json';
const socket = io("localhost:3000");

export default {
    name: 'PlayerJoiningView',
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
            fuseWidth: 100
        }
    },
    created: function () {
        this.id = this.$route.params.id;

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
    },
    methods: {
        createPoll: function () {
            socket.emit("createPoll", { pollId: this.pollId, lang: this.lang });
        },
        addQuizName: function () {
            socket.emit("addQuizName", this.quizName);
            console.log(this.quizName);
            socket.on("addQuizName", (data) => console.log("hej"));
        },
        addQuestion: function () {
            socket.emit("addQuestion", { pollId: this.pollId, q: this.question, a: this.answers });
        },
        addAnswer: function () {
            this.answers.push("");
        },
        runQuestion: function () {
            socket.emit("runQuestion", { pollId: this.pollId, questionNumber: this.questionNumber });
        },
        selectAvatar(index) {
            this.selectedAvatar = index;
        },
        handleFuseBurnout() {
            // Add logic to handle what should happen when the fuse is burned out
            console.log('The fuse is burned out!');
            // For example, you might redirect the user to another page or perform another action
        }
    },
    mounted() {
        // Start the fuse timer when the component is mounted
        this.startFuseTimer();
    },
    startFuseTimer: function () {
        // Adjust the timer interval based on your preference
        const timerInterval = 1000; // 1 second

        setInterval(() => {
            // Decrease the fuse width by a certain percentage
            this.fuseWidth -= 5; // Adjust as needed

            // Check if the fuse is completely burned
            if (this.fuseWidth <= 0) {
                // Handle the event when the fuse is burned out
                this.handleFuseBurnout();
            }
        }, timerInterval);
    }
}
</script>  

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