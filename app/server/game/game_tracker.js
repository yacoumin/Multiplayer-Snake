var SnakeGame = require('./snake_game2.js')




function GameTracker(mdb){
  var GameStats = require('../util/game_stats.js');
  var gameStats = new GameStats(mdb);
  //console.log(gameStats);
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
      //console.log("----------GAME---------------------------------");
      //console.log(newGame);
      //console.log("----------ENDGAME--------------------------------");
      activeGames[gameId] = newGame;
      //console.log(activeGames[gameId]);
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
    //console.log("clear done games reached");
    Object.keys(activeGames).forEach(function(gameid){
      //console.log("in the loop: " + gameid);
      var players = activeGames[gameid].getPlayerCount();
      //console.log("num players: " + players);
      if(players <= 0){
        //console.log('destroying the game');
        destroyGame(gameid);
      }
    });
    //console.log("length: " + Object.keys(activeGames).length);
    if(Object.keys(activeGames).length == 0){
      //console.log("clearing interval");
      clearInterval(checkGameStatus);
      checkGameStatus = undefined;
    }
  }

}
module.exports = GameTracker;
