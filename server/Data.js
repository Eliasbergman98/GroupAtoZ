'use strict';
const languages = ["en", "se"];
import { readFileSync } from "fs";

// Store data in an object to keep the global namespace clean
function Data() {
  this.polls = {};

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
    poll.answerTime = 0;
    poll.currentQuestion = 0;
    this.polls[pollId] = poll;
    poll.participants = [];
  }
  return this.polls[pollId];
}

Data.prototype.createParticipant = function (pollId, name) {
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {
    for (let i = 0; i < poll.participants.length; i++) {
      if (poll.participants[i].name === name) {
      }
    }
  }
  return name;
}

Data.prototype.getPoll = function (pollId) {
  return this.polls[pollId] || {};
}

Data.prototype.addCity = function (pollId, city, clue1, clue2, clue3) {
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {
    poll.cities[city] = {
      clue1: clue1,
      clue2: clue2,
      clue3: clue3,
    };
  }
}

Data.prototype.removeCity = function (pollId, city) {
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {
    delete poll.cities[city];
  }
}

Data.prototype.removePlayer = function (pollId, name) {
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {
    for (let i = 0; i < poll.participants.length; i++) {
      if (poll.participants[i].name === name) {
        poll.participants.splice(i, 1);

      }
    }
  }
}

Data.prototype.removePoll = function (pollId) {
  delete this.polls[pollId];
}

Data.prototype.addParticipant = function (pollId, name, selectedAvatar, quizName) {
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {
    if (quizName === name) {
      return "invalidName"
    }
    for (let i = 0; i < poll.participants.length; i++) {
      if (poll.participants[i].name === name) {
        return "invalidName"
      }
    }
    let participant = {
      name: name,
      avatar: selectedAvatar,
      points: 0,
      time: 0
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

Data.prototype.getCurrentCity = function (pollId) {
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {

    return poll.currentQuestion;
  }
  return null
}
Data.prototype.getNewCity = function (pollId) {
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {
    poll.currentQuestion += 1;
    return poll.currentQuestion;
  }
  return null
}
Data.prototype.checkAnswerTime = function (pollId, answerTime) {
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined' && poll.participants.length > 1) {
    if (poll.answerTime === 0) {
      poll.answerTime = answerTime;
      return true
    }
    return false
  }


}
Data.prototype.resetAnswerTime = function (pollId) {
  const poll = this.polls[pollId];
  if (poll.answerTime != 0) {
    poll.answerTime = 0;
  }
}

Data.prototype.checkAnswer = function (pollId, answer, name, clueNumber, rightAnswer, answerTime) {
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {
    let city = Object.keys(poll.cities)[poll.currentQuestion - 1].toLowerCase();
    answer = answer.toLowerCase();
    let pointsWon = 0;
    if (answer != "") {
      if (clueNumber === 0 && answer === city) {
        pointsWon = 6;
        rightAnswer = true;
        if (this.checkAnswerTime(pollId)) {
          pointsWon += 1;
        }
      }
      if (clueNumber === 1 && answer === city) {
        pointsWon = 4;
        rightAnswer = true;
        if (this.checkAnswerTime(pollId)) {
          pointsWon += 1;
        }
      }
      if (clueNumber === 2 && answer === city) {
        pointsWon = 2;
        rightAnswer = true;
        if (this.checkAnswerTime(pollId)) {
          pointsWon += 1;
        }
      }
      let extraPoint = false
      for (let i = 0; i < poll.participants.length; i++) {
        if (poll.participants[i].name === name) {
          poll.participants[i].points += pointsWon;
          if (rightAnswer) {
            poll.participants[i].time += answerTime;
          }
        }
        if (pointsWon % 2 != 0) {
          extraPoint = true;
        }
      }
      return [rightAnswer, extraPoint]
    }
  }
}
export { Data };