
//var socket = io.connect();

function createAccount(e){
  var validEntries = new RegExp("^([a-zA-Z0-9]{5,})$");  //no spaces, only alphanumeric, 5+ letters
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
}

function createGame(e){
  var validEntries = new RegExp("^([a-zA-Z0-9]{5,})$");  //no spaces, only alphanumeric, 5+ letters
  var message = "";
  $("#error").html("");
  var gameNameValid = validEntries.test($("#gamename").val());
  if(!gameNameValid){
    message += "<li>Usernames must be at least 5 characters and alphanumeric</li>";
  }
  if(!gameNameValid){
    e.preventDefault();
    $("#error").html("<ul>" + message + "</ul>");
    $("#error").show();
  }
  else{
    //e.preventDefault();
    console.log("GOOD GAME NAME");
  }
}
/*=============================================================================
MAIN SCRIPT FLOW
=============================================================================*/
$(function(){
  $("#create").submit(function(e){createAccount(e);});
  $("#create-game").submit(function(e){createGame(e)});
});
