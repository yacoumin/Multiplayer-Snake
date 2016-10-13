var MongoClient = require('mongodb').MongoClient;
var mongoURI = 'mongodb://ds021326.mlab.com:21326/';
//var mongoURI = 'mongodb://ec2-54-175-174-41.compute-1.amazonaws.com:443/' //the URI that works on the UMN network
var db_name = "game";
var db_user = "admin";
var db_pswd = "admin";

var usersDB = "users";

var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var SnakeGame = require('./server/snake_game');

//var auth = require('./server/auth');
//var game = require('./server/game');


app = express();

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


MongoClient.connect(mongoURI + db_name, function(err, db){
  if (err) {
    console.log("COULDNT CONNECT TO DB");
    throw err;
  }
  else {
    db.authenticate(db_user, db_pswd, function(err, result) {
      if (err) {
        console.log("COULDNT AUTH DB");
        throw err;
      }
      else { //db good
        var port = process.env.PORT || 3000;
        var server = app.listen(port);
        var io = require('socket.io').listen(server);
/*-----------------------------------------------------------------------------
ACCOUNT methods
-----------------------------------------------------------------------------*/
        var validUser = function(username,password){
          if(db.find(username)){}
        }

        // callback for when username is tested to create new user
        var createUser = function(username,password,req,res,usernameMatches){
          if(usernameMatches.length > 0){
            console.log("username taken");
            res.render('create_account',{'error' : 'Username has already been taken', 'success' : ''});
          }
          else{
            var data = {'username' : username, 'password' : password}
            var collection = db.collection(usersDB);
            collection.insert(data,function(err, ids){});
            console.log("Message good, inserting");
            res.render('create_account',{'error' : '', 'success' : "Account successfully created"});
          }
        }

        //callback for when username is tested to login new user
        var loginUser = function(username,password,req,res,usernameMatches){
          if(usernameMatches.length > 0){ // something matched username
            if(password === usernameMatches[0].password){ // passwords match
              console.log("valid login");
              req.session.user = username;
              req.session.admin = true;
              res.render('login_account',{'error' : '', 'success' : "Successfully logged in"});
            }
            else{
              res.render('login_account',{'error' : "Incorrect Password", 'success' : ''});
            }
          }
          else{
            res.render('login_account',{'error' : "No records match this username", 'success' : ''});
          }
        }

        // tests for username existence in DB
        var testUsername = function(username,password,req,res,callback){
          var collection = db.collection(usersDB);
          collection.find({'username' : username}).toArray(function(err,matchingNames){
            callback(username,password,req,res,matchingNames);
          });
        }

        // checks if user is currently in session data and logged in
        var auth = function(req, res, next) {
          var collection = db.collection(usersDB);
          if(req.session && req.session.user &&req.session.admin){
            collection.findOne({'username' : req.session.user},function(err,user){
              if(err){
                res.render('login_account',{'error' : "You must login before accessing this page", 'success' : ''});
              }
              next();
            });
          }
          else{
            res.render('login_account',{'error' : "You must login before accessing this page", 'success' : ''});
          }
        };
/*=============================================================================
SOCKET ROUTES
=============================================================================*/
        io.sockets.on('connection', function (socket) {

          socket.on('message', function (message) {
              var data = { 'message' : message.message, 'username': message.username }
              socket.broadcast.emit('message', data);
          })
        });

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
        app.get('/games',auth,function(req,res){
          // Make the game if there are no games playing
          if (Object.keys(activeGames).length === 0) {
            createGame(1);
          }
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
            testUsername(username,password,req,res,createUser);
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
            testUsername(username,password,req,res,loginUser);
          }
        });

        app.get('/logout', function (req, res) {
          req.session.destroy();
          res.send("logout success!");
        });

        app.get('/content', auth, function (req, res) {
            res.send("You can only see this after you've logged in.");
        });

/*-----------------------------------------------------------------------------
GAME METHODS
Methods for creating, altering, saving, and destroying games,
-----------------------------------------------------------------------------*/

        var activeGames = {};

        function getGameById(gameId) {
          return activeGames[gameId];
        }

        function changeGameDirection(gameId, direction) {
          var game = getGameById(gameId);
          game.setDirection(Direction.UP);
        }

        function startGame(gameId) {
          var game = getGameById(gameId);
          game.beginGame();
        }

        function createGame(gameId) {
          if (activeGames[gameId] != undefined) {
            throw "game with game id \"" + gameId + "\" already exists! Can't create";
          }
          else {
            console.log("creating game " + gameId);
            activeGames[gameId] = new SnakeGame(gameId, 20, 20, 3);
            console.log(activeGames[gameId]);
          }
        }

        function destroyGame(gameId) {
          if (activeGames[gameId] != undefined) {
            delete activeGames[gameId];
          }
        }

/*-----------------------------------------------------------------------------
GAME API ROUTES
Handle client requests to alter the game state
-----------------------------------------------------------------------------*/

        app.post('games/:gameid/up', function() {
          changeGameDirection(gameId, Direction.UP);
          res.send(200);
        })
        app.post('games/:gameid/down', function() {
          var game = getGameById(gameId);
          changeGameDirection(gameId, Direction.DOWN);
          res.send(200);
        })
        app.post('games/:gameid/left', function(){
          changeGameDirection(gameId, Direction.LEFT);
          res.send(200);
        })
        app.post('games/:gameid/right', function(req, res) {
          changeGameDirection(gameId, Direction.RIGHT);
          res.send(200);
        })

      }
    });
  }
});
