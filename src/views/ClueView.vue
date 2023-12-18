<template>
    <h1>
        {{ uiLabels.whereTo }}
    </h1>
    {{ pollId }}
    {{ Object.values(cities)[questionNumber - 1] }}
    <div class="clueBox">
        <div class="tester" v-if="cities && Object.values(cities).length > 0">
            <p v-if="clueNumber === 0">
                {{ uiLabels.clue6p }} <br>
            <div class="labelSize">{{ Object.values(cities)[questionNumber - 1].clue1 }}</div> <br>
            </p>
            <p v-else-if="clueNumber === 1">
                {{ uiLabels.clue4p }} <br>
            <div class="labelSize">{{ Object.values(cities)[questionNumber - 1].clue2 }}</div> <br>
            </p>
            <p v-else-if="clueNumber === 2">
                {{ uiLabels.clue2p }} <br>
            <div class="labelSize">{{ Object.values(cities)[questionNumber - 1].clue3 }}</div> <br>
            </p>
            <p v-else-if="clueNumber > 2">
            </p>
            <div v-if="creator">
                {{uiLabels.waitingForAnswers}}
            </div>
            <div v-else>
                <input v-model="answerClue" id="addPlayerAnswer" name="addPlayerAnswer" type="text">
                <button v-on:click="addPlayerAnswer" class="clueAnswer" :class="{ 'green-button': buttonClicked }">
                    <div v-if=!buttonClicked>
                        {{ uiLabels.addAnswer }}
                    </div>
                    <div v-else-if=buttonClicked>
                        {{ uiLabels.thankYou }}
                    </div>
                </button>
            </div>
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
    name: 'ClueView',
    data: function () {
        return {
            lang: localStorage.getItem("lang") || "en",
            pollId: "",
            quizName: '',
            question: "",
            answers: [],
            questionNumber: 0,
            data: {},
            uiLabels: {},
            selectedAvatar: null,
            avatars: avatar,
            fuseWidth: 100,
            answerClue: "",
            cities: {},
            clueNumber: 0,
            isRedirected: false,
            dataLoaded: false,
            buttonClicked: false,
            yourName: "",
            creator: false
        }
    },
    created: function () {
        this.pollId = this.$route.params.pollId;
        this.yourName = this.$route.params.yourName;
        this.isRedirected = false;
        socket.emit("getPoll", this.pollId);
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
        socket.on("fullPole", (data) => {
            this.data = data;
            this.cities = data.cities;
            this.city = data.cities.city;
            this.quizName = data.quizName;
            this.questionNumber = data.currentQuestion;
            console.log("Initial data.cities:", this.cities);
            this.dataLoaded = true;
            console.log(this.dataLoaded);
            this.startFuseTimer();
            this.checkIfCreator();
        });
    },
    methods: {
        createPoll: function () {
            socket.emit("createPoll", { pollId: this.pollId, lang: this.lang });
        },
        addQuizName: function () {
            socket.emit("addQuizName", this.quizName);
            socket.on("addQuizName", (data) => console.log("addQuizName"));
        },
        runQuestion: function () {
            socket.emit("runQuestion", { pollId: this.pollId, questionNumber: this.questionNumber });
        },
        selectAvatar(index) {
            this.selectedAvatar = index;
        },
        addPlayerAnswer: function () {
            this.buttonClicked = true;
            // this.answers.push(this.answerClue);
            socket.emit("checkAnswer", { pollId: this.pollId, answer: this.answerClue, name: this.yourName, clueNumber: this.clueNumber })
            console.log(this.answerClue, ": enskilt svar")
            console.log(this.answers, ": svarslista")
        },
        handleFuseBurnout() {
            this.fuseWidth = 100;
            this.buttonClicked = false;
            this.handleClues();
            this.answerClue = "";

            //this.addPlayerAnswer();
            //this.startFuseTimer();
            //console.log(this.addPlayerAnswer)
        },
        checkIfCreator() {
            if (this.yourName === this.quizName) {
                this.creator = true;
                console.log("In CheckIfCreator IF", this.creator)
            }
            console.log("In CheckIfCreator", this.creator)
        },
        handleClues() {
            if (!this.dataLoaded) {
                // Data hasn't been loaded yet, do not attempt to redirect
                return;
            }
            const lengthCities = Object.keys(this.cities).length;
            //console.log(lengthCities);
            if (this.cities && Object.keys(this.cities).length > 0 && lengthCities > 0) {
                this.clueNumber += 1;
                for (const cityName in this.cities) {
                    console.log(this.clueNumber + "detta är numret")
                    const city = this.cities[cityName];
                    for (const cityClues in city) {
                        if (this.clueNumber === 1) {
                            console.log(`${cityName}: ${city.clue1}`);
                        }
                        else if (this.clueNumber === 2) {
                            console.log(`${cityName}: ${city.clue2}`);
                        }
                        else if (this.clueNumber === 3) {
                            console.log(`${cityName}: ${city.clue3}`);
                        }
                    }
                }
                if (this.clueNumber === 3 && !this.isRedirected) {
                    this.isRedirected = true;
                    this.clueNumber == 0;
                    console.log("nästa stad");
                    console.log(this.isRedirected)
                    clearInterval(this.fuseTimer);
                    if (Object.keys(this.cities).length === this.questionNumber) {
                        clearInterval(this.fuseTimer);
                        this.$router.push('/');
                    }
                    else {
                        clearInterval(this.fuseTimer);
                        this.$router.push('/afterclue/' + this.pollId + '/' + this.yourName);
                    }


                    // Check if you've already redirected to avoid multiple redirects
                    // if (!this.isRedirected) {
                    //     this.isRedirected = true;
                    //     console.log(this.isRedirected)
                    //     this.clueNumber == 0;

                    //     console.log("Redirecting to the next page");

                    //            // Use a Vue nextTick to ensure that the DOM has been updated

                    //     this.$router.push('/afterclue/' + this.pollId);

                    // }

                }
            }
        },



        startFuseTimer: function () {
            clearInterval(this.fuseTimer);

            // Adjust the timer interval based on your preference
            const timerInterval = 10; // 1 second

            this.fuseTimer = setInterval(() => {
                // Decrease the fuse width by a certain percentage
                this.fuseWidth -= 0.05; // Adjust as needed

                // Check if the fuse is completely burned
                if (this.fuseWidth <= 0) {
                    // Handle the event when the fuse is burned out
                    this.handleFuseBurnout();
                }
            }, timerInterval);
        }
    }
}
</script>  

