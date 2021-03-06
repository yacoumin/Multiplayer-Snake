/*  client-side js executed for clients in any game room
 *
 *  - Initializes client display from server-side dimension data passed in on page render
 *  - Creates socket to connect to game, then creates listeners to listen/react when
 *    server emits message or display updates.
 *  - Holds functions for emitting messages to the server, adding messages and moves
 *    to their respective containers in the html, and drawing to the game screen.
 *
*/
var gameId = $("#game-panel").data("game");
var display = $("#display")[0].getContext("2d");
var SQ_SIZE = 20;
var displayWidth = display.canvas.width;
var displayHeight = display.canvas.height;
var cellWidth = displayWidth / SQ_SIZE;
var cellHeight = displayHeight / SQ_SIZE;
var gameSocket = io.connect("/games/" + gameId);

var CellType = {APPLE: "green", SNAKE: "white", BACKGROUND: "black"};

initDisplay();

gameSocket.on('message', function(data) {
    addMessage(data.message, data.username);
    //console.log('message');
});

gameSocket.on('move', function(data) {
    addMove(data.move, data.username);
    //console.log('move');
});

gameSocket.on('updateDisplay', function(data) {
    //console.log(data);
    if (data.reset){
      initDisplay();
    }
    if (data.snake) {
      if (data.snake.length){
        for (var i=0; i< data.snake.length; i++)
          drawCell(data.snake[i].x, data.snake[i].y, CellType.SNAKE);
      }
      else {
        drawCell(data.snake.x, data.snake.y, CellType.SNAKE);
      }
    }
    if (data.apple) {
        drawCell(data.apple.x, data.apple.y, CellType.APPLE);
    }
    if (data.background) {
        drawCell(data.background.x, data.background.y, CellType.BACKGROUND);
    }

});

function addMessage(msg, username) {
  $("#chat-entries").append('<div class="ind-msg"><span><strong>' + username + '</strong> : ' + msg + '</span></div>');
  $("#chat-entries")[0].scrollTop = $("#chat-entries")[0].scrollHeight; // keeps scrolled to bottom
}

function addMove(move, username) {
  $("#move-history").append('<span class="move-message"><span><strong>' + username + '</strong> : ' + move + '</span></li>');
  $("#move-history")[0].scrollTop = $("#move-history")[0].scrollHeight;
}

function addMyMessage(msg, username){
  $("#chat-entries").append('<div class="ind-msg my-message"><span><strong>' + username + '</strong> : ' + msg + '</span></div>');
  $("#chat-entries")[0].scrollTop = $("#chat-entries")[0].scrollHeight; // keeps scrolled to bottom
}

function sendMessage(e) {
  if ($('#msg').val() != ""){
    gameSocket.emit('message', {'message' : $('#msg').val(), 'username' : $("#username-hidden").val()});
    addMyMessage($('#msg').val(), "me");
    $('#msg').val('');
  }
  e.preventDefault(); // make sure to stop the post from redirecting
}

function drawCell(x, y, cellType) {
    display.fillStyle = cellType;
    var x_start = x*SQ_SIZE;
    var y_start = y*SQ_SIZE;
    if (x_start < displayWidth &&
        y_start < displayHeight){
          display.fillRect(x_start, y_start, SQ_SIZE, SQ_SIZE);
    }
}

function initDisplay() {
    for (var i=0; i < cellWidth; i++)
      for (var j=0; j < cellHeight; j++)
          drawCell(i, j, CellType.BACKGROUND);
}



$(function(){
  $("#chatting-form").submit(function(e){sendMessage(e);});
});
