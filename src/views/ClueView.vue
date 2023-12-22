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
                <right-answer-message :uiLabels="uiLabels" :buttonClicked="buttonClicked"
                    :rightAnswer="rightAnswer"></right-answer-message>
            </div>
            <div v-else-if="!showRightAnswer && !rightAnswer && wrongAnswer">
                <wrong-answer-message :uiLabels="uiLabels" :buttonClicked="buttonClicked"
                    :rightAnswer="rightAnswer"></wrong-answer-message>
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
                        <div v-if="creator">
                            {{ uiLabels.waitingForAnswers }}
                        </div>
                        <div v-else>
                            <div v-if="!rightAnswer && !showRightAnswer">
                                <input v-model="answerClue" id="addPlayerAnswer" name="addPlayerAnswer" type="text">
                                <button v-on:click="addPlayerAnswer" class="clueAnswer"
                                    :class="{ 'green-button': isButtonGreen, 'no-hover': buttonClicked }">
                                    <div v-if=!buttonClicked>
                                        {{ uiLabels.addAnswer }}
                                    </div>
                                    <div v-else=buttonClicked>
                                        {{ uiLabels.thankYou }}
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
            <img id="fuseLine" src="/img/test1.png" :style="{ width: fuseWidth + 'vw', height: '10vw' }">
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
            pollId: "",
            quizName: '',
            questionNumber: 0,
            data: {},
            uiLabels: {},
            fuseWidth: 100,
            answerClue: "",
            cities: {},
            clueNumber: 0,
            isMuted: false,
            isRedirected: false,
            dataLoaded: false,
            buttonClicked: false,
            yourName: "",
            creator: false,
            rightAnswer: false,
            wrongAnswer: false,
            timesPressedButton: 0,
            showRightAnswer: false,
        }
    },
    computed: {
        buttonImage() {
            return this.isMuted ? pressToMuteImage : pressToUnmuteImage;
        },
        isButtonGreen() {
            return this.answerClue !== "" && !this.buttonClicked;// &&   //&& !this.buttonClicked
        }
        // Compute the image source based on the button state
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
        socket.on("fullPole", (data) => {
            this.data = data;
            this.cities = data.cities;
            this.quizName = data.quizName;
            this.questionNumber = data.currentQuestion;
            this.dataLoaded = true;
            this.startFuseTimer();
            this.checkIfCreator();
        });

        socket.on("yourPoints", (data) => {
            this.rightAnswer = data;
        });
    },
    methods: {
        toggleMute() {
            const audioPlayer = this.$refs.audioPlayer;

            // Toggle the muted attribute
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
                socket.emit("checkAnswer", { pollId: this.pollId, answer: this.answerClue, name: this.yourName, clueNumber: this.clueNumber, rightAnswer: this.rightAnswer })
                socket.on("yourPoints", (data) => {
                    this.rightAnswer = data;
                    console.log("var det rätt svar? ", this.rightAnswer)
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
            this.fuseWidth = 100;
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
            if (!this.dataLoaded) {
                // Data hasn't been loaded yet, do not attempt to redirect
                return;
            }
            const lengthCities = Object.keys(this.cities).length;
            //console.log(lengthCities);
            if (this.cities && lengthCities > 0) {
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
                            clearInterval(sessionStorage.getItem("fuseTimer"));
                            this.clueNumber == 0;
                            console.log("nästa stad");
                            console.log(this.isRedirected)

                            if (Object.keys(this.cities).length === this.questionNumber) {
                                this.$router.push('/lastresult/' + this.pollId);
                            }
                            else {
                                this.$router.push('/afterclue/' + this.pollId + '/' + this.yourName);
                            }
                        }
                    }
                }
                if (this.clueNumber === 3 && !this.isRedirected) {
                    this.isRedirected = true;


                }
            }
        },



        startFuseTimer: function () {
            clearInterval(sessionStorage.getItem("fuseTimer"));

            // Adjust the timer interval based on your preference
            const timerInterval = 10; // 1 second
            sessionStorage.setItem("fuseTimer", setInterval(() => {
                // Decrease the fuse width by a certain percentage
                this.fuseWidth -= 0.07; // Adjust as needed

                // Check if the fuse is completely burned
                if (this.fuseWidth <= 0) {
                    // Handle the event when the fuse is burned out
                    this.handleFuseBurnout();
                }
            }, timerInterval) );
            
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
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
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
    margin-top: 1vw;
}

.tester input {
    font-size: 1.5vw;
    height: 2vw;
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
    font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
}

.clueAnswer:hover {
    cursor: pointer;
    background-color: green;
}

.green-button {
    background-color: green;
}

.no-hover:hover {
    cursor: default;
    background-color: gray;
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

h2 {
    position: center;
    margin-top: 10vw;
}

@media screen and (max-width: 800px) {

    h1 {
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

    .clueAnswer {
        font-size: 1.5vw;
        height: 5vw;
        width: 10vw;
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
        width: 7vw;
        height: 7vw;
        padding: 0.5vw 0 0 0.5vw;
        /* Adjusted padding */
        margin-left: 40vw;
        margin-top: 3.5vw;
    }
}
</style>