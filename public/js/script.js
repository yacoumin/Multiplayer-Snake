/*
var socket = io.connect();

socket.on('message', function(data) {
    addMessage(data['message'], data['username']);
});


// Wait until jquery is loaded because we going to need it
$(function() {
    // Hide the chat controls, we don't want the user sending messages until
    // they have given us a username
    $("#chatControls").hide();

    // If the user clicks the button to set their username we call setUsername
    $("#userSet").click(function() {setUsername()});

    // If the user clicks the button to send a message we call sendMessage
    $("#submit").click(function() {sendMessage();});
});
*/
// wait on jQuery
$(function(){
  var validEntries = new RegExp("^([a-zA-Z0-9]{5,})$");  //no spaces, only alphanumeric, 5+ letters

  $("#create").submit(function(e){
    var message = "";
    $("#error").html("");
    var usernameValid = validEntries.test($("#username").val());
    var passwordsMatch = $("#password").val() === $("#passwordValidate").val();
    var passwordValid = validEntries.test($("#password").val());
    if(!usernameValid){
      message += "<li>Usernames must be at least 5 characters and alphanumeric</li>";
    }
    if(!passwordsMatch){
      message += "<li>Passwords don't match</li>";
    }
    if(!passwordValid){
      message += "<li>Passwords must be at least 5 characters and alphanumeric</li>";
    }
    if(!usernameValid || !passwordsMatch || !passwordValid){
      e.preventDefault();
      $("#error").html("<ul>" + message + "</ul>");
      $("#error").show();
    }
    else{
      //e.preventDefault();
      console.log("GOOD ACCOUNT");
    }
  });
});
