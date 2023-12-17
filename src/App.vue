<script setup>
import { RouterView } from 'vue-router'

</script>

<template>
    <audio ref="audioPlayer" loop>
      <source src="/img/villeTrainSounds.mp3" type="audio/mp3" />
      Your browser does not support the audio element.
    </audio>
  <RouterView />

</template>

<style>

</style>
