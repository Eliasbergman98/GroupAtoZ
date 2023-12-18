'use strict';
const languages = ["en", "se"];
import { readFileSync } from "fs";

// Store data in an object to keep the global namespace clean
function Data() {
  this.polls = {};
  // this.polls['test']= {
  //  lang: "en",
  //  quizName: "testquiz",
  //  cities: { "uppsala": {clue1: "veronica maggio", clue2: "Mares", clue3: "ångan"}},
  // answers: [],
  //   participants: []
  //  }
}

/***********************************************
For performance reasons, methods are added to the
prototype of the Data object/class
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures
***********************************************/

Data.prototype.getUILabels = function (lang = "en") {
  const labels = readFileSync("./server/data/labels-" + lang + ".json");
  return JSON.parse(labels);
}

Data.prototype.createPoll = function (pollId, lang = "en", quizName, selectedAvatar) {
  if (typeof this.polls[pollId] === "undefined") {
    let poll = {};
    poll.selectedAvatar = selectedAvatar;
    poll.quizName = quizName;
    poll.cities = {};
    poll.lang = lang;
    poll.questions = [];
    poll.answers = [];
    poll.currentQuestion = 0;
    this.polls[pollId] = poll;
    poll.participants = [];
    console.log("poll created in data", pollId, poll);
  }
  console.log("poll created before return", pollId);
  return this.polls[pollId];
}

Data.prototype.createParticipant = function (pollId, name, answer) {
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {
    for (let i = 0; i < poll.participants.length; i++) {
      if (poll.participants[i].name === name) {
        // poll.participants[i].answers.push(answer);
        console.log("answer push", name)
      }
    }
  }
  return name;
}

Data.prototype.getPoll = function (pollId) {
  console.log("in data getfunction:", this.polls)
  return this.polls[pollId] || {};
}

// Data.prototype.addQuestion = function(pollId, city, clue1, clue2, clue3) {
//   const poll = this.polls[pollId];
//   console.log("question added to", pollId, city, clue1, clue2, clue3);
//   if (typeof poll !== 'undefined') {
//     poll.questions.push(city);
//   }
// }
Data.prototype.addCity = function (pollId, city, clue1, clue2, clue3) {
  const poll = this.polls[pollId];
  console.log("question added to", pollId, city);
  if (typeof poll !== 'undefined') {
    poll.cities[city] = {
      clue1: clue1,
      clue2: clue2,
      clue3: clue3,
    };
    console.log("added city:", city)
  }
}

Data.prototype.removeCity = function (pollId, city) {
  const poll = this.polls[pollId];
  console.log("question removed from", pollId, city);
  if (typeof poll !== 'undefined') {
    delete poll.cities[city];
    //  poll.cities[city] = {
    //   clue1: clue1,
    //   clue2: clue2,
    //   clue3: clue3,
    //};

    console.log("removed city:", city)
  }
}

Data.prototype.addParticipant = function (pollId, name, selectedAvatar, quizName) {
  const poll = this.polls[pollId];
  console.log("participant added", pollId, name, selectedAvatar);
  if (typeof poll !== 'undefined') {
    if (quizName === name) {
      return "invalidName"
    }
    for (let i = 0; i < poll.participants.length; i++) {
      console.log("nu är jag i data och ska loopa över participants", poll.quizName);
      if (poll.participants[i].name === name) {
        console.log("nu hittade vi ett likadant namn åh nej", poll.participants[i].name)
        return "invalidName"
      }
    }
    let participant = {
      name: name,
      avatar: selectedAvatar,
      points: 0
    }
    poll.participants.push(participant);
  }
  return "validName"
}

Data.prototype.getParticipants = function (pollId) {
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {
    return poll.participants;
  }
  return []
}

Data.prototype.getCities = function (pollId) {
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {

    return poll.cities;
  }
  return {}
}

Data.prototype.getCurrentCity = function (pollId) {
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {

    return poll.currentQuestion;
  }
  return {}
}
Data.prototype.getNewCity = function (pollId) {
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {
    poll.currentQuestion += 1;

    console.log("in data and adding to currentquestion", poll.currentQuestion)

    return poll.currentQuestion;
  }
  return 50
}

Data.prototype.editQuestion = function (pollId, index, newQuestion) {
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {
    poll.questions[index] = newQuestion;
  }
}

Data.prototype.getQuestion = function (pollId, qId = null) {
  const poll = this.polls[pollId];
  console.log("question requested for ", pollId, qId);
  if (typeof poll !== 'undefined') {
    if (qId !== null) {
      poll.currentQuestion = qId;
    }
    return poll.questions[poll.currentQuestion];
  }
  return []
}

Data.prototype.submitAnswer = function (pollId, answer) {
  const poll = this.polls[pollId];
  console.log("answer submitted for ", pollId, answer);
  if (typeof poll !== 'undefined') {
    let answers = poll.answers[poll.currentQuestion];
    if (typeof answers !== 'object') {
      answers = {};
      answers[answer] = 1;
      poll.answers.push(answers);
    }
    else if (typeof answers[answer] === 'undefined')
      answers[answer] = 1;
    else
      answers[answer] += 1
    console.log("answers looks like ", answers, typeof answers);
  }
}

Data.prototype.checkAnswer = function (pollId, answer, name, clueNumber) {
  const poll = this.polls[pollId];
  console.log("in CheckAnswer", pollId, answer, name, clueNumber)
  let city = Object.keys(poll.cities)[poll.currentQuestion - 1].toLowerCase();
  answer = answer.toLowerCase();
  console.log("city", city)
  let pointsWon;
  console.log("cities", poll.cities);
  if (answer != "") {
    if (clueNumber === 0 && answer === city) {
      pointsWon = 6;
    }
    if (clueNumber === 1 && answer === city) {
      pointsWon = 4;
    }
    if (clueNumber === 2 && answer === city) {
      pointsWon = 2;
    }
    if (typeof poll !== 'undefined') {
      for (let i = 0; i < poll.participants.length; i++) {
        if (poll.participants[i].name === name) {
          poll.participants[i].points += pointsWon;
          console.log("points", poll.participants[i].points);
          console.log("participant", poll.participants[i]);
          console.log("pointsWon", pointsWon);
        }
      }
    }
  }
}

Data.prototype.getAnswers = function (pollId) {
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {
    const answers = poll.answers[poll.currentQuestion];
    if (typeof poll.questions[poll.currentQuestion] !== 'undefined') {
      return { city: poll.questions[poll.currentQuestion].city, a: answers };
    }
  }
  return {}
}
export { Data };