<template>
    <header>
        <img class="muteButton" @click="toggleMute" :src="buttonImage" alt="Toggle Mute" />
    </header> <br>
    <h1>
        {{ uiLabels.whereTo }}
    </h1>
    <audio ref="audioPlayer" autoplay loop>
        <source src="/img/clueMusic.mp3" type="audio/mp3" />
        Your browser does not support the audio element.
    </audio>
    <div class="clueBox">
        <div v-if="cities && Object.values(cities).length > 0">
            <div v-if="showRightAnswer && rightAnswer && !wrongAnswer">
                <right-answer-message :uiLabels="uiLabels" :buttonClicked="buttonClicked" :rightAnswer="rightAnswer"
                    :extraPoint="extraPoint"></right-answer-message>
            </div>
            <div v-else-if="!showRightAnswer && !rightAnswer && wrongAnswer">
                <wrong-answer-message :uiLabels="uiLabels" :buttonClicked="buttonClicked"
                    :rightAnswer="rightAnswer" :clueNumber="clueNumber"></wrong-answer-message>
            </div>
            <div v-else>
                <div class="clueBox">
                    <div class="tester">
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
                        <p v-else-if="clueNumber > 2"></p>
                        <div class="creatormode" v-if="creator">
                            {{ uiLabels.waitingForAnswers }}
                        </div>
                        <div v-else>
                            <div v-if="!rightAnswer && !showRightAnswer">
                                <input v-model="answerClue" id="addPlayerAnswer" name="addPlayerAnswer" type="text">
                                <button v-on:click="addPlayerAnswer" class="clueAnswer"
                                    :class="{ 'green-button': answerClue !== '' }">
                                    <div>
                                        {{ uiLabels.addAnswer }}
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <footer>
        <div class="fuse-container">
            <img id="fuseLine" src="/img/redbar1.png" :style="{ width: fuseWidth + 'vw', height: '10vw' }">
        </div>
    </footer>
</template>
    
<script>
import io from 'socket.io-client';
const socket = io(sessionStorage.getItem("localhost"));
import RightAnswerMessage from '@/components/RightAnswerMessage.vue';
import WrongAnswerMessage from '@/components/WrongAnswerMessage.vue';
import pressToMuteImage from "/img/soundon.png";
import pressToUnmuteImage from "/img/soundoff.png";

export default {
    name: 'ClueView',
    components: {
        RightAnswerMessage,
        WrongAnswerMessage
    },
    data: function () {
        return {
            lang: localStorage.getItem("lang") || "en",
            gameId: "",
            quizName: '',
            questionNumber: 0,
            uiLabels: {},
            fuseWidth: 98,
            answerClue: "",
            cities: {},
            clueNumber: 0,
            isMuted: false,
            dataLoaded: false,
            buttonClicked: false,
            yourName: "",
            creator: false,
            rightAnswer: false,
            wrongAnswer: false,
            timesPressedButton: 0,
            showRightAnswer: false,
            extraPoint: false
        }
    },
    computed: {
        buttonImage() {
            return this.isMuted ? pressToUnmuteImage : pressToMuteImage; 
        },
    },
    created: function () {
        this.gameId = this.$route.params.gameId;
        this.yourName = this.$route.params.yourName;
        socket.emit("getGame", this.gameId);
        socket.emit("pageLoaded", this.lang);
        socket.on("init", (labels) => {
            this.uiLabels = labels;
        });
        socket.on("fullGame", (data) => {
            this.cities = data.cities;
            this.quizName = data.quizName;
            this.questionNumber = data.currentQuestion;
            this.dataLoaded = true;
            this.startFuseTimer();
            this.checkIfCreator();
        });
    },
    methods: {
        toggleMute() {
            const audioPlayer = this.$refs.audioPlayer;
            audioPlayer.muted = !audioPlayer.muted;
            this.isMuted = !this.isMuted;
        },
        addPlayerAnswer: function () {
            this.buttonClicked = true;
            if (this.answerClue === "" && this.timesPressedButton < 1) {
                console.log("här borde det komma in")
                this.buttonClicked = false;
                return;
            }
            else if (this.rightAnswer != true && this.timesPressedButton < 1) {
                socket.emit("checkAnswer", { gameId: this.gameId, answer: this.answerClue, name: this.yourName, clueNumber: this.clueNumber, rightAnswer: this.rightAnswer, answerTime: this.fuseWidth })
                socket.on("yourPoints", (data) => {
                    this.rightAnswer = data[0];
                    this.extraPoint = data[1];
                    console.log("var det rätt svar? ", this.rightAnswer)
                    console.log("var det ett extrapoäng? ", this.extraPoint)
                    if (this.rightAnswer) {
                        this.showRightAnswer = true;
                        console.log("showRightAnswer: ", this.showRightAnswer)
                    }
                    else {
                        this.wrongAnswer = true;
                    }
                });
                this.timesPressedButton = + 1;
                this.answerClue = "";
            }
        },
        handleFuseBurnout() {
            if (this.rightAnswer) {
                this.showRightAnswer = false;
            }
            else {
                this.wrongAnswer = false;
            }
            this.fuseWidth = 98;
            this.buttonClicked = false;
            this.handleClues();
            this.answerClue = "";
            this.timesPressedButton = 0;
        },
        checkIfCreator() {
            if (this.yourName === this.quizName) {
                this.creator = true;
            }
        },
        handleClues() {
            if (!this.dataLoaded) return;
            const lengthCities = Object.values(this.cities).length;
            if (this.cities && lengthCities > 0) {
                this.clueNumber += 1;
                for (const [cityName, city] of Object.entries(this.cities)) {
                    const clueNumber = this.clueNumber;
                    if (clueNumber <= 3) {
                        console.log(`${cityName}: ${city[`clue${clueNumber}`]}`);
                    }
                    if (clueNumber === 3) {
                        clearInterval(sessionStorage.getItem("fuseTimer"));
                        this.clueNumber = 0;
                        if (lengthCities === this.questionNumber) {
                            this.$router.push(`/lastresult/${this.gameId}`);
                        } else {
                            socket.emit("newClue", this.gameId)
                            this.$router.push(`/afterclue/${this.gameId}/${this.yourName}`);
                        }
                    }
                }
            }
        },
        startFuseTimer: function () {
            clearInterval(sessionStorage.getItem("fuseTimer"));
            const timerInterval = 10; // 1 second
            sessionStorage.setItem("fuseTimer", setInterval(() => {
                this.fuseWidth -= 0.035; // Adjust as needed
                if (this.fuseWidth <= 0) {
                    this.handleFuseBurnout();
                }
            }, timerInterval));
        }
    }
}
</script>  

