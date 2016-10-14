// A class for recording game statistics over the lifetime of the server
function GameStats(mdb) {

  // Get the game stats mongodb colletion
  this.getGameColletion = function() {
    return mdb.collection("game_stats");
  }

  // Put game statistics into the game stats database
  this.insertGame = function(snakeGame) {
    var gameInfo = this.extractGameInfo(snakeGame);
    var gameCollection = this.getGameCollection();
    gameCollection.insert(gameInfo, function(err, ids){});
  }

  // Put the game information into an insertable object
  this.extractGameInfo = function(snakeGame) {
    var now = new Date(Date.now()).toISOString();
    var info = {
      numUsers: 1,
      snakeLength: snakeGame.snake.body.length,
      endTime: snakeGame.time,
      datePlayed: now
    };
    return info;
  }

  // Get the best games that have ocurred on the server
  this.getTopGames = function(onDocumentsRetreived) {
    var gameCollection = this.getGameCollection();
    var documents = gameCollection
                .find()
                .sort({ numUsers: 1, snakeLength: 1, endTime: 1 })
                .limit(15);
    return documents.toArray();
  }

}
module.exports = GameStats;
