<template>
    <div class="custom-alert" :class="{ 'visible': visible }">
      <div class="alert-box">
        <div class="alert-header">
          <button @click="closeAlert">X</button>
        </div>
        <div class="alert-content">
          {{ alertContentText }}
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
      },
    },
    data() {
      return {
        visible: false,
      };
    },
    methods: {
      openAlert() {
        this.visible = true;
      },
      closeAlert() {
        this.visible = false;
      },
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
    opacity: 0; /* Set initial opacity to 0 */
    pointer-events: none; /* Disable pointer events initially */
    transition: opacity 0.3s ease; /* Add a transition effect for opacity */
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  }
  
  .visible {
    opacity: 1; /* Set opacity to 1 when visible */
    pointer-events: auto; /* Enable pointer events when visible */
  }
  
  .alert-box {
    background-color: white;
    padding: 5vw;
    border: 2px solid black;
    border-radius: 25px;
    width: 300px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  }
  
  .alert-header {
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  position: relative; /* Add position relative to allow absolute positioning of the close button */
}

.alert-header button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  position: absolute; /* Position the button absolutely */
  top: -4vw; /* Adjust the top position as needed */
  right: -4vw; /* Adjust the right position as needed */
}
  </style>
  