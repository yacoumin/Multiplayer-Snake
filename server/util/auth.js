/*-----------------------------------------------------------------------------
Authentication is a class designed to handle all of the user creation and
authentication logic.  It also sets session variables for users as they log in
-----------------------------------------------------------------------------*/
function Authentication(mdb){
  var usersDB = "users";

  // callback for when username is tested to create new user
  this.createUser = function(username,password,req,res,usernameMatches){
    if(usernameMatches.length > 0){
      //console.log("username taken");
      res.render('create_account',{'error' : 'Username has already been taken', 'success' : ''});
    }
    else{
      var data = {'username' : username, 'password' : password}
      //console.log(usersDB);
      var collection = mdb.collection(usersDB);
      collection.insert(data,function(err, ids){});
      req.session.user = username; // login upon account creation
      req.session.admin = true;
      //console.log("Message good, inserting");
      res.render('create_account',{'error' : '', 'success' : "Account successfully created"});
    }
  }

  //callback for when username is tested to login new user
  this.loginUser = function(username,password,req,res,usernameMatches){
    if(usernameMatches.length > 0){ // something matched username
      if(password === usernameMatches[0].password){ // passwords match
        //console.log("valid login");
        req.session.user = username;
        req.session.admin = true;
        var redirectLoc = req.session.originalPath;
        if(redirectLoc){
          res.redirect(redirectLoc);
          delete req.session.originalPath;
          req.session.originalPath = null;
        }
        else{
          res.render('login_account',{'error' : '', 'success' : "Successfully logged in"});
        }
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
  this.testUsername = function(username,password,req,res,callback){
    //console.log(usersDB);
    var collection = mdb.collection(usersDB);
    collection.find({'username' : username}).toArray(function(err,matchingNames){
      callback(username,password,req,res,matchingNames);
    });
  }

  // checks if user is currently in session data and logged in
  this.authTest = function(req, res, next) {
    //console.log(usersDB);
    req.session.originalPath = req.path;
    var collection = mdb.collection(usersDB);
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
}

module.exports.auth = Authentication;
