var MongoClient = require('mongodb').MongoClient;
var mongoURI = 'mongodb://ds021326.mlab.com:21326/';
//var mongoURI = 'mongodb://ec2-54-175-174-41.compute-1.amazonaws.com:443/' //the URI that works on the UMN network
var db_name = "game";
var db_user = "admin";
var db_pswd = "admin";

var express = require('express');
var auth = require('./server/auth');

app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

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
          socket.on('move', function(data){
            console.log(data);
          });
          socket.on('eat',function(data){
            console.log(data);
          });
        });

/*-----------------------------------------------------------------------------
PAGE ROUTES
-----------------------------------------------------------------------------*/
        // Index / Home Page
        app.get('/', function(req, res){
          res.render('index', {user: req.user});
        });

        app.get('/endpoints', function(req,res){
          res.render('endpoints');
        });

        app.get('/games', function(req,res){});
        app.post('/games', function(req,res){
          //new game and render page
        });

        app.get('/spectate/:gameid',function(req,res){});

        app.get('/scoreboard',function(req,res){});


        // Login Page
        app.get('/login', function(req, res){
          res.render('login');
        });
/*
        app.post(
          '/login',
          passport.authenticate(
            'local',
            { successRedirect: '/',
              failureRedirect: '/login',
              failureFlash: true }
          )
        );
*/
      }
    });
  }
});
