<template>
    <div class="custom-alert" v-if="showLastCityAnswer" :class="{'showLastCityAnswer': showLastCityAnswer}">
        <div class="overlay"></div>
        <div class="alert-box">
            <div class="alert-content">
                {{ uiLabels.rightAnswerText }}:
                <br>
                {{ Object.keys(cities).slice(-1)[0] }}
                <div>
                    <button id="finalresultbutton" v-on:click="toFinalResult"> {{ uiLabels.toFinalResult }}</button>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
export default {
    props: {
        uiLabels: Object,
        cities: Object
    },
    data() {
        return {
            showLastCityAnswer: true
        };
    },
    methods: {
        toFinalResult() {
            this.showLastCityAnswer = false;
        }
    }
};
</script>
  
<style scoped>
.custom-alert {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
    font-size: 1.7vw;
}

.showLastCityAnswer {
    opacity: 1;
    pointer-events: auto;
}

.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: -1;
}

.alert-box {
    background-color: rgb(201, 241, 244);
    padding: 5vw;
    border: 2px solid black;
    border-radius: 20px;
    width: 45vw;
    height: 15vw;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    font-weight: bold;
}

.alert-content {
    margin-top: 2vw;
}

#finalresultbutton {
    font-size: 1.5vw;
    position: right;
    color: white;
    padding: 1vw;
    border: 1 px solid black;
    border-radius: 1vw;
    margin-top: 4vw;
    width: 20vw;
    font-weight: bold;
}

@media screen and (max-width: 800px) {
    .custom-alert {
        font-size: 4vw;
    }

    .alert-box {
        width: 60vw;
        height: auto;
    }

    #finalresultbutton {
        font-size: 3vw;
        margin-top: 5vw;
        width: 30vw;
        height: 10vw;
    }
}
</style>
  