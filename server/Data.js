'use strict';
const languages = ["en", "se"];
import { readFileSync } from "fs";

// Store data in an object to keep the global namespace clean
function Data() {
  this.games = {};

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
  if (typeof this.games[gameId] === "undefined") {
    let game = {};
    game.selectedAvatar = selectedAvatar;
    game.quizName = quizName;
    game.cities = {};
    game.lang = lang;
    game.questions = [];
    game.answers = [];
    game.answerTime = 0;
    game.currentQuestion = 0;
    this.games[gameId] = game;
    game.participants = [];
  }
  return this.games[gameId];
}

Data.prototype.createParticipant = function (gameId, name) {
  const game = this.games[gameId];
  if (typeof game !== 'undefined') {
    for (let i = 0; i < game.participants.length; i++) {
      if (game.participants[i].name === name) {
      }
    }
  }
  return name;
}

Data.prototype.getGame = function (gameId) {
  return this.games[gameId] || {};
}

Data.prototype.addCity = function (gameId, city, clue1, clue2, clue3) {
  const game = this.games[gameId];
  if (typeof game !== 'undefined') {
    game.cities[city] = {
      clue1: clue1,
      clue2: clue2,
      clue3: clue3,
    };
  }
}

Data.prototype.removeCity = function (gameId, city) {
  const game = this.games[gameId];
  if (typeof game !== 'undefined') {
    delete game.cities[city];
  }
}

Data.prototype.removePlayer = function (gameId, name) {
  const game = this.games[gameId];
  if (typeof game !== 'undefined') {
    for (let i = 0; i < game.participants.length; i++) {
      if (game.participants[i].name === name) {
        game.participants.splice(i, 1);

      }
    }
  }
}

Data.prototype.removeGame = function (gameId) {
  delete this.games[gameId];
}

Data.prototype.addParticipant = function (gameId, name, selectedAvatar, quizName) {
  const game = this.games[gameId];
  if (typeof game !== 'undefined') {
    if (quizName === name) {
      return "invalidName"
    }
    for (let i = 0; i < game.participants.length; i++) {
      if (game.participants[i].name === name) {
        return "invalidName"
      }
    }
    let participant = {
      name: name,
      avatar: selectedAvatar,
      points: 0,
      time: 0
    }
    game.participants.push(participant);
  }
  return "validName"
}

Data.prototype.getParticipants = function (gameId) {
  const game = this.games[gameId];
  if (typeof game !== 'undefined') {
    return game.participants;
  }
  return []
}

Data.prototype.getCurrentCity = function (gameId) {
  const game = this.games[gameId];
  if (typeof game !== 'undefined') {

    return game.currentQuestion;
  }
  return null
}
Data.prototype.getNewCity = function (gameId) {
  const game = this.games[gameId];
  if (typeof game !== 'undefined') {
    game.currentQuestion += 1;
    return game.currentQuestion;
  }
  return null
}
Data.prototype.checkAnswerTime = function (gameId, answerTime) {
  const game = this.games[gameId];
  if (typeof game !== 'undefined' && game.participants.length > 1) {
    if (game.answerTime === 0) {
      game.answerTime = answerTime;
      return true
    }
    return false
  }


}
Data.prototype.resetAnswerTime = function (gameId) {
  const game = this.games[gameId];
  if (game.answerTime != 0) {
    game.answerTime = 0;
  }
}

Data.prototype.checkAnswer = function (gameId, answer, name, clueNumber, rightAnswer, answerTime) {
  const game = this.games[gameId];
  if (typeof game !== 'undefined') {
    let city = Object.keys(game.cities)[game.currentQuestion - 1].toLowerCase();
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
      for (let i = 0; i < game.participants.length; i++) {
        if (game.participants[i].name === name) {
          game.participants[i].points += pointsWon;
          if (rightAnswer) {
            game.participants[i].time += answerTime;
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