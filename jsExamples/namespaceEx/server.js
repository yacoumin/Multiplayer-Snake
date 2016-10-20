var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var server = app.listen(port);
var io = require('socket.io').listen(server);

app.set('view engine', 'ejs');
app.use(express.static('public'));



var ns1 = io.of("/");
var ns2 = io.of("/room2");

ns1.on('connection', function(socket){
  setInterval(function(){
    ns1.to(socket.id).emit('random', {rand: "namespace 1 sent: " + Math.floor(Math.random()*50)});
    //ns1.to(socket.id).emit('random', {x:Math.floor(Math.random()*50), y:Math.floor(Math.random()*25)});
  }, 2000);
});

ns2.on('connection', function(socket){
  setInterval(function(){
    ns2.to(socket.id).emit('random', {rand: "namespace 2 sent: " + Math.floor(Math.random()*50)});
    //ns2.to(socket.id).emit('random', {x:Math.floor(Math.random()*50), y:Math.floor(Math.random()*25)});
  }, 2000);
});

app.get("/", function(req, res){
  res.render("room1");
});

app.get("/room2", function(req, res){
  res.render("room2");
});
