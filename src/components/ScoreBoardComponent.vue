<template>
    <div class="score-board-component">
        <h2> {{ uiLabels.midScoreHeading }}</h2>
        <p> {{ uiLabels.midScoreText }} {{ participants[0].name }} {{ uiLabels.midScoreText1 }} {{ participants[0].points }}
            {{ uiLabels.points }}</p>
        <div class="participant-list">
            <div class="participant-item" v-for="person in participants" :key="participants.name">
                {{ person.name }}
                <div>
                    <img class="emojies" v-bind:src="person.avatar" target="_blank">
                </div>
                <div>
                    {{ person.points }}
                </div>
            </div>
            <div>
                <img id="result-train" src="/img/resultTrain.png">
            </div>
        </div>
    </div>
</template>
  
<script>
export default {
    props: {
        uiLabels: Object,
        nextCity: Boolean,
        participants: Array
    }
    //     methods: {

};
</script>
  

<style scoped>
.score-board-component {
    text-align: center;
    margin: 20px;
    padding: 10px;
    background-color: green;
    border-radius: 10px;
}

.emojies {
    width: 2vw;
    height: 2vw;
}

.participant-item {
    display: inline-block;
    justify-content: space-around;
    /* Adjust as needed */
    align-items: center;
    margin: 0 10px;
    /* Adjust margin as needed */
}

#result-train {
    width: 100%;
    height: 100%;
}
</style>