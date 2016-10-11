var MongoClient = require('mongodb').MongoClient;
var mongoURI = 'mongodb://ds021326.mlab.com:21326/';
//var mongoURI = 'mongodb://ec2-54-175-174-41.compute-1.amazonaws.com:443/' //the URI that works on the UMN network
var db_name = "game";
var db_user = "admin";
var db_pswd = "admin";

var userWaiting;
var games = [];

var express = require('express');
var auth = require('./server/auth');
var bodyParser = require('body-parser');
//var game = require('./server/game');

app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
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
SOCKET ROUTES
-----------------------------------------------------------------------------*/
        io.sockets.on('connection', function (socket) {
          socket.on('joinGame', function(data){
            if(userWaiting){
              //create new game with userWaiting
            }
            else{
              userWaiting = socket;
            }
          });
        });

/*-----------------------------------------------------------------------------
PAGE ROUTES
-----------------------------------------------------------------------------*/
        // Index / Home Page
        app.get('/', function(req, res){
          res.render('index', {});
        });

        app.get('/endpoints', function(req,res){
          res.render('endpoints');
        });

        app.get('/games/join', function(req,res){});               // view open games list
        app.put('/games/join/:gameid', function(req,res){});       // join specific game
        app.get('/games/spectate', function(req,res){});           // view open games list
        app.get('/games/spectate/:gameid', function(req,res){});   // spectate specific game
        app.get('/games/create', function(req,res){                // view creation options
          console.log("new game");
          res.render('create_game');
        });
        app.post('/games/create', function(req,res){               // create new game
          var gameid = req.body.gamename;
          console.log(gameid);
          res.redirect('/games/' + gameid);
        });
        app.get('/games/:gameid', function(req,res){               // page for game itself
          res.render('game_page');
        });
        app.get('/stats',function(req,res){});                     // view stats

      }
    });
  }
});
