<template>
    <div class="score-board-component">
        <h2> {{ uiLabels.midScoreHeading }} {{ questionNumber - 1 }}</h2>
       <div> {{ uiLabels.rightAnswerText }} {{ Object.keys(cities)[questionNumber - 2] }} </div>
        <p> {{ topParticipantsText }}</p>
        <div class="participant-list">
            <div class="participant-item" v-for="person in participants" :key="person.name">
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
        participants: Array,
        cities: Object,
        questionNumber: Number
    },
    computed: {
        topParticipants() {
            if (this.participants.length === 0) {
                return [];
            }

            const highestPoints = this.participants.reduce((maxPoints, person) => Math.max(maxPoints, person.points), 0);

            return this.participants.filter(person => person.points === highestPoints);
        },
        topParticipantsText() {
            const topParticipants = this.topParticipants;

            if (topParticipants.length === 1) {
                return `${this.uiLabels.midScoreText} ${topParticipants[0].name} ${this.uiLabels.midScoreText1} ${topParticipants[0].points} ${this.uiLabels.points}`;
            } else if (topParticipants.length > 1) {
                const names = topParticipants.map(person => person.name).join(', ');
                return `${this.uiLabels.midScoreTextMultiple} ${names} ${this.uiLabels.midScoreText1} ${topParticipants[0].points} ${this.uiLabels.points}`;
            } else {
                return 'No participants';
            }
        }

    }
}
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