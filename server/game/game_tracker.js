/*-----------------------------------------------------------------------------
GameTracker is a class designed to essentially add some tracking information
about active games, and will keep track of when games are in progress, when
to get rid of games, and will create the game when a user eventually creates it.
Specifically creates a SnakeGame, which on its own instantiates a Snake.  This
also adds stats to the game database on game end.
-----------------------------------------------------------------------------*/
var SnakeGame = require('./snake_game.js')

function GameTracker(mdb){
  var GameStats = require('../util/game_stats.js');
  var gameStats = new GameStats(mdb);
  var activeGames = {};
  var currentGame = 0;
  var checkGameStatus = undefined;
  var checkTime = 60000;

  this.getGameById = function(gameId) {
    return activeGames[gameId];
  }

  this.createGame = function(gameId,nsp) {
    if(checkGameStatus === undefined){
      checkGameStatus = setInterval(clearDoneGames,checkTime);
    }
    if (activeGames[gameId] != undefined) {
      throw "game with game id \"" + gameId + "\" already exists! Can't create";
    }
    else {
      //console.log("creating game " + gameId);
      var onGameEnded = function(game) {
        gameStats.insertGame(game);
        console.log("Game Ended");
      }
      var newGame = SnakeGame(gameId, 45, 25, 3, nsp, onGameEnded);
      activeGames[gameId] = newGame;
    }
  }

  function destroyGame(gameId) {
    if (activeGames[gameId] != undefined) {
      delete activeGames[gameId];
    }
  }

  this.getGames = function(){
    return activeGames;
  }

  function clearDoneGames(){
    Object.keys(activeGames).forEach(function(gameid){
      var players = activeGames[gameid].getPlayerCount();
      if(players <= 0){
        destroyGame(gameid);
      }
    });
    if(Object.keys(activeGames).length == 0){
      clearInterval(checkGameStatus);
      checkGameStatus = undefined;
    }
  }

}
module.exports = GameTracker;
