/*==============================================================================
NECESSARY FILES

npm install express --save                // for express
npm install express-session --save        // for server side sessions
npm install mongodb --save                // user db
npm install body-parser --save            // to get values from req post data

==============================================================================*/
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');

// custom requires
var mongo = require('./server/util/db');
var Authentication = require('./server/util/auth');

// setup server
var app = express();
var port = process.env.PORT || 3000;
var server = app.listen(port);
var io = require('socket.io').listen(server);


mongo.connect(function(){
  var mdb = mongo.getDB();
  var auth = new Authentication.auth(mdb);

  app.use(session({
    secret: '1234-5678-9012345',
    resave: true,
    saveUninitialized: true
  }));
  app.use(bodyParser.urlencoded({
      extended: true
  }));
  app.use(bodyParser.json());


  /*-----------------------------------------------------------------------------
   LOGIN/ACCOUNT ROUTES
   Creates a session whenever user posts to /login proper credentials.  Every
   other page route must first pass through the auth method, which checks the
   credentials.
   -----------------------------------------------------------------------------*/
   app.post('/users/create',function(req,res){
     var username = req.body.username;
     var password = req.body.password;
     console.log(username);
     console.log(password);
     auth.testUsername(username,password,req,res,auth.createUser);
   });

   app.post('/users/login', function (req, res) {
     var username = req.body.username;
     var password = req.body.password;
     auth.testUsername(username,password,req,res,auth.loginUser);
   });

   app.delete('/users/logout', function (req, res) {
     req.session.destroy();
     res.json({
       'success' : 'true',
       'message' : 'successful logout'
     });
   });

   /*-----------------------------------------------------------------------------
    SECURE ROUTES EXAMPLES
    -----------------------------------------------------------------------------*/
    /*
    app.get('/insecure/games/:gameid',function(req,res){
      var gameid = req.params.gameid;
      res.json({
        'success' : true,
        'message' : 'in unsecured gameid environment',
        'game' : gameid
      });
    });

    app.get('/secure/games/:gameid', auth.authTest, function(req,res){
      var gameid = req.params.gameid;
      res.json({
        'success' : true,
        'message' : 'in secured gameid environment',
        'username' : req.session.user,
        'game' : gameid
      });
    });
    */
  /*-----------------------------------------------------------------------------
   SECURE CHUNKS
   -----------------------------------------------------------------------------*/
   /*
   app.use('/secure/',auth.authTest);

   app.get('/insecure/games/:gameid',function(req,res){
     var gameid = req.params.gameid;
     res.json({
       'success' : true,
       'message' : 'in unsecured gameid environment',
       'game' : gameid
     });
   });

   app.get('/secure/games/:gameid', function(req,res){
     var gameid = req.params.gameid;
     res.json({
       'success' : true,
       'message' : 'in secured gameid environment',
       'username' : req.session.user,
       'game' : gameid
     });
   });
   */

   
}); // end mongodb connect
