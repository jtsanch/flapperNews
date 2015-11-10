var mongoose = require("mongoose");
var crypto   = require("crypto");
var jwt = require('express-jwt');
var auth = jwt({secret: 'DEV-SECRET', userProperty: 'payload'});

var UserSchema = new mongoose.Schema({
	email         : {type: String, lowercase:true, unique: true},
	name          : String,
	hash 		  : String,
	salt 		  : String  
});

UserSchema.methods.setPassword = function(password){
	this.salt = crypto.randomBytes(16).toString('hex');
	this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
}

UserSchema.methods.authenticate = function(password){
	var tempHash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');

	return tempHash === this.hash;
}

mongoose.model('User', UserSchema);