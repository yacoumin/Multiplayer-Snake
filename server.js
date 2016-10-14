//var expressInstance = require('./server/util/app');
//var myApp = expressInstance.app;
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');

var mongo = require('./server/util/db');
var Authentication = require('./server/util/auth');
var GameTracker = require('./server/game/game_tracker.js')

var app = express();
var port = process.env.PORT || 3000;
var server = app.listen(port);
var io = require('socket.io').listen(server);
/*=============================================================================
SOCKET ROUTES
=============================================================================*/
io.sockets.on('connection', function (socket) {
  socket.on('message', function (message) {
      var data = { 'message' : message.message, 'username': message.username }
      socket.broadcast.emit('message', data);
      //io.to(socket.id).emit('testio',{"stillworks":"stillworks"});
  })
});

mongo.connect(function(){
  var mdb = mongo.getDB();
  var auth = new Authentication.auth(mdb);
  var gameTracker = new GameTracker();

  app.set('view engine', 'ejs');
  app.use(express.static('public'));
  app.use(session({
    secret: '1234-5678-9012345',
    resave: true,
    saveUninitialized: true
  }));
  app.use(bodyParser.urlencoded({
      extended: true
  }));
  app.use(bodyParser.json());

  /*=============================================================================
  PAGE ROUTES
  =============================================================================*/
  app.get('/', function(req, res){
    res.render('index');
  });
  /*-----------------------------------------------------------------------------
  GAME CREATION/JOINING
  -----------------------------------------------------------------------------*/
  // list of games to join
  app.get('/games/join',auth.authTest,function(req,res){
    res.render('game_list',{'username' : req.session.user, 'games' : gameTracker.getGames(), 'link' : '/games/'});
  });

  // list of games to spectate
  app.get('/games/spectate',auth.authTest,function(req,res){
    res.render('game_list',{'username' : req.session.user, 'games' : gameTracker.getGames(), 'link' : '/games/spectate/'});
  });

  // page to create a game
  app.get('/games/create',auth.authTest,function(req,res){
    res.render('game_create',{'error' : ''});
  });

  // actually create game
  app.post('/games/create',auth.authTest,function(req,res){
    var gameName = req.body.gamename;
    if(gameTracker.getGameById(gameName)){ // game exists, dont create
      res.render('game_create',{'error' : "Game name is already in use"});
    }
    else{
      var nsp = io.of("/games/" + gameName);
      gameTracker.createGame(gameName, nsp);
      gameTracker.getGameById(gameName).beginGame();

      res.redirect('/games/' + gameName);

    }
  });

  app.get('/games/:gameid',auth.authTest,function(req,res){
    var gameid = req.params.gameid;
    // if the game exists, render
    if(gameTracker.getGameById(gameid)){
      var currGame = gameTracker.getGameById(gameid);
      res.render('game_page',{'username' : req.session.user, 'gameid' : gameid,
                'displayWidth' : currGame.width, 'displayHeight' : currGame.height, 'spectate' : false});
    }
    else{
      res.sendStatus(404);
    }
  });

  app.get('/games/spectate/:gameid',auth.authTest,function(req,res){
    var gameid = req.params.gameid;
    // if the game exists, render
    if(gameTracker.getGameById(gameid)){
      var currGame = gameTracker.getGameById(gameid);
      res.render('game_page',{'username' : req.session.user, 'gameid' : gameid,
                'displayWidth' : currGame.width, 'displayHeight' : currGame.height, 'spectate' : true});
    }
    else{
      res.sendStatus(404);
    }  });

  /*-----------------------------------------------------------------------------
  LOGIN/ACCOUNT ROUTES
  Creates a session whenever user posts to /login proper credentials.  Every
  other page route must first pass through the auth method, which checks the
  credentials.
  -----------------------------------------------------------------------------*/
  app.get('/users/create',function(req,res){
    res.render('create_account',{'error': "", 'success' : ''});
  });

  app.post('/users/create',function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    if (!username || !password) {
      console.log("no username or password");
      res.render('create_account',{'error' : 'Missing information in form', 'success' : ''});
    }
    else{
      auth.testUsername(username,password,req,res,auth.createUser);
    }
  });

  app.get('/users/login', function (req, res) {
    res.render('login_account',{'error': "", 'success' : ""});
  });

  app.post('/users/login', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    if (!username || !password) {
      res.send('login failed');
    }
    else{
      auth.testUsername(username,password,req,res,auth.loginUser);
    }
  });

  app.get('/users/logout', function (req, res) {
    req.session.destroy();
    res.send("logout success!");
  });

/*-----------------------------------------------------------------------------
GAME API ROUTES
Handle client requests to alter the game state
-----------------------------------------------------------------------------*/

  function move(game,func){
    if(game){
      func();
      res.sendStatus(200);
    }
    else{
      res.sendStatus(404);
    }
  }

  app.post('games/:gameid/up', function() {
    var game = gameTracker.getGameById(gameid);
    move(game, game.up);
  })

  app.post('games/:gameid/down', function() {
    var game = gameTracker.getGameById(gameid);
    move(game, game.down);
  })

  app.post('games/:gameid/left', function(){
    var game = gameTracker.getGameById(gameid);
    move(game, game.left);
  })

  app.post('games/:gameid/right', function(req, res) {
    var game = gameTracker.getGameById(gameid);
    move(game, game.right);
  })
});
