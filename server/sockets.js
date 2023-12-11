function sockets(io, socket, data) {
  socket.emit('init', data.getUILabels());
  
  socket.on('pageLoaded', function (lang) {
    socket.emit('init', data.getUILabels(lang));
  });

  socket.on('switchLanguage', function(lang) {
    socket.emit('init', data.getUILabels(lang));
  });

  socket.on('createPoll', function(d) {
    data.createPoll(d.pollId, d.lang, d.quizName, d.selectedAvatar);
    console.log("Received poll on server:")
    socket.emit('pollCreated', data.createPoll(d.pollId, d.lang, d.quizName, d.selectedAvatar));
  });

  socket.on('getPoll', function(pollId){
    socket.emit('fullPole', data.getPoll(pollId))
  });

  socket.on('addQuestion', function(d) {
    data.addCity(d.pollId, d.city, d.clue1, d.clue2, d.clue3);
    socket.emit('dataUpdate', data.getCities(d.pollId));
  });

  socket.on('editQuestion', function(d) {
    data.editQuestion(d.pollId, d.index, {city: d.city, clue1: d.clue1, clue2: d.clue2, clue3: d.clue3});
    socket.emit('questionEdited', data.getAllQuestions(d.pollId));
  });

  socket.on('joinPoll', function(pollId) {
    socket.join(pollId);
    socket.emit('newQuestion', data.getQuestion(pollId))
    socket.emit('dataUpdate', data.getAnswers(pollId));
  });

  socket.on('runQuestion', function(d) {
    io.to(d.pollId).emit('newQuestion', data.getQuestion(d.pollId, d.questionNumber));
    io.to(d.pollId).emit('dataUpdate', data.getAnswers(d.pollId));
  });

  socket.on('submitAnswer', function(d) {
    data.submitAnswer(d.pollId, d.answer);
    io.to(d.pollId).emit('dataUpdate', data.getAnswers(d.pollId));
  });
  
  socket.on("addParticipant", function(d) {
    data.addParticipant(d.pollId, d.name, d.selectedAvatar);
    io.to(d.pollId).emit('participantsUpdate', data.getParticipants(d.pollId));
  });

  socket.on('resetAll', () => {
    data = new Data();
    data.initializeData();
  })
 
}

export { sockets };