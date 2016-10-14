$(document).ready(function() {
    var CellType = {
        BACKGROUND: "black",
        SNAKE: "white",
        GROWTH: "green",
        SHRINK: "red"
    }
    var p1_canvas = $("#p1");
    var p2_canvas = $("#p2");
    var sq_size = 20;
    var display = p1_canvas[0].getContext("2d");
    var opponentDisplay = p2_canvas[0].getContext("2d");
    var display_width = p1_canvas.width();
    var display_height = p1_canvas.height();
    var dot_color = "red";

    function drawCell(panel, x, y, cellType) {
        panel.fillStyle = cellType;
        var x_start = x*sq_size;
        var y_start = y*sq_size;
        if (x_start < display_width &&
            y_start < display_height){
              panel.fillRect(x_start, y_start, sq_size, sq_size);
            }
    }

    var socket = io.connect();

    socket.on('updateDisplay', function(data) {
      drawCell(display, data['pos'][0], data['pos'][1], "black");
      drawCell(display, data['pos'][2], data['pos'][3], dot_color);
    });

    socket.on('updateOpponentDisplay', function(data) {
      drawCell(opponentDisplay, data['pos'][0], data['pos'][1], "black");
      drawCell(opponentDisplay, data['pos'][2], data['pos'][3], dot_color);
    });

    $("#manipSubmit").on('click', function() {
        //var x = $("#x_info").val();
        //var y = $("#y_info").val();
        var color = $("#color_info").val();

        socket.emit('sendUpdateToOpponent', {'color' : color});
        /*if (x !== "" && y !== "" && color !== ""){
            drawCell(parseInt(x),parseInt(y),color);
        }*/
    });

    socket.on('fetchUpdateFromOpponent', function(data){
        if (data['color'] !== "")
            dot_color = data['color'];
    });

});
