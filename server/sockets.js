function sockets(io, socket, data) {
  socket.emit('init', data.getUILabels());

  socket.on('pageLoaded', function (lang) {
    socket.emit('init', data.getUILabels(lang));
  });

  socket.on('switchLanguage', function (lang) {
    socket.emit('init', data.getUILabels(lang));
  });

  socket.on('createGame', function (d) {
    data.createGame(d.gameId, d.lang, d.quizName, d.selectedAvatar);
  });

  socket.on('getGame', function (gameId) {
    socket.emit('fullGame', data.getGame(gameId));
    io.to(gameId).emit('participantsUpdate', data.getParticipants(gameId));
  });

  socket.on('startingGame', function (d) {
    io.to(d.gameId).emit('creatorStarting', d.gameId);
  });

  socket.on('getCity', function (gameId) {
    socket.emit('currentCity', data.getCurrentCity(gameId));
  });

  socket.on('creatorClick', function (gameId) {
    io.to(gameId).emit('creatorClicked', gameId);
  });

  socket.on('cityUpdate', function (gameId) {
    io.to(gameId).emit('updateQuestionNumber', data.getNewCity(gameId));
  })

  socket.on('addCity', function (d) {
    data.addCity(d.gameId, d.city, d.clue1, d.clue2, d.clue3);
  });

  socket.on('removeCity', function (d) {
    data.removeCity(d.gameId, d.city);
  });

  socket.on('playerExited', function (d) {
    data.removePlayer(d.gameId, d.name);
    io.to(d.gameId).emit('participantsUpdate', data.getParticipants(d.gameId));
  });

  socket.on('creatorExited', function (gameId) {
    io.to(gameId).emit('gameEnded', data.removePoll(gameId));
  });

  socket.on('joinGame', function (gameId) {
    socket.join(gameId);
  });

  socket.on("addParticipant", function (d) {
    socket.emit("checkPlayer", data.addParticipant(d.gameId, d.name, d.selectedAvatar, d.quizName));
    io.to(d.gameId).emit('participantsUpdate', data.getParticipants(d.gameId));
  });

  socket.on('resetAll', () => {
    data = new Data();
    data.initializeData();
  });

  socket.on("checkAnswer", function (d) {
    socket.emit("yourPoints", data.checkAnswer(d.gameId, d.answer, d.name, d.clueNumber, d.rightAnswer, d.answerTime));
  });

  socket.on("newClue", function (gameId) {
    data.resetAnswerTime(gameId);
  });

}

export { sockets };