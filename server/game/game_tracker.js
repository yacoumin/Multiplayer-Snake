var SnakeGame = require('./snake_game.js')

function GameTracker(){
  var activeGames = {};
  var currentGame = 0;

  this.getGameById = function(gameId) {
    return activeGames[gameId];
  }

  this.createGame = function(gameId) {
    if (activeGames[gameId] != undefined) {
      throw "game with game id \"" + gameId + "\" already exists! Can't create";
    }
    else {
      console.log("creating game " + gameId);
      activeGames[gameId] = new SnakeGame(gameId, 20, 20, 3);
      console.log(activeGames[gameId]);
    }
  }

  this.destroyGame = function(gameId) {
    if (activeGames[gameId] != undefined) {
      delete activeGames[gameId];
    }
  }

  this.getGames = function(){
    return activeGames;
  }
}
module.exports = GameTracker;
