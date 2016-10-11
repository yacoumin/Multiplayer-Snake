// maybe just pass sockets in for players?
function Game(id,player1,player2,difficulty){ // dififculty if we want to change board size/shrink/grow count
  this.sp1 = new SnakePanel(player1,100,100,3,3,4);
  this.sp2 = new SnakePanel(player2,100,100,3,3,4);
  this.player1 = player1;
  this.player2 = player2;
  this.id = id;
  setInterval(this.tick(),5000);
}

Game.prototype.begin = function(){

}

Game.prototype.end = function(){

}

Game.prototype.tick = function(){
  sp1.tick();
  sp2.tick();
}
