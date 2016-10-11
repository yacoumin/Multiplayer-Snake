// Javascript class that handles User data

var userCollection = "Users";

function User(mongoDB) {
  this.db = mongoDB;
  this.username = null;
  this.password = null;
}

User.prototype.isValidPassword(password) {
  return this.password == password;
}

User.prototype.setUserFromDoc = function(userDoc) {
  this.username = userDoc.username;
  this.password = userDoc.password;
};


// get the user information from the database given a username
// if the user is not found, null will be passed to the callback.
// callback = function(user)
User.prototype.getUser = function(username, callback) {
  var userFilter = { "username" : username };
  var userDoc = this.db.collections(userCollection).findOne(userFilter);
  if (userDoc != null) {
    this.setUserFromDoc(userDoc);
    callback(this);
  }
  else {
    callback(null);
  }
};
