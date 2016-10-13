// maybe just pass sockets in for players?
//require('./snake_panel');
function Game(id,player1,player2){ // dififculty if we want to change board size/shrink/grow count
  //this.sp1 = new SnakePanel(player1,100,100,3,3,4);
  //this.sp2 = new SnakePanel(player2,100,100,3,3,4);
  this.player1 = player1;
  this.player2 = player2;
  this.id = id;
  console.log("Game has been created");
  //setInterval(this.tick(),1000);
}
/*
Game.prototype.begin = function(){

}

Game.prototype.end = function(){

}

Game.prototype.tick = function(){
  sp1.tick();
  sp2.tick();
}
*/
module.exports = Game;
