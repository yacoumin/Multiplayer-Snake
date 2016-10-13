var expressInstance = require('./server/util/app');
var myApp = expressInstance.app;

var port = process.env.PORT || 3000;
var server = myApp.listen(port);
var io = require('socket.io').listen(server);
/*=============================================================================
SOCKET ROUTES
=============================================================================*/
io.sockets.on('connection', function (socket) {

  socket.on('message', function (message) {
      var data = { 'message' : message.message, 'username': message.username }
      socket.broadcast.emit('message', data);
  })
});