<style scoped>
.clueBox {
    display: grid;
    background-size: cover;
}
#addPlayerAnswer{
    margin-top: 3vw;
}

.tester {
    text-align: left;
    position: center;
    border-radius: 20px;
    text-align: center;
    font-size: 2vw;
    width: 50vw;
    height: 20vw;
    background-size: cover;
    background-color: rgb(201, 241, 244);
    border: 2px solid black;
    margin: 2vw auto 0 auto;
    margin-top: 1vw;
    font-weight: bold;
}

.tester input {
    font-size: 1.5vw;
    height: 2vw;
}
.creatormode{
    margin-top: 2vw;
}

.clueAnswer {
    font-size: 1vw;
    height: 5.5vh;
    width: 10vw;
    position: right;
    margin-left: 2vw;
    background-color: gray;
    border: 2px solid black;
    border-radius: 1vw;
    padding: 1vh;
    text-align: center;
    margin-bottom: 1.5vh;
    color: white;
}

.green-button {
    background-color: green;
}

.clueAnswer:hover {
    cursor: pointer;
}

.labelSize {
    margin-top: 1vw;
    font-size: 1.2vw;
}

h1 {
    position: center;
    margin-top: 2vw;
}

h2 {
    position: center;
    margin-top: 10vw;
}

h2 {
    position: center;
    margin-top: 10vw;
}

@media screen and (max-width: 1000px) {

    h1 {
        font-size: 12vw;
        margin-top: 10vw;
    }
    #addPlayerAnswer{
    margin-top: 10vw;
}

    .tester {
        border-radius: 20px;
        text-align: center;
        font-size: 3vw;
        width: 80vw;
        height: 40vw;
        background-size: cover;
        border: 2px solid black;
        margin: 2vw auto 20vw auto;
        padding-bottom: 0vw;
    }

    .tester input {
        font-size: 1.5vw;
        margin-bottom: 10vw;
        margin-left: 9vw;
        height: 5vw;
        width: 50vw;
    }

    p {
        height: 10vw;
    }

    .creatormode{
    font-size: 4vw;

    margin-top: 20vw;
}

    .clueAnswer {
        font-size: 1.5vw;
        height: 5.5vw;
        width: 10.5vw;
        position: center;
        margin-left: 5vw;
        margin-bottom: 10vw;
        padding-top: 0.8vw;
    }

    .labelSize {
        font-size: 3vw;
    }

    .muteButton {
        position: absolute;
        width: 4vw;
        height: 4vw;
        padding: 0.5vw 0 0 0.5vw;
        margin-left: 42vw;
        margin-top: 2vw;
    }
}
</style>