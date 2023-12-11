'use strict';
const languages = ["en", "se"];
import {readFileSync} from "fs";

// Store data in an object to keep the global namespace clean
function Data() {
  this.polls = {};
  console.log("här är vi i data", this.polls)
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

Data.prototype.createPoll = function(pollId, lang="en", quizName, selectedAvatar) {
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
    console.log("poll created in data", pollId, poll);
  }
  console.log("poll created before return", pollId);
  return this.polls[pollId];
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
Data.prototype.addCity = function(pollId, city, clue1, clue2, clue3) {
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

Data.prototype.getCities = function(pollId) {
  const poll = this.polls[pollId];
  console.log("cities", poll.cities);
  if (typeof poll !== 'undefined') {
    
    return poll.cities;
  }
  return {}
}

Data.prototype.editQuestion = function(pollId, index, newQuestion) {
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {
    poll.questions[index] = newQuestion;
  }
}

Data.prototype.getQuestion = function(pollId, qId=null) {
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

Data.prototype.submitAnswer = function(pollId, answer) {
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

Data.prototype.getAnswers = function(pollId) {
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {
    const answers = poll.answers[poll.currentQuestion];
    if (typeof poll.questions[poll.currentQuestion] !== 'undefined') {
      return {city: poll.questions[poll.currentQuestion].city, a: answers};
    }
  }
  return {}
}
export { Data };



