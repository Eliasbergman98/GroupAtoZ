    <template>
        <h1>
            {{uiLabels.whereTo}}
        </h1>

        {{ Object.values(cities)[0] }}
        <div class="clueBox">
            <div class="tester" v-if="cities && Object.values(cities).length > 0"> 
                    <p v-if="clueNumber === 0">
                        {{ uiLabels.clue6p }} <br> 
                        <div class="labelSize">{{ Object.values(cities)[0].clue1 }}</div> <br>
                    </p>
                    <p v-else-if="clueNumber === 1">
                        {{ uiLabels.clue4p }} <br> 
                        <div class="labelSize">{{ Object.values(cities)[0].clue2 }}</div> <br>
                    </p>
                    <p v-else-if="clueNumber === 2">
                        {{ uiLabels.clue2p }} <br> 
                        <div class="labelSize">{{ Object.values(cities)[0].clue3 }}</div> <br>
                    </p>
                    <p v-else-if="clueNumber > 2 ">
                        
                    </p>
                    <input v-model="answerClue" id="addPlayerAnswer" name="addPlayerAnswer" type="text">
                    <button v-on:click="addPlayerAnswer" class="clueAnswer"> 
                        Add answer
                    </button> 

                
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

    const timeObject= {} ;
    export default {
        name: 'ClueView',
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
                answerClue: "",
                cities: {},
                clueNumber: 0,
            }
        },
        created: function () {
            this.pollId = this.$route.params.pollId;
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
            socket.on("fullPole", (data)=> { 
                this.data = data;
                this.cities = data.cities;
                console.log("Initial data.cities:", this.cities);
            });
            this.startFuseTimer();


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
            addPlayerAnswer: function () {
                socket.emit("addPlayerAnswer", {pollId: this.pollId, answers: this.answerClue})
                console.log(this.answerClue)
            },

            handleFuseBurnout() {
                this.fuseWidth = 100;
                this.addPlayerAnswer();
                this.handleClues();
                this.answerClue= "";
                this.startFuseTimer();
                //console.log(this.addPlayerAnswer)

            },

            handleClues() {
                const lengthCities = Object.keys(this.cities).length;
                console.log(lengthCities);
                if (this.cities && Object.keys(this.cities).length > 0 && lengthCities > 0) {
                    for (const cityName in this.cities) {
                        const city = this.cities[cityName];
                        for(const cityClues in city){
                            if (this.clueNumber == 0) {
                                console.log(`${cityName}: ${city.clue1}`);
                            }
                            else if (this.clueNumber == 1) {
                                console.log(`${cityName}: ${city.clue2}`);
                            }
                            else if (this.clueNumber == 2) {
                                console.log(`${cityName}: ${city.clue3}`);
                            }
                        }
                    }
                    this.clueNumber += 1;

                    if (this.clueNumber > 2) {
                        clearInterval(timeObject.intervalId);
                        console.log("nästa stad");
                        this.clueNumber = 0;
                        this.$router.push('/afterclueview/' + this.pollId);
                        //gå till nästa stad
        }
            }
            },



        startFuseTimer: function () {
            // Adjust the timer interval based on your preference
            const timerInterval = 10; // 1 second

            let intervalId = setInterval(() => {
                // Decrease the fuse width by a certain percentage
                this.fuseWidth -= 0.2; // Adjust as needed

                // Check if the fuse is completely burned
                if (this.fuseWidth <= 0) {
                    // Handle the event when the fuse is burned out
                    this.handleFuseBurnout();
                    clearInterval(timeObject.intervalId);

                }
            }, timerInterval);
            timeObject.intervalId = intervalId;
        }
    }}
    </script>  

    <style scoped>
    /*Explosion och keyframes gör inget atm, ska fixa det sen. */

    .clueBox{

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
    font-size:2vw;
    width: 50vw;
    height: 15vw;
    background-size: cover;
    background-color: rgb(201, 241, 244);
    border: 2px solid black;
    margin: 2vw auto 0 auto;
    }
    
    .tester input{
        font-size: 1.5vw;
        height: 2vw;
    }
    .clueAnswer{
        height: 2vw;
        width: 10vw;
        position: right;
        margin-left: 5vw;
    }
    .labelSize{
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