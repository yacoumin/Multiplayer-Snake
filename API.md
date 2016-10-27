# API Endpoints #
---
## Overview ##
Before we start, we would like to talk about a general overview of how we structured our endpoints.  Near the end of the project we realized that we may have mischaracterized this project, but we still believe we got at the heart of what we were supposed to learn.  Hopefully, through a description of our endpoints, how we dealt with data, and by showing that we understand the mistakes we made and how to rectify them, we can prove our understanding of what we did right, and what we did wrong.  The only major problem with fixing the issues is that they would be significant refactors to the project, and there would only be small changes in the eventual outcome.

To begin, we'll go over a generic description of our endpoints, and then in the final section we'll walk through how we could have converted them into something more akin to a traditional REST API with JSON return data and how to build our pages in that manner instead of the way we did it, page renders.  

## UI Endpoints ##
### GET / ###
- __Description:__ Returns a rendered html homepage
- __Required Attributes:__ None
- __cURL:__ curl -G https://whispering-dawn-13039.herokuapp.com/
- __Return Data:__ 200 on success, and a rendered html page

### GET /games/join ###
- __Description:__ Returns a rendered html page that has a list of current games
- __Required Attributes:__ None
- __cURL:__ curl -G https://whispering-dawn-13039.herokuapp.com/games/join
- __Return Data:__ 200 on success, and a rendered html page

### GET /games/create ###
- __Description:__ Returns a rendered html page that has a form element that allows the creation of a game
- __Required Attributes:__ None
- __cURL:__ curl -G https://whispering-dawn-13039.herokuapp.com/games/create
- __Return Data:__ 200 on success, and a rendered html page


### GET /games/:gameid ###
- __Description:__ Returns a game view of a page that allows a user to interact with the game
- __Required Attributes:__ gameid
- __cURL:__ curl -G https://whispering-dawn-13039.herokuapp.com/games/hello
- __Return Data:__ 200 and rendered html page of game when gameid hello is active and logged in, otherwise rendered account login page or 404 if logged in and game inactive


### GET /games/spectate ###
- __Description:__ renders an html page containing a list of running games
- __Required Attributes:__ None
- __cURL:__ curl -G https://whispering-dawn-13039.herokuapp.com/games/spectate
- __Return Data:__ 200 and rendered html page of active games when logged in, otherwise rendered account login page

### GET /games/spectate/:gameid ###
- __Description:__ Renders a game view of a page which allows a user to spectate a game (disabled snake controls)
- __Required Attributes:__ gameid
- __cURL:__ curl -G https://whispering-dawn-13039.herokuapp.com/games/spectate/hello
- __Return Data:__ 200 and rendered html page of game when gameid hello is active and logged in, otherwise rendered account login page or 404 if logged in and game inactive

### GET /users/create ###
- __Description:__ Renders an account creation page
- __Required Attributes:__ None
- __cURL:__ curl -G https://whispering-dawn-13039.herokuapp.com/users/create
- __Return Data:__ 200 on success and rendered html page for account creation

### GET /users/login ###
- __Description:__ Renders a user login form
- __Required Attributes:__ None
- __cURL:__ curl -G https://whispering-dawn-13039.herokuapp.com/users/login
- __Return Data:__ 200 on success and rendered html page for account login

### GET /stats ###
- __Description:__ Renders a statistics page containing a list of the top 15 games played, ordered by the number of players present at the end of the game.
- __Required Attributes:__ None
- __cURL:__ curl -G https://whispering-dawn-13039.herokuapp.com/stats
- __Return Data:__ 200 on success and rendered html page of stats

## Account Endpoints ##
### POST /users/create ###
- __Description:__ Creates a user and puts their information into the user database, then returns a rendered html page showing if they succeeded or failed
- __Required Attributes:__ username, password
- __cURL:__ curl --data "username=newname&password=newpass" https://whispering-dawn-13039.herokuapp.com/users/create
- __Return Data:__ 200, but will render page with error messages if username or password don't validate correctly

### POST /users/login ###
- __Description:__ Logs the user in via the database, and stores their information in session storage
- __Required Attributes:__ username, password
- __cURL:__ curl --data "username=hello&password=hello" https://whispering-dawn-13039.herokuapp.com/users/login
- __Return Data:__ 200 and rendered html page, but will render page with error or success messages if username or password don't validate correctly

