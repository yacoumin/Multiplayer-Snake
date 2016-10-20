var displayContainer = $("#display");
var display = $("#display")[0].getContext("2d");
var SQ_SIZE = 20;
var width = displayContainer.width() / SQ_SIZE;
var height = displayContainer.height() / SQ_SIZE;

var socket = io.connect("/room2");

socket.on('random', function(data){
  $("#randContainer").html(data.rand);
  //drawSquare(data.x,data.y,"black");
});

function drawSquare(x, y, color) {
  display.fillStyle = color;

  if (!(0 <= x && x < width && 0 <= y && y < height))
    return;

  display.fillRect(x*SQ_SIZE, y*SQ_SIZE, SQ_SIZE, SQ_SIZE);
}
