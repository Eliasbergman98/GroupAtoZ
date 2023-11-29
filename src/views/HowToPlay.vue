<template>
    <div>
        <p>Test Test Test</p>
        <h1>{{ uiLabels.aboutText }}</h1>
        <p>{{ uiLabels.information1 }}</p>
        <br><br>
        <p>{{ uiLabels.information2 }}</p>
        <br><br>
        <h1>{{ ui.createGame1 }}</h1>
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
import ResponsiveNav from '@/components/ResponsiveNav.vue';
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
    name: 'HowToPlay',
    components: {
        ResponsiveNav
    },
    data: function () {
        return {
            uiLabels: {},
            id: "",
            lang: localStorage.getItem("lang") || "en",
            hideNav: true,
        }
    },
    created: function () {
        socket.emit("pageLoaded", this.lang);
        socket.on("init", (labels) => {
            console.log("Labels received:", labels);
            this.uiLabels = labels;
        })
    },
    methods: {
        switchLanguage: function (lang) {
            this.lang = lang;
            localStorage.setItem("lang", this.lang);
            socket.emit("switchLanguage", this.lang)
        },
        toggleNav: function () {
            this.hideNav = !this.hideNav;
        }
    }
}

</script>

<style></style>