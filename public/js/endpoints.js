var Direction = {
  UP: 0,
  DOWN: 1,
  LEFT: 2,
  RIGHT: 3
};


function getUser(){
  return "bla";
}

function getGame(){
  return 1234;
}

function getLength(){
  return 4;
}

function changeDirection(direction){
  var data = {"direction" : direction};
  socket.emit('change-direction',data);
}

/*-----------------------------------------------------------------------------
PROGRAM FLOW
-----------------------------------------------------------------------------*/
$(function(){
  var socket = io.connect();

  $("#moveup").click(function(){
    changeDirection(Direction.UP);
  });

  $("#movedown").click(function(){
    changeDirection(Direction.DOWN);
  });

  $("#moveleft").click(function(){
    changeDirection(Direction.LEFT);
  });

  $("#moveright").click(function(){
    changeDirection(Direction.RIGHT);
  });
});
