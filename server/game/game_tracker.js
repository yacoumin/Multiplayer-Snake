var SnakeGame = require('./snake_game.js')

function GameTracker(mdb){
  var GameStats = require('../util/game_stats.js');
  var gameStats = new GameStats(mdb);
  console.log(gameStats);
  var activeGames = {};
  var currentGame = 0;

  this.getGameById = function(gameId) {
    return activeGames[gameId];
  }

  this.createGame = function(gameId,nsp) {
    if (activeGames[gameId] != undefined) {
      throw "game with game id \"" + gameId + "\" already exists! Can't create";
    }
    else {
      console.log("creating game " + gameId);
      var onGameEnded = function(game) {
        gameStats.insertGame(game);
        console.log("Game Ended");
      }
      var newGame = new SnakeGame(gameId, 30, 30, 3, nsp, onGameEnded);
      activeGames[gameId] = newGame;
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
