function Authentication(mdb){
  var usersDB = "usersAuthExample";

  // callback for when username is tested to create new user
  this.createUser = function(username,password,req,res,usernameMatches){
    if(usernameMatches.length > 0){
      res.json({
        'success' : false,
        'message' : "username has already been taken"
      });
    }
    else{
      var data = {'username' : username, 'password' : password}
      var collection = mdb.collection(usersDB);
      collection.insert(data,function(err, ids){});
      res.json({
        'success' : true,
        'message' : 'account successfully created'
      });
    }
  }

  //callback for when username is tested to login new user
  this.loginUser = function(username,password,req,res,usernameMatches){
    if(usernameMatches.length > 0){ // something matched username
      if(password === usernameMatches[0].password){ // passwords match
        req.session.user = username;
        /*
        var redirectLoc = req.session.originalPath;
        if(redirectLoc){
          res.redirect(redirectLoc);
          delete req.session.originalPath;
          req.session.originalPath = null;
        }

        else{ // good login
        */
          res.json({
            'success' : true,
            'message' : 'successfully logged in',
            'username' : username
          });
        /*} */
      }
      else{ // bad pw
        res.json({
          'success' : false,
          'message' : 'incorrect password',
        });
      }
    }
    else{ // bad username
      res.json({
        'success' : false,
        'message' : 'no records match this username'
      });
    }
  }

  // tests for username existence in DB
  this.testUsername = function(username,password,req,res,callback){
    if (!username || !password) {
      res.json({
        'success' : false,
        'message' : "no username or password"
      });
    }
    else{
      var collection = mdb.collection(usersDB);
      collection.find({'username' : username}).toArray(function(err,matchingNames){
        callback(username,password,req,res,matchingNames);
      });
    }
  }

  // checks if user is currently in session data and logged in
  this.authTest = function(req, res, next) {
    //req.session.originalPath = req.path;             //set path to redirect to if need to login
    var collection = mdb.collection(usersDB);
    if(req.session && req.session.user){
      collection.findOne({'username' : req.session.user},function(err,user){
        if(err){
          res.json({
            'success' : false,
            'message' : 'you must login before accessing this page'
          });
        }
        next(); // if all authenticated, move on
      });
    }
    else{
      res.json({
        'success' : false,
        'message' : 'you must login before accessing this page'
      });
    }
  };
}

module.exports.auth = Authentication;
