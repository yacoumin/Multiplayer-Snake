/*
var exports = module.exports = {};

exports.test = "hello";
var test2 = "bye";
exports.hello = function(){
  return test;
}

exports.bye = function(){
  return test2;
}
*/

module.exports = Test();

function Test(){
  this.test = "bla";
}



/*
// Require necessary libraries
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session);

var sessionStore = new MongoStore({
    db: db
});

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
*/
