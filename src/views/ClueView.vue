    <template>
        <h1>
            {{uiLabels.whereTo}}
        </h1>

        {{ data.cities }}
        <div class="clueBox">
        <div class="tester" v-for="(cityClue,cityName) in cities" :key="cityName">
            {{ cityClue }}
            hej

            
             <br>
            <input v-model="answerClue" id="addPlayerAnswer" name="addPlayerAnswer" type="text" >
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
                answers: ["", ""],
                questionNumber: 0,
                data: {},
                uiLabels: {},
                selectedAvatar: null,
                avatars: avatar,
                fuseWidth: 100,
                answerClue: "",
                cities: {},
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
                console.log("hej", data.cities)
                
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
                socket.emit("addPlayerAnswer", { pollId: this.pollId, answer: this.answerClue  })
            },
            handleFuseBurnout() {
                this.fuseWidth = 100;
                this.addPlayerAnswer();
                console.log(this.addPlayerAnswer)

            },

        startFuseTimer: function () {
            clearInterval(this.fuseTimer);
            // Adjust the timer interval based on your preference
            const timerInterval = 10; // 1 second

            setInterval(() => {
                // Decrease the fuse width by a certain percentage
                this.fuseWidth -= 0.5; // Adjust as needed

                // Check if the fuse is completely burned
                if (this.fuseWidth <= 0) {
                    // Handle the event when the fuse is burned out
                    this.handleFuseBurnout();
                }
            }, timerInterval);
        }
    }}
    </script>  

    <style scoped>
    /*Explosion och keyframes gör inget atm, ska fixa det sen. */

    .clueBox{

    display: grid;
    background-color: rgb(163, 163, 243);
    grid-gap: 3vw;
    background-size: cover;

    }
    .tester {
    font-family: Georgia, 'Times New Roman', Times, serif;
    width: 50vw;
    height: 1vw;
    text-align: left;
    position: center;
    border-radius: 20px;
    padding: 10em auto 2em 2em;
    text-align: center;
    font-size:2vw;
    width: 50vw;
    height: 5vw;
    background-size: cover;
    background-color: rgb(201, 241, 244);
    border: 2px solid black;
    margin: 5vw auto;

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