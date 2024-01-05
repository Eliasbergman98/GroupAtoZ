function sockets(io, socket, data) {
  socket.emit('init', data.getUILabels());

  socket.on('pageLoaded', function (lang) {
    socket.emit('init', data.getUILabels(lang));
  });

  socket.on('switchLanguage', function (lang) {
    socket.emit('init', data.getUILabels(lang));
  });

  socket.on('createPoll', function (d) {
    data.createPoll(d.pollId, d.lang, d.quizName, d.selectedAvatar);
  });

  socket.on('getPoll', function (pollId) {
    socket.emit('fullPole', data.getPoll(pollId));
    io.to(pollId).emit('participantsUpdate', data.getParticipants(pollId));
  });

  socket.on('startingGame', function (d) {
    io.to(d.pollId).emit('creatorStarting', d.pollId);
  });

  socket.on('getCity', function (pollId) {
    socket.emit('currentCity', data.getCurrentCity(pollId));
  });

  socket.on('creatorClick', function (pollId) {
    console.log("jag har klickat dig vidare nu")
    io.to(pollId).emit('creatorClicked', pollId);
  });

  socket.on('cityUpdate', function (pollId) {
    console.log("i socket och vill updaterar questionnumber")
    io.to(pollId).emit('updateQuestionNumber', data.getNewCity(pollId));
  })

  socket.on('addQuestion', function (d) {
    data.addCity(d.pollId, d.city, d.clue1, d.clue2, d.clue3);
    socket.emit('dataUpdate', data.getCities(d.pollId));
  });

  socket.on('removeCity', function (d) {
    data.removeCity(d.pollId, d.city);
    socket.emit('dataUpdate', data.getCities(d.pollId));

  });

  socket.on('playerExited', function (d) {
    data.removePlayer(d.pollId, d.name);
    io.to(d.pollId).emit('participantsUpdate', data.getParticipants(d.pollId));
  });

  socket.on('joinPoll', function (pollId) {
    socket.join(pollId);
  });

  socket.on("addParticipant", function (d) {
    socket.emit("checkPlayer", data.addParticipant(d.pollId, d.name, d.selectedAvatar, d.quizName));
    io.to(d.pollId).emit('participantsUpdate', data.getParticipants(d.pollId));
  });

  socket.on('resetAll', () => {
    data = new Data();
    data.initializeData();
  })
  socket.on("checkAnswer", function (d) {
    console.log("Socket checkanswer")
    socket.emit("yourPoints", data.checkAnswer(d.pollId, d.answer, d.name, d.clueNumber, d.rightAnswer, d.answerTime));
  });
  socket.on("newClue", function(pollId){
    data.resetAnswerTime(pollId);
  })

}

export { sockets };