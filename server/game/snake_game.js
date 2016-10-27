/* Snake Game
 * - interacts with the server, game_tracker, and snake in order to create,
 *   restart, and advance games as well as provide real-time and post-game statistics
 * - advances game through tick() function which emits all game updates to client
 *   after all updates (snake move, apple regenerate, game ended) have been applied.
 * - provides snake length, duration of game (in .15s ticks) as well as player count
 *   to game_tracker.js
 *
*/


var Coord = require('./coord');
var Direction = require('./direction');
var Snake = require('./snake.js');

function userMove(usr, dir) {
  return {
    user: usr,
    direction: dir
  };
}

function SnakeGame(gid, w, h, snakeLength, nsp, gameEnded){
    var gameId = gid;
    var playerCount = 0;
    var width = (w < 20) ? 20 : w;
    var height = (h < 20) ? 20 : h;
    var snake = Snake(snakeLength, Direction.UP, width, height);
    var appleCoords = generatePellet();
    var changedCoords = {};
    var time = 0;
    var timeout = undefined;
    var io = nsp;
    var onGameEnded = gameEnded;
    var startingLength;
    var lastMove = undefined;
    var self;
    var running = false;
    var freshGame = true;

    init(freshGame);

    function init(fresh){

      if (fresh) {
        startingLength = snakeLength;
        io.on('connection', function (socket) {
          io.to(socket.id).emit('updateDisplay', getInitialState(fresh));
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
      }
    }

    function refresh() {
      init(freshGame);
    }

    function tick(){
      snake.setDirection(lastMove, onGoodMove);
      var nextPosition = snake.getNextPosition();
      var willGrow = false;
      if(isValidMove(nextPosition)) {
        if (nextPosition.equals(appleCoords)) {
          //console.log("apple eaten");
          appleCoords = generatePellet();
          changedCoords.apple = appleCoords;
          willGrow = true;
          snake.grow();
        }
        else {
          snake.move();
        }
        updateChangedCoords(willGrow);

        time = time + 1;
        io.emit('updateDisplay', changedCoords);
      }
      else {
        stopGame();
      }
    }

    function updateChangedCoords(willGrow) {
        delete changedCoords.snake;
        delete changedCoords.background;

        var head = snake.getHead();
        var previousTail = snake.getPreviousTail();

        changedCoords.snake = head;
        changedCoords.background = previousTail;
    }

    function beginGame() {
      if (!freshGame){
        reset();
      }
      running = true;
      self = this;
      timeout = setInterval(tick, 150);
    }

    function stopGame() {
      running = false;
      console.log("Stopping Game");
      clearInterval(timeout);
      timeout = undefined;
      onGameEnded(self);
      refresh();
    }

    function reset() {
      snake.initialize(startingLength, Direction.UP, width, height);
      time = 0;
      io.emit('updateDisplay', getInitialState(true));
    }

    function generatePellet() {
      var goodLocation = false;
      var coord;
      while(!goodLocation){
        var x = Math.floor(Math.random() * width);
        var y = Math.floor(Math.random() * height);
        coord = new Coord(x,y);
        if(!snake.inSnake(coord)){
          goodLocation = true;
        }
      }
      return coord;
    }

    function isValidMove(coord){
      var valid = true;
      if(coord.getX() < 0 || coord.getX() > width - 1){
        valid = false;
      }
      if(coord.getY() < 0 || coord.getY() > height - 1){
        valid = false;
      }
      if(snake.inSnake(coord)){
        valid = false;
      }
      return valid;
    }

    function getInitialState(isReset){
      return {snake: snake.getBody(), apple: appleCoords, reset: isReset};
    }

    function onGoodMove(user, dir) {
      var moveData = {'username' : user, 'move' : Direction.NameFromValue(dir)};
      io.emit('move', moveData);
    }

    function changeDirection(user, dir) {
      lastMove = userMove(user,dir);
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
      playerCount += 1;
    }
    function subtractPlayer() {
      playerCount -= 1;
    }

    function getPlayerCount(){
      return playerCount;
    }

    function getDuration(){
      return time;
    }

    function getSnakeLength(){
      return snake.getLength();
    }

    function isRunning(){
      return running;
    }

    return {
        gameId: gameId,
        getPlayerCount: getPlayerCount,
        playerCount: playerCount,
        snake: snake,
        width: width,
        height: height,
        time: time,
        onGameEnded: onGameEnded,
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
