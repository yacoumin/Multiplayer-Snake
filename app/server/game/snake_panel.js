require('./coord');
require('./direction');
require('./snake');

function SnakePanel(player,width,height,growCount,shrinkCount,snakeLength){
  this.player = player;
  this.snake = new Snake(this.player,snakeLength,Direction.UP);
  this.width = width;
  this.height = height;
  this.growCount = growCount;
  this.shrinkCount = shrinkCount;
  this.growCoords = [];
  this.shrinkCoords = [];
  this.generateGrowPellets();
  this.generateShrinkPellets();

  player.on('change-direction',function(data){
    var dir = data.direction;
    this.snake.setDirection(dir);
  });
}

SnakePanel.prototype.tick = function(){
  if(this.isValidMove(this.snake.getNextPosition())){
    this.snake.move();
  }
  else{
    this.player.emit('player-death');
  }
}



SnakePanel.prototype.generatePellet = function() {
  var goodLocation = false;
  var coord;
  while(!goodLocation){
    var x = Math.floor(Math.random() * this.width);
    var y = Math.floor(Math.random() * this.height);
    coord = new Coord(x,y);
    if(!this.snake.isSnake(coord)){
      goodLocation = true;
    }
  }
  return coord;
}

SnakePanel.prototype.genereateGrowPellets = function() {
  for(var i = this.growCoords.length; i < this.growCount; i++){
    growCoords.push(generatePellet());
  }
};

SnakePanel.prototype.genereateShrinkPellets = function() {
  for(var i = this.shrinkCoords.length; i < this.shrinkCount; i++){
    shrinkCoords.push(generatePellet());
  }
};

SnakePanel.prototype.isValidMove = function(coord){
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

SnakePanel.prototype.isValidGame = function(){}
SnakePanel.prototype.newFrame = function(){}

module.exports = SnakePanel;