### DELETE /users/logout ###
- __Description:__ Destroys the user's session storage and logs them out from the website
- __Required Attributes:__ user is currently logged in
- __cURL:__ curl -X DELETE https://whispering-dawn-13039.herokuapp.com/users/logout
- __Return Data:__ 200, redirects to root path

## Game Endpoints ##
### POST /games/create ###
- __Description:__ Creates a valid game in server memory
- __Required Attribute:__ gamename that holds valid game name (no spaces, alphanumeric) and user logged in
- __cURL:__ curl --data "gamename=hello" https://whispering-dawn-13039.herokuapp.com/games/create
- __Return Data:__ 200 on success and rendered html page of game if gameid is valid, otherwise re renders the original game creation page

### POST /games/:gameid/up ###
- __Description:__ Moves the snake up for the appropriate game
- __Required Attributes:__ gameid and user logged in
- __cURL:__ curl -X POST https://whispering-dawn-13039.herokuapp.com/games/hello/up
- __Return Data:__ 200 on success, 404 on game not found or game not currently playing

### POST /games/:gameid/down ###
- __Description:__ Moves the snake down for the appropriate game
- __Required Attributes:__ gameid and user logged in
- __cURL:__ curl -X POST https://whispering-dawn-13039.herokuapp.com/games/hello/down
- __Return Data:__ 200 on success, 404 on game not found or game not currently playing

### POST /games/:gameid/left ###
- __Description:__ Moves the snake left for the appropriate game
- __Required Attributes:__ gameid and user logged in
- __cURL:__ curl -X POST https://whispering-dawn-13039.herokuapp.com/games/hello/left
- __Return Data:__ 200 on success, 404 on game not found or game not currently playing

### POST /games/:gameid/right ###
- __Description:__ Moves the snake right for the appropriate game
- __Required Attributes:__ gameid and user logged in
- __cURL:__ curl -X POST https://whispering-dawn-13039.herokuapp.com/games/hello/right
- __Return Data:__ 200 on success, 404 on game not found or game not currently playing

### POST /games/:gameid/restart ###
- __Description:__ Restarts the appropriate snake game
- __Required Attributes:__ gameid and user logged in
- __cURL:__ curl -X POST https://whispering-dawn-13039.herokuapp.com/games/hello/restart
- __Return Data:__ 200 on success, 404 on game not found or if game currently in progress

## How We Could Have Refactored ##
### Example 1 -- Moves ###
So, since we did a lot of page rendering via HTML, we'll talk about how we could have converted a couple of our endpoints to be more API friendly to outside programmers to show that we understand the concepts.  For the first example, we'll talk about moving the snake, so our move endpoints.  Currently, for the client code (a condensed form), we have  
```
function postAjax(path){
    $.ajax({
        type: 'POST',
        url: path,
        data: {}
    });
}

$(document).keydown(function(e) {
  var current_path = window.location.pathname;
  var Key = {LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40};

  if (37 <= e.which && e.which <= 40){
    switch (e.which) {
      case Key.LEFT:
        postAjax(current_path + "/left");
        break;
        //....
    }
    e.preventDefault();
  }
})
```

and on the server side we have
```
function move(gameid,dir,user,res){
  var game = gameTracker.getGameById(gameid)
  if(game && game.isRunning()){
    switch(dir){
      case Direction.LEFT:
        game.left(user); // this part updates the move in snake, and eventually emits a 'move' on the socket namespace
        break;
        //.....
      }
    res.sendStatus(200);
  }
  else{
    res.sendStatus(404);
  }
}

app.post('/games/:gameid/left', function(req, res) {
  var gameid = req.params.gameid;
  move(gameid, Direction.UP, req.session.user, res);
})
```
So, essentially a user clicks move, it gets posted to the server, and they get a status code response.  This is okay, but it isn't exactly perfect information for someone programming from the outside, as it doesn't really give them much information, and it is pretty difficult to test since you are only recieving status codes. It would be better if on the server side, it was instead something along the lines of the following, which gives more information to the programmer, and still has the same type of effect.
```
function move(gameid,dir,user,res){
  var game = gameTracker.getGameById(gameid)
  if(!game){
    res.json({
      success: false,
      message: "Game doesn't exist"
    });
  }
  else if(!game.isRunning()){
    res.json({
      success: false,
      message: "Game is not currently running, please restart",
    })
  }
  else{
    var message = "";
    switch(dir){
      case Direction.LEFT:
        game.left(user); // this part updates the move in snake, and eventually emits a 'move' on the socket namespace
        message = "moved left";
        break;
        //.....
    }
    res.json({
      success: true,
      message: message
    });
  }
}

app.post('/games/:gameid/left', function(req, res) {
  var gameid = req.params.gameid;
  move(gameid, Direction.UP, req.session.user, res);
})
```
This is a minor example, since you can technically get by with just the status codes, so nothing on the client side would really be necessary to change, but a more glaring problem is when our page simply returns rendered html, as that is very difficult for a programmer to interpret, as the next example will show.  

