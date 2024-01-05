<template>
    <div v-if="showMessage" class="right-answer-message">
      <h2>{{ uiLabels.rightAnswer }}</h2>
      <p>{{ uiLabels.rightAnswerMessage }}</p>
      <div class="extrapoint" v-if="showMessageExtraPoint"> 
        <h2> {{ uiLabels.fastestAnswer }}</h2>
        {{uiLabels.extraPointText}} </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      uiLabels: Object,
      buttonClicked: Boolean,
      rightAnswer: Boolean,
      extraPoint: Boolean
    },
    computed: {
      showMessage() {
        console.log('Button Clicked:', this.buttonClicked);
        console.log('Right Answer:', this.rightAnswer);
        return this.buttonClicked && this.rightAnswer;
      },
      showMessageExtraPoint() {
        console.log("Extra Point: ", this.extraPoint);
        return this.extraPoint;
      }
    },
  };
  </script>
  

<style scoped>
.right-answer-message {
    position: center;
    padding: 5em auto 2em 2em;
    font-size: 1.5vw;
    width: 50vw;
    min-height: 15vw;
    background-size: cover;
    border-radius: 2vw;
    background-color: #8eff8e;
    border: 2px solid black;
    margin-left: 25vw;
    margin-top: 3vw;
    text-align: center;
}
.extrapoint{
  height: 10vw;
}

@media screen and (max-width: 800px) {
  .right-answer-message{
        margin: 2vw auto 20vw auto;
        font-size: 3vw;
        width: 80vw;
        height: 40vw;
      }

    /* .extrapoint{
      height: 40vw;
    } */
}
</style>