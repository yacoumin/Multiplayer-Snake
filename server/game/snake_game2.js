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
          socket.on('move', function (move) {
              var data = { 'move' : move.move, 'username': move.username}
              socket.broadcast.emit('move', data);
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
        if (nextPosition.equals(thisAppleCoords)) {
          //console.log("apple eaten");
          thisAppleCoords = generatePellet();
          thisChangedCoords.apple = thisAppleCoords;
          willGrow = true;
          thisSnake.grow();
          //console.log("Changed Coords: " + thisChangedCoords);
        }
        else {
          thisSnake.move();
        }
        updateChangedCoords(willGrow);
        //console.log(printObjectProperties("ChangedCoords", thisChangedCoords));

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
        //var apple = thisAppleCoords;
        thisChangedCoords.snake = head;
        thisChangedCoords.background = previousTail;
        // if (!previousTail.equals(thisAppleCoords)){
        //   if (willGrow) {
        //     thisChangedCoords.snake = previousTail;
        //   }
        //   else {
        //     thisChangedCoords.background = previousTail;
        //   }
        // }
        //var changedCoords = {"snake" : thisSnake.getBody(), "apple" : thisAppleCoords};
    }

    function beginGame() {
      if (!freshGame){
        reset();
      }
      running = true;
      self = this;
      thisTimeout = setInterval(tick, 150);
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
      if(coord.getX() < 0 || coord.getX() > thisWidth - 1){
        valid = false;
      }
      if(coord.getY() < 0 || coord.getY() > thisHeight - 1){
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

    function onGoodMove(user, dir) {
      console.log("onGoodMove: " + user + " " + Direction.NameFromValue(dir));
      var moveData = {'username' : user, 'move' : Direction.NameFromValue(dir)};
      thisIo.emit('move', moveData);
    }

    function changeDirection(user, dir) {
      thisSnake.setDirection(user, dir, onGoodMove);
    }

    function isValidGame(){}
    function newFrame(){}

    function up(user){
      changeDirection(user, Direction.UP);
    }

    function down(user){
      changeDirection(user, Direction.DOWN);
    }

    function left(user){
      changeDirection(user, Direction.LEFT);
    }

    function right(user){
      changeDirection(user, Direction.RIGHT);
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

function printObjectProperties(name, object, indent) {
  if (indent == undefined) {
    indent = 0;
  }
  var t = "";
  for (var i=0; i<indent; i++) {
    t += "  ";
  }
  var output = t + name + ": ";
  var type = typeof(object);
  if (type != "object") {
    output += object + "\n";
    return output;
  }
  else {
    output += "{\n"
    for (var key in object) {
      if (object.hasOwnProperty(key)) {
          output += t + printObjectProperties(key, object[key], indent + 1);
      }
    }
    output += t + "}\n";
    return output;
  }
}

module.exports = SnakeGame;
