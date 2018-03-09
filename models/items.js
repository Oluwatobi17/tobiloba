var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/DacRecipe');

// recipe schema
var itemSchema = mongoose.Schema({
	brandname: {
		type: String,
		require: true
	},
	price: {
		type: Number,
		require: true
	},
	expireDate:{
		type: String,
		require: true
	},
	goodsImage: {
		type: String,
		require: true
	},
	description: {
		type: String,
		require: true
	},
	date: Date
});

var Items  = module.exports = mongoose.model('items',itemSchema, 'items');
module.exports.saveItem = function(items, callback){
	items.save(callback);
}