<style scoped>
/*Explosion och keyframes gör inget atm, ska fixa det sen. */

.clueBox {

    display: grid;
    background-color: rgb(163, 163, 243);
    background-size: cover;

}

.tester {
    font-family: Georgia, 'Times New Roman', Times, serif;
    text-align: left;
    position: center;
    border-radius: 20px;
    text-align: center;
    font-size: 2vw;
    width: 50vw;
    height: 15vw;
    background-size: cover;
    background-color: rgb(201, 241, 244);
    border: 2px solid black;
    margin: 2vw auto 0 auto;
}

.tester input {
    font-size: 1.5vw;
    height: 2vw;
}

.clueAnswer {
    font-size: 1vw;
    height: 2vw;
    width: 10vw;
    position: right;
    margin-left: 5vw;
    background-color: gray;
    border: 2px solid black;
}

.clueAnswer:hover {
    cursor: pointer;
    background-color: green;
}

.green-button {
    background-color: green;
}

.labelSize {
    margin-top: 1vw;
    font-size: 1.2vw;
}

h1 {
    position: center;
    margin-top: 10vw;
}

h2 {
    position: center;
    margin-top: 10vw;
}
</style>

    h2 {
        position: center;
        margin-top: 10vw;
    }

@media screen and (max-width: 500px)  {

    h1{
        font-size: 12vw;
    }
    .tester {
    border-radius: 20px;
    text-align: center;
    font-size: 3vw;
    width: 80vw;
    height: 40vw;
    background-size: cover;
    background-color: rgb(201, 241, 244);
    border: 2px solid black;
    margin: 2vw auto 20vw auto;
    padding-bottom: 0vw ;   
    }
    .tester input{
        font-size: 1.5vw;
        margin-bottom: 10vw;
        margin-left: 9vw;
        height: 5vw;
        width: 50vw;
    }
    p{
        height: 10vw;
    }
    
    .clueAnswer{
        font-size: 1.5vw;
        height: 5vw;
        width: 10vw;
        position: center;
        margin-left: 5vw;
        margin-bottom: 10vw;

        padding-top: 1.5vw;         
        background-color: gray;
        border: 2px solid black;
    }
    .labelSize{
        font-size: 3vw;
    }


}
    </style>
