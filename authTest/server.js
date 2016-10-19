/*==============================================================================
NECESSARY FILES

npm install express --save                // for express
npm install express-session --save        // for server side sessions
npm install mongodb --save                // user db
npm install body-parser --save            // to get values from req post data

==============================================================================*/
var express = require('express');             // for routing
var session = require('express-session');     // for server side session storage
var bodyParser = require('body-parser');      // for form body parsing

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
   -----------------------------------------------------------------------------*/
   app.post('/users/create',function(req,res){
     var username = req.body.username;
     var password = req.body.password;
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
        'username' : req.session.user,
        'message' : 'in secured gameid environment',
        'game' : gameid
      });
    });

  /*-----------------------------------------------------------------------------
   SECURE CHUNKS
   -----------------------------------------------------------------------------*/

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

   /*-----------------------------------------------------------------------------
    MIDDLEWARE CHAINING
    -----------------------------------------------------------------------------*/

    function test(req,res,next){
      req.functionAdder = 1;
      next();
    }

    function test2(req,res,next){
      req.functionAdder++;
      next();
    }

    function test3(req,res,next){
      req.functionAdder++;
      next();
    }

    app.get('/chaining',test,test2,test3,function(req,res){
      res.json({
        'success' : true,
        'message' : 'you did some chaining',
        'functionAdder' : req.functionAdder
      });
    });

/*-----------------------------------------------------------------------------
 REGULAR EXPRESSION ROUTING
 -----------------------------------------------------------------------------*/

  app.get(/.*.pdf$/, function(req, res) {
    if(req.session.adobeInstalled){
      res.json({
        'success' : true,
        'message' : 'some pdf file'
      });
    }
    else{
      res.json({
        'success' : false,
        'message' : 'you need to install adobe acrobat reader for this filetype',
        'location' : '/install-adobe'
      });
    }
  });

  app.get('/install-adobe', function(req,res){
    // do something
    req.session.adobeInstalled = true;
    res.json({
      'success' : true,
      'message' : 'adobe successfully installed'
    });
  });


}); // end mongodb connect
