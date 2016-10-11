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

  player.on('move',function(data){

  });
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
  if(snake.isSnake(coord){
    valid = false;
  }
  return valid;
}

SnakePanel.prototype.isValidGame = function(){}
SnakePanel.prototype.newFrame = function(){}
