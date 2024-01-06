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

Data.prototype.createGame = function (gameId, lang = "en", quizName, selectedAvatar) {
  if (typeof this.polls[gameId] === "undefined") {
    let poll = {};
    poll.selectedAvatar = selectedAvatar;
    poll.quizName = quizName;
    poll.cities = {};
    poll.lang = lang;
    poll.questions = [];
    poll.answers = [];
    poll.answerTime = 0;
    poll.currentQuestion = 0;
    this.polls[gameId] = poll;
    poll.participants = [];
  }
  return this.polls[gameId];
}

Data.prototype.createParticipant = function (gameId, name) {
  const poll = this.polls[gameId];
  if (typeof poll !== 'undefined') {
    for (let i = 0; i < poll.participants.length; i++) {
      if (poll.participants[i].name === name) {
      }
    }
  }
  return name;
}

Data.prototype.getGame = function (gameId) {
  return this.polls[gameId] || {};
}

Data.prototype.addCity = function (gameId, city, clue1, clue2, clue3) {
  const poll = this.polls[gameId];
  if (typeof poll !== 'undefined') {
    poll.cities[city] = {
      clue1: clue1,
      clue2: clue2,
      clue3: clue3,
    };
  }
}

Data.prototype.removeCity = function (gameId, city) {
  const poll = this.polls[gameId];
  if (typeof poll !== 'undefined') {
    delete poll.cities[city];
  }
}

Data.prototype.removePlayer = function (gameId, name) {
  const poll = this.polls[gameId];
  if (typeof poll !== 'undefined') {
    for (let i = 0; i < poll.participants.length; i++) {
      if (poll.participants[i].name === name) {
        poll.participants.splice(i, 1);

      }
    }
  }
}

Data.prototype.removePoll = function (gameId) {
  delete this.polls[gameId];
}

Data.prototype.addParticipant = function (gameId, name, selectedAvatar, quizName) {
  const poll = this.polls[gameId];
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

Data.prototype.getParticipants = function (gameId) {
  const poll = this.polls[gameId];
  if (typeof poll !== 'undefined') {
    return poll.participants;
  }
  return []
}

Data.prototype.getCurrentCity = function (gameId) {
  const poll = this.polls[gameId];
  if (typeof poll !== 'undefined') {

    return poll.currentQuestion;
  }
  return null
}
Data.prototype.getNewCity = function (gameId) {
  const poll = this.polls[gameId];
  if (typeof poll !== 'undefined') {
    poll.currentQuestion += 1;
    return poll.currentQuestion;
  }
  return null
}
Data.prototype.checkAnswerTime = function (gameId, answerTime) {
  const poll = this.polls[gameId];
  if (typeof poll !== 'undefined' && poll.participants.length > 1) {
    if (poll.answerTime === 0) {
      poll.answerTime = answerTime;
      return true
    }
    return false
  }


}
Data.prototype.resetAnswerTime = function (gameId) {
  const poll = this.polls[gameId];
  if (poll.answerTime != 0) {
    poll.answerTime = 0;
  }
}

Data.prototype.checkAnswer = function (gameId, answer, name, clueNumber, rightAnswer, answerTime) {
  const poll = this.polls[gameId];
  if (typeof poll !== 'undefined') {
    let city = Object.keys(poll.cities)[poll.currentQuestion - 1].toLowerCase();
    answer = answer.toLowerCase();
    let pointsWon = 0;
    if (answer != "") {
      if (clueNumber === 0 && answer === city) {
        pointsWon = 6;
        rightAnswer = true;
        if (this.checkAnswerTime(gameId)) {
          pointsWon += 1;
        }
      }
      if (clueNumber === 1 && answer === city) {
        pointsWon = 4;
        rightAnswer = true;
        if (this.checkAnswerTime(gameId)) {
          pointsWon += 1;
        }
      }
      if (clueNumber === 2 && answer === city) {
        pointsWon = 2;
        rightAnswer = true;
        if (this.checkAnswerTime(gameId)) {
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