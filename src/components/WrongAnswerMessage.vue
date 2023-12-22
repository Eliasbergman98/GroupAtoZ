<template>
    <div v-if="showWrongMessage" class="wrong-answer-message">
      <h2>{{ uiLabels.wrongAnswer }}</h2>
      <p>{{ uiLabels.wrongAnswerMessage }}</p>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      uiLabels: Object,
      buttonClicked: Boolean,
      rightAnswer: Boolean,
    },
    computed: {
      showWrongMessage() {
        console.log('Button Clicked:', this.buttonClicked);
        console.log('Right Answer:', this.rightAnswer);
        return this.buttonClicked && !this.rightAnswer;
      },
    },
  };
  </script>
  

<style scoped>

.wrong-answer-message {
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
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

</style>