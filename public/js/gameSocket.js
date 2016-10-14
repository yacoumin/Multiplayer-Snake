var gameId = $("#game-panel").data("game");
var gameSocket = io.connect("/games/" + gameId);

gameSocket.on('message', function(data) {
    addMessage(data.message, data.username);
    console.log('message');
});

gameSocket.on('testing', function(data) {
    console.log(data);
});

function addMessage(msg, username) {
  $("#chat-entries").append('<div class="ind-msg"><span><strong>' + username + '</strong> : ' + msg + '</span></div>');
}

function addMyMessage(msg, username){
  $("#chat-entries").append('<div class="ind-msg"><span class="my-message"><strong>' + username + '</strong> : ' + msg + '</span></div>');

}

function sendMessage(e) {
  if ($('#msg').val() != ""){
    gameSocket.emit('message', {'message' : $('#msg').val(), 'username' : $("#username-hidden").val()});
    addMyMessage($('#msg').val(), "Me");
    $('#msg').val('');
  }
  e.preventDefault(); // make sure to stop the post from redirecting
}

$(function(){
  $("#chatting-form").submit(function(e){sendMessage(e);});
});
