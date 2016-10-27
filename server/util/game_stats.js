/*-----------------------------------------------------------------------------
A class for recording game statistics over the lifetime of the server
-----------------------------------------------------------------------------*/
function GameStats(mdb) {

  // Get the game stats mongodb colletion
  this.getGameCollection = function() {
    return mdb.collection("game_stats");
  }

  // Put game statistics into the game stats database
  this.insertGame = function(snakeGame) {
    //console.log("-----------GAME----------------------------");
    //console.log(snakeGame);
    //console.log("-------------------------------------------");
    var gameInfo = this.extractGameInfo(snakeGame);
    var gameCollection = this.getGameCollection();
    gameCollection.insert(gameInfo, function(err, ids){});
  }

  // Put the game information into an insertable object
  this.extractGameInfo = function(snakeGame) {
    var now = new Date(Date.now()).toISOString();
    //console.log("--------------- SNAKEGAME--------------");
    //console.log(snakeGame);
    //console.log("-----------------ENDSNAKEGAME----------");
    var info = {
      numUsers: snakeGame.getPlayerCount(),
      snakeLength: snakeGame.snake.getBody().length,
      endTime: snakeGame.getDuration(),
      datePlayed: now
    };
    return info;
  }

  // Get the best games that have ocurred on the server
  this.getTopGames = function(onDocumentsRetreived) {
    var gameCollection = this.getGameCollection();
    var documents = gameCollection
                .find()
                .sort({ numUsers: -1, snakeLength: -1, endTime: -1 })
                .limit(15);
    documents.toArray(function(err, results) {
      if(err) {
        console.log("can't get stats");
      }
      onDocumentsRetreived(results);
    });
  }

}
module.exports = GameStats;