### Example 2 -- Game Creation ###
Currently, on the client side, our code, in a condensed format, is something like the following, which is a simple form, that has a div that gets rendered with a message if something goes wrong after it posts to the server.
```
<div>
  <form id="create-game" name="create-game" action="/games/create" method="post">
    <input type="text" id="gamename" name="gamename" placeholder="game name" required></input></br>
    <input type="submit" class="submit-button" value="submit"></input></br>
  </form>
  <div class="alert alert-warning" id="error">
    <%= error %>
  </div>
</div>
<% if(!error){ %>
<script>$("#error").hide()</script>
<% } %>
```
That was a pretty simple form, but there is a lot more packed onto the server side, because that does the page rendering logic along with the validation logic, so this is the gist of our server side code:
```
app.post('/games/create',auth.authTest,function(req,res){
  var gameName = req.body.gamename;
  if(gameTracker.getGameById(gameName)){              // game exists, dont create
    res.render('game_create',{'error' : "Game name is already in use"});
  }
  else{
    var nsp = io.of("/games/" + gameName);            // create the related namespace
    gameTracker.createGame(gameName, nsp);            // create the game in memory
    gameTracker.getGameById(gameName).beginGame();    // start the instantiated game
    res.redirect('/games/' + gameName);               // move the player to the page
  }
});
```
To better follow the traditional API standards, we would want to change the way this interacts and put a little more burden on the client side code, since that is where the majority of the API calls would be coming from if we were developing this for other programmers to use.  For example, our client side code could be reconfigured to something like this:
```
<form id="create-game" name="create-game" action="/games/create" method="post">
  <input type="text" id="gamename" name="gamename" placeholder="game name" required></input></br>
  <button id="sub">Submit</button></br>
</form>
<div class="alert alert-warning" id="error"></div>

//....

<script>
$(function(){
  $("#sub").click(function(){
    $.ajax({
        type: 'POST',
        url: /games/create,
        data: {
          gamename: $("#gamename").val()
        }
        success: function(data){
          if(data.success){
            window.location.href = window.location.hostname + "/games/" + data.gamename;
          }
          else{
            $("#error").html("<span>" + data.message + "</span>");
          }
        }
        error: function(){
          $("#error").html("<span>An unknown error occurred</span>");
        }
    });
  });
});
</script>
```
Now we've moved more of the logic onto the client side, and it decides how to render the page depending on the json response object, so the server side code should become a little more straightforward.  It will look more complicated, since it has more lines, but really the original version was more complicated because it wasn't showing all the behind the scenes code that was going on in the rendering process.  So, this would be an example of what we would need to adjust to:
```
app.post('/games/create',auth.authTest,function(req,res){
  var gameName = req.body.gamename;
  if(gameTracker.getGameById(gameName)){              // game exists, dont create
    res.json({
      success: false,
      message: "Game already exists, can't create",
      gamename: gameName
    });
  }
  else{
    var nsp = io.of("/games/" + gameName);            // create the related namespace
    gameTracker.createGame(gameName, nsp);            // create the game in memory
    gameTracker.getGameById(gameName).beginGame();    // start the instantiated game
    res.json({
      success: true,
      message: "Game successfully created",
      gamename: gameName
    });
  }
});
```
So, in sum, the same ideas are present in both different configurations, and the meaning is clear, but it would be a significant rework to do this on every single endpoint, and since we realized it so late, we didn't think it would be feasible to do a complete rework, especially since we were proud of our original product, and it is only a slight shift in logic to change how the client and server interact through these endpoints and responses.
