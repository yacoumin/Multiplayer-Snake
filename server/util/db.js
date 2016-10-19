var MongoClient = require('mongodb').MongoClient;
var mongoURI = 'mongodb://ds021326.mlab.com:21326/';
//var mongoURI = 'mongodb://ec2-54-175-174-41.compute-1.amazonaws.com:443/' //the URI that works on the UMN network
var db_name = "game";
var db_user = "admin";
var db_pswd = "admin";

var database;

module.exports = {
  connect : function(callback){
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
            console.log("DB CONNECTED");
            database = db;
            callback();
          }
        });
      }
    });
  },
  getDB : function(){
    return database;
  }
};
