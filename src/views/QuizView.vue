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
            Quizname & PollID
            <!--<img src="/img/brake.png" style="width: 200px;">-->
        </h1>
        <div>
            test 
            QuizName: {{data.quizName}}
            PollID: {{ pollId }}
        </div>
        <section class="player">
            <div class="gameInfo a" id="name">
                {{ uiLabels.yourName }}:
                <input type="text" id="yourname" v-model="yourName" :placeholder="uiLabels.enterName">
            </div>
            <div>
                {{ yourName }}
            </div>
            <div class="earth">
                <img id="earth" src="/img/earth.png" style="width: 180px;">
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
            pollId: "test",
            submittedAnswers: {},
            uiLabels: {},
            lang: localStorage.getItem("lang") || "en",
            data: {},
            quizName: '',
            yourName: '',
            pollId: "3247"
        }

    },
    created: function () {
        this.id = this.$route.params.id
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
            this.$router.push('/playerjoining/' + this.pollId)
        },
    }
}
</script>

<style scoped>
.player {
    position: relative;
    display: grid;
    grid-template-columns: 50vw 20vw 2vw;
    grid-template-rows: 5vw 10vw 10vw;
    background-color: rgb(163, 163, 243);
    grid-gap: 3vw;
    background-size: cover;
}

.gameInfo {
    font-family: Georgia, 'Times New Roman', Times, serif;
    width: 50vw;
    height: 1vw;
    text-align: left;
    position: left;
    border-radius: 20px;
}

.a {
    grid-row-start: 1;
    grid-column-start: 1;
    padding: 10em auto 2em 2em;
    text-align: center;
    font-size: 12pt;
    width: 50vw;
    height: 5vw;
    background-size: cover;
    background-color:rgb(201, 241, 244);
    border: 2px solid black;
    margin-top: 5vw;
    margin-left: 10vw;
}

.b {
    grid-row-start: 2;
    grid-column-start: 1;
    text-align: center;
    font-size: 12pt;
    width: 50vw;
    height: 10vw;
    background-size: cover;
    background-color: rgb(201, 241, 244);
    border: 2px solid black;
    margin-top: 4vw;
    margin-left: 10vw;
    padding-top: 2vw;
    padding-bottom: 4vw;
}

.c {
    width: 10vw;
    grid-row-start: 3;
    grid-column-start: 4;
    justify-self: center;
}

.earth {
    margin-top: 2vw;
    width: 10vw;
    grid-column-start: 3;
    grid-row-start: 1;
}

#donebutton:hover {
    background-color: green;
}

#donebutton {
    font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
    font-size: 14pt;
    color: white;
    background-color: gray;
    border: 2px solid black;
    padding: 25px;
    border-radius: 20px;
}

#yourname {
    margin-top: 1vw;
    padding: 1vw;
    font-weight: bold;
}

.selected {
    background-color: green;
}
</style>