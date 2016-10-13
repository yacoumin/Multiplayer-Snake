var Coord = require('./coord');
var Direction = require('./direction');
var Snake = require('./snake');

function SnakeGame(gameId, width, height, snakeLength){
  this.init(gameId, width, height, snakeLength);
}

SnakeGame.prototype.init = function(gameId, width, height, snakeLength){
  this.gameId = gameId;
  this.snake = new Snake(snakeLength, Direction.UP);
  this.width = width;
  this.height = height;
  this.appleCoords = this.generatePellet();
  this.changedCoords = [];
  this.timeout = undefined;
}

SnakeGame.prototype.tick = function(){
  var nextPosition = this.snake.getNextPosition();
  if(this.isValidMove(nextPosition)){
    if (nextPosition === this.appleCoords()) {
      this.appleCoords = this.generatePellet();
      this.snake.grow();
    }
    else {
      this.snake.move();
    }
    this.updateChangedCoords();
  }
  else {
    this.stopGame();
  }
}

SnakeGame.prototype.updateChangedCoords = function() {
    var head = this.getHead();
    var previousTail = this.previousTail;
    var apple = this.appleCoords;
    changedCoords = {};
    changedCoords.push({coord: head, type: body});
    changedCoords.push({coord: previousTail, type: background});
    changedCoords.push({coord: apple, type: apple});

    this.changedCoords = changedCoords;
}

SnakeGame.prototype.beginGame = function() {
  this.timeout = setInterval(this.tick(), 1000);
}

SnakeGame.prototype.stopGame = function() {
  clearInterval(this.timeout);
  this.timeout = undefined;
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
  if(snake.inSnake(coord)){
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
module.exports = SnakeGame;
