<template>
<p>{{question.q}}</p>
<button v-for="a in question.a" v-on:click="answer(a)" v-bind:key="a">
  {{ a }}
</button>
<div>
  <QuestionComponent v-bind:pollId="pollId"/>
</div>
</template>
<script>
export default {
  name: 'QuestionComponent',
  props: {
    question: Object,
    pollId: String
  },
  emits: ["answer"], 
  methods: {
    answer: function (answer) {
      this.$emit("answer", answer);
    } 
    
  }
}
</script>