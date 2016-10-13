var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');

var mongo = require('./db');
var authentication = require('./auth');

var app = express();

mongo.connect(function(){
  var mdb = mongo.getDB();
  var auth = new authentication.auth(mdb);

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
  // Index / Home Page
  app.get('/', function(req, res){
    res.render('index', {});
  });
  /*
  app.get('/endpoints', function(req,res){
    res.render('endpoints');
  });

  app.get('/games/join', function(req,res){               // view open games list
    res.render('game_list', {'games' : games, 'path' : 'join'});
  });
  app.get('/games/spectate', function(req,res){           // view open games list
    res.render('spectator_list', {'games' : fullGames, 'path' : 'spectate'});
  });
  app.get('/games/spectate/:gameid', function(req,res){});   // spectate specific game
  app.get('/games/create', function(req,res){                // view creation options
    console.log("new game");
    res.render('create_game');
  });
  app.post('/games/create', function(req,res){               // create new game
    var gameid = req.body.gamename;
    console.log(gameid);
    games.push(gameid);
    res.redirect('/games/' + gameid);
  });
  app.get('/games/:gameid', function(req,res){               // page for game itself
    res.render('game_page');
  });
  app.get('/stats',function(req,res){});                     // view stats
  */

  // example of how to auth somebody before letting them visit page
  // probably a better way to pass the user data around than this, too tired though to look more
  app.get('/games',auth.authTest,function(req,res){
    res.render('game_page',{'username' : req.session.user});
  });
  /*-----------------------------------------------------------------------------
  LOGIN/ACCOUNT ROUTES
  Creates a session whenever user posts to /login proper credentials.  Every
  other page route must first pass through the auth method, which checks the
  credentials.
  -----------------------------------------------------------------------------*/
  app.get('/create',function(req,res){
    res.render('create_account',{'error': "", 'success' : ''});
  });

  app.post('/create',function(req,res){
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

  app.get('/login', function (req, res) {
    res.render('login_account',{'error': "", 'success' : ""});
  });

  app.post('/login', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    if (!username || !password) {
      res.send('login failed');
    }
    else{
      auth.testUsername(username,password,req,res,auth.loginUser);
    }
  });

  app.get('/logout', function (req, res) {
    req.session.destroy();
    res.send("logout success!");
  });

  app.get('/content', auth.authTest, function (req, res) {
      res.send("You can only see this after you've logged in.");
  });

});

module.exports.app = app;
