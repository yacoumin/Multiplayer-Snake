var MongoClient = require('mongodb').MongoClient;
var MongoCreds = require('./db_creds').creds;

var database;
var creds = new MongoCreds();

module.exports = {
  connect : function(callback){
    MongoClient.connect(creds.mongoURI + creds.db_name, function(err, db){
      if (err) {
        throw err;
      }
      else {
        db.authenticate(creds.db_user, creds.db_pswd, function(err, result) {
          if (err) {
            throw err;
          }
          else { //db good
            database = db;
            console.log("db connected");
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
