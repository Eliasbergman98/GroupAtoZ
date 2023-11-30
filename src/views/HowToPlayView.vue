<template>
    <div>
        <p>Test Test Test</p>
        <h1>{{ uiLabels.aboutText }}</h1>
        <p>{{ uiLabels.information1 }}</p>
        <br><br>
        <p>{{ uiLabels.information2 }}</p>
        <br><br>
        <h1> {{ uiLabels.createGame1 }} </h1>
        <br><br>
        <p>{{ uiLabels.information3 }}</p>
        <br><br>
        <p>{{ uiLabels.information4 }}</p>
        <br><br>
        <p>{{ uiLabels.information5 }}</p>
        <br><br>
        <p>{{ uiLabels.information6 }}</p>
    </div>
</template>

<script>
import QuestionComponent from '@/components/QuestionComponent.vue';
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
  name: 'HowToPlay',
  components: {
    QuestionComponent
  },
  data: function () {
    return {
      uiLabels: {},
      lang: localStorage.getItem("lang") || "en",
    }
  },
  created: function () {
    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels
    })
  }
}
</script>


<style>
div {
    background-color: rgb(163, 163, 243);
}
</style>