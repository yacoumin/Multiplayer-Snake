var SnakeGame = require('./snake_game2.js')




function GameTracker(mdb){
  var GameStats = require('../util/game_stats.js');
  var gameStats = new GameStats(mdb);
  //console.log(gameStats);
  var activeGames = {};
  var currentGame = 0;
  var checkGameStatus = undefined;

  function clearDoneGames(){
    Object.keys(activeGames).forEach(function(gameid){
      if(activeGame[gameid].getPlayerCount <= 0){
        this.destroyGame(gameid);
      }
    }
    if(Object.keys(activeGames).length == 0){
      clearInterval(checkGameStatus);
      checkGameStatus = undefined;
    }
  }

  this.getGameById = function(gameId) {
    return activeGames[gameId];
  }

  this.createGame = function(gameId,nsp) {
    if(checkGameStatus === undefined){
      setIntereval(clearDoneGames,30000);
    }
    if (activeGames[gameId] != undefined) {
      throw "game with game id \"" + gameId + "\" already exists! Can't create";
    }
    else {
      console.log("creating game " + gameId);
      var onGameEnded = function(game) {
        gameStats.insertGame(game);
        console.log("Game Ended");
      }
      var newGame = SnakeGame(gameId, 45, 25, 3, nsp, onGameEnded);
      //console.log("----------GAME---------------------------------");
      //console.log(newGame);
      //console.log("----------ENDGAME--------------------------------");
      activeGames[gameId] = newGame;
      //console.log(activeGames[gameId]);
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
