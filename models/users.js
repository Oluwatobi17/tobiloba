var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

mongoose.connect('mongodb://localhost/DacRecipe');

var UserSchema = mongoose.Schema({
	fullname : {
		type: String,
		index: true
	},
	username: {
		type: String
	},
	email: {
		type: String,
		unique: true
	},
	password : {
		type: String,
		required: true,
		bcrypt: true
	}
});


var User = module.exports = mongoose.model('users',UserSchema, 'users');

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch){
		if(err) return callback(err);
		callback(null, isMatch);
	});
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}


module.exports.checkUserByUsername = function(username, callback){
	var query= {username: username};
	User.findOne(query, callback);
}

module.exports.createUser = function(newUser, callback){
	bcrypt.hash(newUser.password, 10, function(err, hash){
		if(err) throw err;

		newUser.password = hash;
		newUser.save(callback);
	});
	
}