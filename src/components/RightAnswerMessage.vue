<template>
    <div v-if="showMessage" class="right-answer-message" style="background-color: yellow;">
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
  watch: {
    rightAnswer: function (newVal) {
      if (newVal) {
        this.showRightAnswerMessage();
      }
    },
  },
  computed: {
    showMessage() {
      console.log('Button Clicked:', this.buttonClicked);
      console.log('Right Answer:', this.rightAnswer);
      return this.buttonClicked && this.rightAnswer;
    },
  },
  methods: {
    showRightAnswerMessage() {
      console.log('Showing right answer message');
      // Additional logic for displaying the message
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
    background-color: #8eff8e;
    /* Light green background for a positive message */
    border-radius: 10px;
}
</style>
