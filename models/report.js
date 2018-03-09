var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

mongoose.connect('mongodb://localhost/DacRecipe');

var reportSchema = mongoose.Schema({
	firstname : {
		type: String,
		index: true,
		required: true
	},
	lastname: {
		type: String,
		index: true,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	report : {
		type: String,
		required: true
	}
});

// This is the model
var Report = module.exports = mongoose.model('reports',reportSchema, 'reports');

module.exports.createReport = function(newReport, callback){
	newReport.save(callback);
}