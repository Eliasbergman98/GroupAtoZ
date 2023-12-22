<template>
    <div class="score-board-component">
        <h2>{{ uiLabels.midScoreHeading }} {{ questionNumber - 1 }}</h2>
        <h3 class="top-participant">{{ topParticipantsText }}</h3>
        <div class="participant-list">
            <ol>
                <li v-for="(person, index) in participants" :key="person.name" class="participant-item">
                    <div class="participant-info">
                        <div class="name-avatar">
                            {{ person.name }} <img class="emojies" v-bind:src="person.avatar" target="_blank">
                        </div>
                        <span class="points">{{ person.points }}</span>
                    </div>
                </li>
            </ol>
        </div>
        <div class="right-answer-box">
        <p class="right-answer">{{ uiLabels.rightAnswerText }}:
            {{ Object.keys(cities)[questionNumber - 2] }}
        </p>
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
        },
    }
}
</script>
  

<style scoped>

.right-answer,
.top-participant {
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    color: black;
    font-size: 2vw;
}

.participant-item {
    padding: 1vw;
    margin-bottom: 0.5vw;
}

.participant-item:nth-child(odd) {
    background-color: rgb(140, 204, 140);
}

.participant-item:nth-child(even) {
    background-color: #e3a5d3;
}

.score-board-component {
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    position: center;
    padding: 10em auto 2em 2em;
    font-size: 2vw;
    width: 50vw;
    height: 40vw;
    background-size: cover;
    /* border-radius: 2vw;
    background-color: rgb(201, 241, 244);
    border: 2px solid black; */
    margin-left: 25vw;
    margin-top: 3vw;
}

.participant-list {
  padding: 10em auto 2em 2em;
  margin-left: 1vw;
  margin-right: 4vw;
  text-align: left;
  /* max-height: 20vw;
  overflow-y: auto; */
}

.participant-item {
    list-style-type: none;
}

.participant-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.emojies {
    width: 2vw;
    height: 2vw;
}

.points {
    text-align: right;
}</style>
