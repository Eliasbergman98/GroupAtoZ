<template>
    <div class="arrow">
        <router-link to="/join/"><button id="goBack"> <img id="arrow" src="/img/arrow.png" style="width: 3vw;">
            </button></router-link>
    </div>
    <!-- <div>
      {{pollId}}
      <QuestionComponent v-bind:question="question"
                v-on:answer="submitAnswer($event)"/>
                <span>{{submittedAnswers}}</span>
    </div> -->
    <main>
        <section class="player">
            <div id="yourname">
                {{ uiLabels.yourName }}:
                <input type="text" id="yourname" v-model="yourname" :placeholder="uiLabels.enterName">
            </div>
            <div class="player b">
                {{ uiLabels.chooseAvatar }} <br>
                <img class="avatar">
                <button v-for="(avatar, index) in avatars" :key="index" @click="selectAvatar(index)"
                    :class="{ 'selected': selectedAvatar === index }">
                    <img class="emojies" v-bind:src="avatar.url" alt="😄" width="32" height="32">
                </button>
            </div>
        </section>
        <div>
            <button id="donebutton"> {{ uiLabels.doneButton }}</button>
        </div>
    </main>
</template>
  
<script>
// @ is an alias to /src
import QuestionComponent from '@/components/QuestionComponent.vue';
import io from 'socket.io-client';
import avatar from '../assets/avatar.json';
const socket = io("localhost:3000");

export default {
    name: 'QuizView',
    components: {
        QuestionComponent
    },
    data: function () {
        return {
            selectedAvatar: null,
            avatars: avatar,
            gamecode: "",
            question: {
                q: "",
                a: [],
            },
            pollId: "inactive poll",
            submittedAnswers: {},
            uiLabels: {},
            lang: localStorage.getItem("lang") || "en"
        }

    },
    created: function () {
        this.pollId = this.$route.params.id
        socket.emit('joinPoll', this.pollId)
        socket.on("newQuestion", q =>
            this.question = q
        )
        socket.on("dataUpdate", answers =>
            this.submittedAnswers = answers
        )
        socket.emit("pageLoaded", this.lang);
        socket.on("init", (labels) => {
            this.uiLabels = labels
        })
    },
    methods: {
        submitAnswer: function (answer) {
            socket.emit("submitAnswer", { pollId: this.pollId, answer: answer })
        },
        selectAvatar(index) {
            this.selectedAvatar = index;
        }
    }
}
</script>

<style scoped>
#donebutton:hover {
    cursor: pointer;
    background-color: green;
}

#donebutton {
    font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
    font-size: 14pt;
    color: white;
    background-color: gray;
    border: 2px solid black;
    padding: 20px;
    border-radius: 20px;
    margin-top: 5vw;
    margin-left: 60vw;
}

#yourname {
    padding: 20px;
    font-weight: bold;
    margin-right: 10vw;
}

.player {
    border: 2px solid black;
    padding: 2vw;
    margin-top: 10 vw;
    margin-left: 5vw;
    margin-right: 30vw;
    font-family: Georgia, 'Times New Roman', Times, serif;
    width: 50vw;
    height: 1vw;
    text-align: left;
    position: left;
}

h1 {
    margin-top: 50px;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    text-transform: uppercase;
    font-size: 30pt;
    font-style: italic;
    color: rgb(177, 27, 27);
}

.arrow {
    background-color: rgb(163, 163, 243);
    text-align: left;
    padding: 1vw 0 0 1vw;
}

.arrow button {
    background-color: rgb(163, 163, 243);
    border: 1px solid rgb(163, 163, 243);
}

.b {
    text-align: center;
    font-size: 2vw;
    width: 50vw;
    height: 10vw;
    background-size: cover;
    background-color: white;
    border: 2px solid black;
    margin-top: 2vw;
    margin-left: 5vw;
    padding-top: 2vw;
    padding-bottom: 4vw;
}
</style>
  