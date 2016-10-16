var Coord = require('./coord');
var Direction = require('./direction');
var Snake = require('./snake2.js');

function SnakeGame(gameId, width, height, snakeLength, nsp, onGameEnded){
    var thisGameId = gameId;
    var thisPlayerCount = 0;
    var thisSnake = Snake(snakeLength, Direction.UP, width, height);
    var thisWidth = (width < 20) ? 20 : width;
    var thisHeight = (height < 20) ? 20 : height;
    var thisAppleCoords = generatePellet();
    var thisChangedCoords = {};
    var thisTime = 0;
    var thisTimeout = undefined;
    var thisIo = nsp;
    var thisOnGameEnded = onGameEnded;
    var thisStartingLength;
    var self;
    var running = false;
    var freshGame = true;

    init(freshGame);

    function init(fresh){

      //thisGame = this;

      if (fresh) {
        thisStartingLength = snakeLength;
        thisIo.on('connection', function (socket) {
          thisIo.to(socket.id).emit('updateDisplay', getInitialState());
          addPlayer();
          socket.on('message', function (message) {
              var data = { 'message' : message.message, 'username': message.username }
              socket.broadcast.emit('message', data);
          });
          socket.on('disconnect', function (socket) {
            subtractPlayer();
          })
        });
        freshGame = false;
        //console.log("game is stopping")
        //stopGame();
      }
    }

    function refresh() {
      init(freshGame);
    }

    function tick(){
      var nextPosition = thisSnake.getNextPosition();
      var willGrow = false;
      if(isValidMove(nextPosition)) {
        if (nextPosition === thisAppleCoords) {
          thisAppleCoords = generatePellet();
          thisChangedCoords.apple = thisAppleCoords;
          willGrow = true;
          thisSnake.grow();
        }
        else {
          thisSnake.move();
        }
        updateChangedCoords(willGrow);
        thisTime = thisTime + 1;
        thisIo.emit('updateDisplay', thisChangedCoords);
      }
      else {
        stopGame();
      }
      //this.io.emit('testing', {"testtt":(Math.random()*200)});
    }

    function updateChangedCoords(willGrow) {
        delete thisChangedCoords.snake;
        delete thisChangedCoords.background;

        var head = thisSnake.getHead();
        var previousTail = thisSnake.getPreviousTail();
        //console.log("previous tail (x,y): " + previousTail.x + "," + previousTail.y);
        var apple = thisAppleCoords;
        thisChangedCoords.snake = head;
        if (!previousTail.equals(thisAppleCoords)){
          if (willGrow) {
            thisChangedCoords.snake = previousTail;
          }
          else {
            thisChangedCoords.background = previousTail;
          }
        }
        //var changedCoords = {"snake" : thisSnake.getBody(), "apple" : thisAppleCoords};
    }

    function beginGame() {
      if (!freshGame){
        reset();
      }
      running = true;
      self = this;
      thisTimeout = setInterval(tick, 500);
      //setInterval(thisTick, 1000);
    }

    function stopGame() {
      running = false;
      console.log("Stopping Game");
      clearInterval(thisTimeout);
      thisTimeout = undefined;
      thisOnGameEnded(self);
      refresh();

      // Have a countdown before game starts again?
      //beginGame();
    }

    function reset() {
      thisSnake.initialize(thisStartingLength, Direction.UP, thisWidth, thisHeight);
      thisTime = 0;
      thisIo.emit('updateDisplay', getInitialState(true));
    }

    function generatePellet() {
      var goodLocation = false;
      var coord;
      while(!goodLocation){
        var x = Math.floor(Math.random() * thisWidth);
        var y = Math.floor(Math.random() * thisHeight);
        coord = new Coord(x,y);
        if(!thisSnake.inSnake(coord)){
          goodLocation = true;
        }
      }
      return coord;
    }

    function isValidMove(coord){
      var valid = true;
      if(coord.getX() < 0 || coord.getX() > thisWidth){
        valid = false;
      }
      if(coord.getY() < 0 || coord.getY() > thisHeight){
        valid = false;
      }
      if(thisSnake.inSnake(coord)){
        valid = false;
      }
      return valid;
    }

    function getInitialState(isReset){
      return {snake: thisSnake.getBody(), apple: thisAppleCoords, reset: isReset};
    }

    function changeDirection(dir) {
      thisSnake.setDirection(dir);
    }

    function isValidGame(){}
    function newFrame(){}

    function up(){
      changeDirection(Direction.UP);
    }

    function down(){
      changeDirection(Direction.DOWN);
    }

    function left(){
      changeDirection(Direction.LEFT);
    }

    function right(){
      changeDirection(Direction.RIGHT);
    }

    function addPlayer() {
      thisPlayerCount += 1;
    }
    function subtractPlayer() {
      thisPlayerCount -= 1;
    }

    function getPlayerCount(){
      return thisPlayerCount;
    }

    function getDuration(){
      return thisTime;
    }

    function getSnakeLength(){
      return thisSnake.body.length;
    }

    function isRunning(){
      return running;
    }

    return {
        gameId: thisGameId,
        getPlayerCount: getPlayerCount,
        playerCount: thisPlayerCount,
        snake: thisSnake,
        width: thisWidth,
        height: thisHeight,
        //appleCoords: thisAppleCoords,
        //changedCoords: thisChangedCoords,
        time: thisTime,
        //timeout: thisTimeout,
        //io: thisIo,
        onGameEnded: thisOnGameEnded,
        //startingLength: thisStartingLength,
        getDuration: getDuration,
        getSnakeLength: getSnakeLength,
        isRunning: isRunning,
        beginGame: beginGame,
        up: up,
        left: left,
        right: right,
        down: down
    };
}

module.exports = SnakeGame;
