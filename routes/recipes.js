var express = require('express');
var router = express.Router();
var multer = require('multer');

var Recipe = require('../models/recipes');

/* GET all recipes. */
router.get('/', function(req, res, next) {
	Recipe.find({}, function(err, recipes){
		res.render('Recipe/recipes', {
			title: 'DacRecipe: List of recipes',
			recipes: recipes
		}).sort({date: -1});
	});
});

/* GET recipes of a given name */
router.post('/search', function(req, res, next) {
	Recipe.find({title: req.body.title}, function(err, recipe){
		res.render('Recipe/searchTitle', {
			title: 'DacRecipe: List of recipes',
			recipeInfo: recipe,
			search: req.body.title
		});
	});
});

/* POST new recipes with /recipes/addRecipe */
var image = null;
router.post('/addRecipe', function(req, res, next) {
	var storage = multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, 'public/images/RecipeImage/')
		},
		filename: function (req, file, cb) {
			image = file.fieldname + '-' + Date.now()+ '.jpg';
			cb(null, image);
		}
	});
	var upload = multer({ storage: storage }).single('itemImage');

	upload(req, res, function (err) {
		if (err) {
			console.log(err);
    	}else{
    		//var author = req.body.author;
			var title = req.body.title;
			var ingredient = req.body.ingredient;
			var description = req.body.description;
			var time = req.body.time;
			var date = new Date();

			req.checkBody('title','Title field is required').notEmpty();
			req.checkBody('ingredient','Ingredient field is required').notEmpty();
			req.checkBody('description','Description field is required').notEmpty();
			req.checkBody('time','Duration of this recipe is required').notEmpty();
		  
			var errors = req.validationErrors();

			if(errors){
				res.render('Recipe/addRecipe', {
			  		errors: errors
		  		});
		  		console.log('Error is '+errors);
			}else{
				var newRecipe = new Recipe({
					title: title,
					ingredient: ingredient,
			  		description: description,
			  		itemImage: image,
			  		time: time,
			  		date: date
				});
			  	
			  	Recipe.saveRecipe(newRecipe, function(err, user){
			  		if(err) throw err;
			  	});
				res.redirect('/recipes');
			}
    	}
	});
});

module.exports = router;
