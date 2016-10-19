var Coord = require('./coord');
var Direction = require('./direction');
var Snake = require('./snake');

function SnakeGame(gameId, width, height, snakeLength, nsp, onGameEnded){
  this.init(gameId, width, height, snakeLength, nsp, onGameEnded, true);
}

SnakeGame.prototype.init = function(gameId, width, height, snakeLength, nsp, onGameEnded, freshGame){
  this.gameId = gameId;
  this.playerCount = 0;
  this.snake = new Snake(snakeLength, Direction.UP);
  this.width = width;
  this.height = height;
  this.appleCoords = this.generatePellet();
  this.changedCoords = [];
  this.time = 0;
  this.timeout = undefined;
  this.io = nsp;
  this.onGameEnded = onGameEnded;
  var thisGame = this;

  if (freshGame) {
    this.startingLength = snakeLength;
    this.io.on('connection', function (socket) {
      thisGame.addPlayer();
      socket.on('message', function (message) {
          var data = { 'message' : message.message, 'username': message.username }
          socket.broadcast.emit('message', data);
      });
      socket.on('disconnect', function (socket) {
        thisGame.subtractPlayer();
      })
    });
    this.stopGame();
  }
}

SnakeGame.prototype.refresh = function() {
  this.init(
    this.gameId,
    this.width,
    this.height,
    this.startingLength,
    this.io,
    false
  );
}

SnakeGame.prototype.tick = function(){
  /*var nextPosition = this.snake.getNextPosition();
  if(this.isValidMove(nextPosition)){
    if (nextPosition === this.appleCoords) {
      this.appleCoords = this.generatePellet();
      this.snake.grow();
    }
    else {
      this.snake.move();
    }
    this.updateChangedCoords();
    time++;
    this.io.emit('testing', this.changedCoords);
  }
  else {
    this.stopGame();
  } */
  //this.io.emit('testing', {"testtt":(Math.random()*200)});
}

SnakeGame.prototype.updateChangedCoords = function() {
    /*var head = this.getHead();
    var previousTail = this.previousTail;
    var apple = this.appleCoords;
    changedCoords = {};
    changedCoords.push({coord: head, type: body});
    changedCoords.push({coord: previousTail, type: background});
    changedCoords.push({coord: apple, type: apple});
    */
    var changedCoords = {"snake" : this.snake.getBody(), "apple" : this.appleCoords};
    this.changedCoords = changedCoords;
}

SnakeGame.prototype.beginGame = function() {
  //this.timeout = setInterval(this.tick(), 1000);
  setInterval(this.tick, 1000, this.io);
}

SnakeGame.prototype.stopGame = function() {
  console.log("Stopping Game");
  clearInterval(this.timeout);
  this.timeout = undefined;
  this.onGameEnded(this);

  this.refresh();

  // Have a countdown before game starts again?
  this.beginGame();
}

SnakeGame.prototype.generatePellet = function() {
  var goodLocation = false;
  var coord;
  while(!goodLocation){
    var x = Math.floor(Math.random() * this.width);
    var y = Math.floor(Math.random() * this.height);
    coord = new Coord(x,y);
    if(!this.snake.inSnake(coord)){
      goodLocation = true;
    }
  }
  return coord;
}

SnakeGame.prototype.isValidMove = function(coord){
  var valid = true;
  if(coord.getX() < 0 || coord.getX() > this.width){
    valid = false;
  }
  if(coord.getY() < 0 || coord.getX() > this.height){
    valid = false;
  }
  if(this.snake.inSnake(coord)){
    valid = false;
  }
  return valid;
}

SnakeGame.prototype.changeDirection = function(dir) {
  this.snake.setDirection(dir);
}

SnakeGame.prototype.isValidGame = function(){}
SnakeGame.prototype.newFrame = function(){}


SnakeGame.prototype.up = function(){
  this.changeDirection(Direction.UP);
}
SnakeGame.prototype.down = function(){
  this.changeDirection(Direction.DOWN);
}
SnakeGame.prototype.left = function(){
  this.changeDirection(Direction.LEFT);
}
SnakeGame.prototype.right = function(){
  this.changeDirection(Direction.RIGHT);
}

SnakeGame.prototype.addPlayer = function() {
  this.playerCount += 1;
}
SnakeGame.prototype.subtractPlayer = function() {
  this.playerCount -= 1;
}

SnakeGame.prototype.getPlayerCount = function(){
  return this.playerCount;
}

SnakeGame.prototype.getDuration = function(){
  return this.time;
}

SnakeGame.prototype.getSnakeLength = function(){
  return this.snake.body.length;
}

module.exports = SnakeGame;
