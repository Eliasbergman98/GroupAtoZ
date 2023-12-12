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
        <h1>
            Quiz: {{ data.quizName }}
            <br>
            GAME ID: {{ pollId }}
        </h1>
        <div>

        </div>
        <section class="player">
            <div class="gameInfo a" id="name">
                {{ uiLabels.yourName }}:
                <input type="text" id="yourname" v-model="yourName" :placeholder="uiLabels.enterName">
            </div>

            <div class="gameInfo b">
                {{ uiLabels.chooseAvatar }} <br>
                <img class="avatar">
                <button v-for="(avatar, index) in avatars" :key="index" @click="selectAvatar(index)"
                    :class="{ 'selected': selectedAvatar === index }">
                    <img class="emojis" v-bind:src="avatar.url" alt="😄" width="32" height="32">
                </button>
            </div>
            <div class="gameInfo c">
                <button v-on:click="addParticipant" id="donebutton"> {{ uiLabels.doneButton }}</button>
            </div>
        </section>
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
            submittedAnswers: {},
            uiLabels: {},
            lang: localStorage.getItem("lang") || "en",
            data: {},
            quizName: '',
            yourName: '',
            pollId: ""
        }

    },
    created: function () {
        this.pollId = this.$route.params.pollId
        socket.emit('joinPoll', this.pollId)
        socket.on("newQuestion", q =>
            this.question = q
        )
        // socket.on("dataUpdate", answers =>
        //     this.submittedAnswers = answers
        // )
        socket.emit("pageLoaded", this.lang);
        socket.on("init", (labels) => {
            this.uiLabels = labels
        })
        socket.emit("getPoll", this.pollId);
        socket.on("fullPole", (data) => {
            this.data = data;
            console.log("data hämtad", this.pollId)

        });

    },
    methods: {
        selectAvatar(index) {
            this.selectedAvatar = index;
            this.selectedAvatarUrl = this.avatars[index].url;
        },
        addParticipant: function () {
            socket.emit("addParticipant", { pollId: this.pollId, name: this.yourName, selectedAvatar: this.selectedAvatarUrl })
            console.log("added one participant now", this.pollId, this.yourName, this.selectedAvatarUrl)
            this.$router.push('/playerwaiting/' + this.pollId);
            // this.$router.push('/playerjoining/' + this.pollId) Här ska väntesidan läggas in
        },
    }
}
</script>

<style scoped>
.emojis {
    width: 2vw;
    height: 2vw;
}

h1 {
    text-align: left;
    margin-left: 10vw;
}

.player {
    position: relative;
    display: grid;
    grid-template-columns: 50vw 20vw;
    grid-template-rows: 5vw 5vw;
    background-color: rgb(163, 163, 243);
    grid-gap: 3vw;
    background-size: cover;
}

.gameInfo {
    font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
    width: 50vw;
    height: 20vw;
    text-align: left;
    position: left;
    border-radius: 2vw;
}

.a {
    grid-row-start: 1;
    grid-column-start: 1;
    padding: 8vw auto 2vw 2vw;
    text-align: center;
    font-size: 2vw;
    width: 40vw;
    height: 5vw;
    background-size: cover;
    background-color: rgb(201, 241, 244);
    border: 0.2vw solid black;
    margin-top: -2vw;
    margin-bottom: 5vw;
    margin-left: 10vw;
}

.b {
    grid-row-start: 2;
    grid-column-start: 1;
    text-align: center;
    font-size: 1.5vw;
    width: 40vw;
    height: 12vw;
    background-size: cover;
    background-color: rgb(201, 241, 244);
    border: 0.2vw solid black;
    margin-top: -3vw;
    margin-left: 10vw;
    padding-top: 1vw;
    padding-bottom: 4vw;
}

.c {
    width: 10vw;
    margin-left: 13vw;
    grid-row-start: 1;
    grid-column-start: 2;
}

#donebutton:hover {
    background-color: green;
}

#donebutton {
    font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
    font-size: 3vw;
    color: white;
    background-color: gray;
    border: 0.2vw solid black;
    padding: 2vw;
    border-radius: 1vw;
    width: 15vw;


}

#yourname {
    margin-top: 0.8vw;
    font-weight: bold;
    font-size: 1.2vw;
    background-color: inherit;
    border: none;
    padding: 1vw;
    width: 73%; 
    margin-left: 0.5vw;
    position: relative;
}

#yourname::placeholder {
    color: gray;
}

.selected {
    background-color: green;
}
</style>