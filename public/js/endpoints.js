function getUser(){
  return "bla";
}

function getGame(){
  return 1234;
}

function getLength(){
  return 4;
}

function move(direction){
  var data = {"user" : getUser(), "game" : getGame(), "direction" : direction, "length" : getLength()};
  socket.emit('move',data);
}

/*-----------------------------------------------------------------------------
PROGRAM FLOW
-----------------------------------------------------------------------------*/
$(function(){
  var socket = io.connect();

  $("#moveup").click(function(){
    move("up");
  });

  $("#movedown").click(function(){
    move("down");
  });

  $("#moveleft").click(function(){
    move("left");
  });

  $("#moveright").click(function(){
    move("right");
  });
});
