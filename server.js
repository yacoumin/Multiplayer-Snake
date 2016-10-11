var MongoClient = require('mongodb').MongoClient;
var mongoURI = ''
var db_name = ""
var db_user = "";
var db_pswd = "";
var x500 = "";

// Connect to MongoDB
MongoClient.connect(mongoURI + db_name, function(err, db){
  if (err) {
    throw err;
  }
  else {
    db.authenticate(db_user, db_pswd, function(err, result){
      if (err) {
        throw err;
      }
      else {
        // Do server stuff here

        // Require necessary libraries
        var express = require('express'),
            passport = require('passport'),
            LocalStrategy = require('passport-local').Strategy,
            session = require('express-session'),
            MongoStore = require('connect-mongo')(session);

        var sessionStore = new MongoStore({
            db: db
        });

        // Initialize Server
        app = express();

        app.configure(function() {
          app.use(express.static('public'));
          app.use(express.cookieParser());
          app.use(express.bodyParser());
          app.use(express.session({
            secret: 'placeholder',
            resave: false,
            cookie: {},
            store: sessionStore
          }));
          app.use(passport.initialize());
          app.use(passport.session());
          app.use(app.router);
        });

        passport.serializeUser(function(user, done) {
          console.log("serializing user" + user);
          done(null, user);
        });

        passport.deserializeUser(function(id, done) {
          console.log("deserializing user from id: " + id);
          done(err, user);
        });

        passport.use(new LocalStrategy(
          function(username, password, done) {
            // Find user from username and password
            // use done(error, user, message) verification callback at end


            // Example given by passport documentation:
            // User.findOne({ username: username }, function(err, user) {
            //   if (err) { return done(err); }
            //   if (!user) {
            //     return done(null, false, { message: 'Incorrect username.' });
            //   }
            //   if (!user.validPassword(password)) {
            //     return done(null, false, { message: 'Incorrect password.' });
            //   }
            //   return done(null, user);
            // });
          }
        ));

        app.set('view engine', 'ejs');


        // Set Server Routes

        // Index / Home Page
        app.get('/', function(req, res){
          res.render('index', {user: req.user});
        });

        // Login Page
        app.get('/login', function(req, res){
          res.render('login');
        });

        app.post(
          '/login',
          passport.authenticate(
            'local',
            { successRedirect: '/',
              failureRedirect: '/login',
              failureFlash: true }
          )
        );

      }
    });
  }
});
