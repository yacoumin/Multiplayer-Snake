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
LOGIN methods
-----------------------------------------------------------------------------*/
        var validUser = function(username,password){
          if(db.find(username)){}
        }

        var usernameTaken = function(username){
          var collection = db.collection(usersDB);
          collection.find({'username' : username}).toArray(function(err,docs){
            console.log(docs);
            return docs.length > 0; // if no user found, valid user name to be entered into DB
          });
        }

        var auth = function(req, res, next) {
          if (req.session && req.session.user === "amy" && req.session.admin)
            return next();
          else
            return res.sendStatus(401);
        };
/*=============================================================================
SOCKET ROUTES
=============================================================================*/
        io.sockets.on('connection', function (socket) {
          socket.on('set-name', function(data){

          });
        });

/*=============================================================================
PAGE ROUTES
=============================================================================*/
        // Index / Home Page
        app.get('/', function(req, res){
          res.render('index', {});
        });

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


/*-----------------------------------------------------------------------------
LOGIN/ACCOUNT ROUTES
Creates a session whenever user posts to /login proper credentials.  Every
other page route must first pass through the auth method, which checks the
credentials.
-----------------------------------------------------------------------------*/
        app.get('/create',function(req,res){
          res.render('create_account');
        });

        app.post('/create',function(req,res){
          var username = req.body.username;
          var password = req.body.password;
          if (!username || !password) {
            console.log("no username or password");
            res.render('create_account',{'message' : 'missing information in form'});
          }
          else if(usernameTaken(username)){
            console.log("username taken");
            res.render('create_account',{'message' : 'username has already been taken'});
          }
          else{
            var collection = db.collection(usersDB);
            var data = {'username' : username, 'password' : password}
            //collection.insert(data,function(err, ids){});
            console.log("Message good");
            console.log(data);
            res.render('create_account',{'message' : 'good'});
          }
        });

        app.get('/login', function (req, res) {
          if (!req.query.username || !req.query.password) {
            res.send('login failed');
          } else if(req.query.username === "amy" || req.query.password === "amyspassword") {
            req.session.user = "amy";
            req.session.admin = true;
            res.send("login success!");
          }
        });

        app.post('/login', function (req, res) {
          var username = req.body.username;
          var password = req.body.password;

          if (!username || !password) {
            res.send('login failed');
          } else if(validUser(username,password)) {
            req.session.user = username;
            req.session.admin = true;
            res.send("login success!");
          }
          else{
            res.send("Invalid information entered");
          }
        });

        app.get('/logout', function (req, res) {
          req.session.destroy();
          res.send("logout success!");
        });

        app.get('/content', auth, function (req, res) {
            res.send("You can only see this after you've logged in.");
        });



      }



    });
  }
});
