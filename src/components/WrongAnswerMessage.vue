<template>
    <div v-if="showWrongMessage" class="wrong-answer-message">
      <h2>{{ uiLabels.wrongAnswer }}</h2>
      <p v-if="clueNumber === 2">{{ uiLabels.wrongAnswerMessage }}</p>
      <div v-if="clueNumber === 0 || clueNumber === 1">
      {{ uiLabels.wrongAnswerNextClue }}</div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      uiLabels: Object,
      buttonClicked: Boolean,
      rightAnswer: Boolean,
      clueNumber: Number
    },
    computed: {
      showWrongMessage() {
        return this.buttonClicked && !this.rightAnswer;
      },
    },
  };
  </script>
  

<style scoped>

.wrong-answer-message {
    position: center;
    padding: 10em auto 2em 2em;
    font-size: 2vw;
    width: 50vw;
    height: 15vw;
    background-size: cover;
    border-radius: 2vw;
    background-color: #d22035;
    border: 2px solid black;
    margin-left: 25vw;
    margin-top: 3vw;
    text-align: center;
}

@media screen and (max-width: 800px) {
  .wrong-answer-message{
        margin: 2vw auto 20vw auto;
        font-size: 3vw;
        width: 80vw;
        height: 40vw;
      }
}

</style>