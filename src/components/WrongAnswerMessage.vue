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
    watch: {
      rightAnswer: function (newVal) {
        if (newVal) {
          this.showRightAnswerMessage();
        }
      },
    },
    computed: {
      showWrongMessage() {
        console.log('Button Clicked:', this.buttonClicked);
        console.log('Right Answer:', this.rightAnswer);
        return this.buttonClicked && this.rightAnswer;
      },
    },
    methods: {
      showRightAnswerMessage() {
        console.log('Showing right answer message');
      },
    },
  };
  </script>
  

<style scoped>
.wrong-answer-message {
    text-align: center;
    margin: 20px;
    padding: 10px;
    background-color: #d22035;
    border-radius: 10px;
}
</style>