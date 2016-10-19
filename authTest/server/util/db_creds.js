function DBCreds(){
  this.mongoURI = 'mongodb://ds021326.mlab.com:21326/';
  //var mongoURI = 'mongodb://ec2-54-175-174-41.compute-1.amazonaws.com:443/' //the URI that works on the UMN network
  this.db_name = "game";
  this.db_user = "admin";
  this.db_pswd = "admin";
}

module.exports.creds = DBCreds;
