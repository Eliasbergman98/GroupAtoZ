<template>
    <div v-if="showMessage" class="right-answer-message">
      <h2>{{ uiLabels.rightAnswer }}</h2>
      <p>{{ uiLabels.rightAnswerMessage }}</p>
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
      showMessage() {
        console.log('Button Clicked:', this.buttonClicked);
        console.log('Right Answer:', this.rightAnswer);
        return this.buttonClicked && this.rightAnswer;
      },
    },
  };
  </script>
  

<style scoped>
.right-answer-message {
    position: center;
    padding: 10em auto 2em 2em;
    font-size: 2vw;
    width: 50vw;
    height: 15vw;
    background-size: cover;
    border-radius: 2vw;
    background-color: #8eff8e;
    border: 2px solid black;
    margin-left: 25vw;
    margin-top: 3vw;
    text-align: center;
}

@media screen and (max-width: 800px) {
  .right-answer-message{
        margin: 2vw auto 20vw auto;
        font-size: 3vw;
        width: 80vw;
        height: 40vw;
      }
}
</style>