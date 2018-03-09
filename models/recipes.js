var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/DacRecipe');

// recipe schema
var recipeSchema = mongoose.Schema({
	/*author : {
		type: String,
		index: true
	},*/
	title: {
		type: String,
		require: true
	},
	ingredient: {
		type: String,
		require: true
	},
	description:{
		type: String,
		require: true
	},
	itemImage: {
		type: String,
		require: true
	},
	time: {
		type: String,
		require: true
	},
	date:{
		type: Date,
		default: Date.now
	}/*,
	comments : [{
		author: String,
		body: String,
		date: String
	}],
	Likes: [{
		author: String
	}],*/

});

var Recipe  = module.exports = mongoose.model('recipes',recipeSchema, 'recipes');
module.exports.saveRecipe = function(recipe, callback){
	recipe.save(callback);
}