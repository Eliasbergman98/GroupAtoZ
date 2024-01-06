<template>
  <div class="custom-alert" :class="{ 'visible': visible }">
    <div class="overlay"></div>
    <div class="alert-box">
      <div class="alert-header" v-if=!inCreateQuestionsView>
        <button id="xbutton" @click="closeAlert">X</button>
      </div>
      <div>
        {{ alertContentText }}
      </div>
      <div v-if="inCreateQuestionsView">
        <button id="nobutton" @click="closeAlert"> {{ noText }} </button>
        <button id="yesbutton" @click="continueGame"> {{ yesText }} </button>
      </div>
    </div>
  </div>
</template>
  
<script>
export default {
  props: {
    alertContentText: {
      type: String,
      default: "",
    }
  },
  data() {
    return {
      visible: false,
      inCreateQuestionsView: false,
      gameId: "",
      noText: "",
      yesText: ""
    };
  },
  methods: {
    openAlert(inCreateQuestionsView, gameId, yesText, noText) {
      this.gameId = gameId
      this.visible = true;
      this.yesText = yesText;
      this.noText = noText;
      this.inCreateQuestionsView = inCreateQuestionsView;
    },
    closeAlert() {
      this.visible = false;
    },
    continueGame() {
      this.$router.push('/creatorwaiting/' + this.gameId);
    }
  },
};
</script>
  
<style scoped>
.custom-alert {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
  font-size: 1.7vw;
}

.visible {
  opacity: 1;
  pointer-events: auto;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: -1;
}
.alert-box {
  background-color:rgb(184, 187, 237);
  padding: 5vw;
  border: 2px solid black;
  border-radius: 20px;
  width: 25vw;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  font-weight: bold;
}

.alert-header {
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  position: relative;
}

#xbutton {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  position: absolute;
  top: -4vw;
  right: -4vw;
}

#nobutton {
  font-size: 1.5vw;
  position: left;
  background-color: red;
  color: white;
  padding: 1vw;
  border-radius: 1vw;
  border: 1 px solid black;
  margin-top: 2vw;
  margin-left: 2vw;
  margin-right: 6vw;
  width: 6vw;
}

#yesbutton {
  font-size: 1.5vw;
  position: right;
  background-color: green;
  color: white;
  padding: 1vw;
  border: 1 px solid black;
  border-radius: 1vw;
  margin-top: 2vw;
  margin-left: 3vw;
  width: 6vw;
}

@media screen and (max-width: 800px) {
.custom-alert{
  font-size: 6vw;
  }
.alert-box {
  width: 50vw;
  height: auto;
}
#yesbutton {
  font-size: 2.5vw;
  margin-top: 2vw;
  margin-left: 9vw;
  margin-right: 6vw;
  width: 12vw;
}

#nobutton {
  font-size: 2.5vw;
  margin-top: 3vw;
  margin-left: 2vw;
  width: 12vw;
}
}
</style>
  