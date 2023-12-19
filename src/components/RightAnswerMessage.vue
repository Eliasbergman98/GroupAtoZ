<template>
  <div v-if="showMessage" class="right-answer-message">
    <h2>{{ uiLabels.rightAnswer }}</h2>
    <p>{{ uiLabels.rightAnswerMessage }}</p>
  </div>
</template>

<script>
export default {
  props: {
    uiLabels: Object, // Pass the uiLabels as a prop to the component
    buttonClicked: Boolean, // Pass the buttonClicked prop to the component
    isRightAnswer: Boolean, // Pass the isRightAnswer prop to the component
  },
  computed: {
    showMessage() {
      // Only show the message if the button is clicked and the answer is right
      return this.buttonClicked && this.isRightAnswer;
    },
  },
};
</script>

<style scoped>
/* Add styles specific to the right answer message component */
.right-answer-message {
  text-align: center;
  margin: 20px;
  padding: 10px;
  background-color: #8eff8e; /* Light green background for a positive message */
  border-radius: 10px;
}
</style>
