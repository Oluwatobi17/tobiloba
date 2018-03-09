var express = require('express');
var router = express.Router();

var multer = require('multer');

var Item = require('../models/items');
var Recipe = require('../models/recipes');
var User = require('../models/users');

/*var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
*/
/* GET the admin home page */
router.get('/', function(req, res, next) {
	Item.find({}, function(err, items){
		res.render('Admin/index', {
			title: 'DacRecipe: Shoping cart items',
			items: items,
			section: 'admin'
		});
	}).sort({date: -1});
});

/* GET site's recipes */
router.get('/recipes', function(req, res, next) {
	Recipe.find({}, function(err, recipes){
		res.render('Admin/recipes', {
			title: 'DacRecipe: Shoping cart recipes',
			recipes: recipes,
			section: 'admin'
		});
	}).sort({date: -1});
});

/* GET site's users */
router.get('/users', function(req, res, next) {
	User.find({}, function(err, users){
		res.render('Admin/users', {
			title: 'DacRecipe: Shoping cart users',
			users: users,
			section: 'admin'
		});
	});
});

/* GET a form to add item with /admin/addItem */
var shopImage = null;
router.post('/addItem', function(req, res, next) {
	var storage = multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, 'public/images/ItemImage/')
		},
		filename: function (req, file, cb) {
			shopImage = file.fieldname + '-' + Date.now()+ '.jpg';
			cb(null, shopImage);
		}
	});
	var upload = multer({ storage: storage }).single('goodsImage');

	upload(req, res, function (err) {
		if (err) {
			console.log(err);
    	}else{
			var brandname = req.body.brandname;
			var description = req.body.description;
			var price = req.body.price;
			var expireDate = req.body.expireDate;
			var date = new Date();

			/*req.checkBody('title','Title field is required').notEmpty();
			req.checkBody('ingredient','Ingredient field is required').notEmpty();
			req.checkBody('description','Description field is required').notEmpty();
			req.checkBody('time','Duration of this recipe is required').notEmpty();*/
		  
			var errors = req.validationErrors();

			if(errors){
				res.render('Admin/index', {
			  		errors: errors
		  		});
		  		console.log('Error is '+errors);
			}else{
				var newItem = new Item({
					brandname: brandname,
					price: price,
			  		description: description,
			  		goodsImage: shopImage,
			  		expireDate: expireDate,
			  		date: date
				});
			  	
			  	Item.saveItem(newItem, function(err){
			  		if(err) throw err;
			  	});
				res.redirect('/admin');
			}
    	}
	});
});

/* Edit an item using a POST request '/admin/item/edit/#{item._id}' */
var goods = null;
router.post('/item/edit/:id', function(req, res, next) {
	var storage = multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, 'public/images/ItemImage/')
		},
		filename: function (req, file, cb) {
			goods = file.fieldname + '-' + Date.now()+ '.jpg';
			cb(null, goods);
		}
	});
	var upload = multer({ storage: storage }).single('goodsImage');

	upload(req, res, function (err) {
		if (err) {
			console.log(err);
    	}else{
			var brandname = req.body.brandname;
			var description = req.body.description;
			var price = req.body.price;
			var expireDate = req.body.expireDate;
			var date = new Date();
		  
			var updateItem = {
				brandname: brandname,
				price: price,
		  		description: description,
		  		goodsImage: goods,
		  		expireDate: expireDate,
		  		date: date
			};
		  	
		  	Item.update({_id: req.params.id},{
		  		$set: updateItem
		  	}, function(err, success){
		  		if(err){
		  			throw err
		  		}else{
		  			res.redirect('/admin');
		  		}
		  	});
    	}
	});
});

/* Edit an item using a POST request '/admin/recipe/edit/#{item._id}' */
var recImage = null;
router.post('/recipe/edit/:id', function(req, res, next) {
	var storage = multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, 'public/images/RecipeImage/')
		},
		filename: function (req, file, cb) {
			recImage = file.fieldname + '-' + Date.now()+ '.jpg';
			cb(null, recImage);
		}
	});
	var upload = multer({ storage: storage }).single('itemImage');

	upload(req, res, function (err) {
		if (err) {
			console.log(err);
    	}else{
			var date = new Date();
		 
			var updateRecipe = {
				title: req.body.title,
				ingredient: req.body.ingredient,
		  		description: req.body.description,
		  		time: req.body.time,
		  		itemImage: recImage,
		  		date: date
			};
		  	
		  	Recipe.update({_id: req.params.id},{
		  		$set: updateRecipe
		  	}, function(err, success){
		  		if(err){
		  			throw err
		  		}else{
		  			res.redirect('/admin/recipes');
		  		}
		  	});
    	}
	});
});

/* Removing a user using GET '/admin/item/remove/#{item._id}' */
router.get('/item/remove/:id', function(req, res, next){
	Item.remove({_id: req.params.id}, function(err){
		res.redirect('/admin');
	});
});

/* Removing a user using GET '/admin/recipe/remove/#{recipe._id}' */
router.get('/recipe/remove/:id', function(req, res, next){
	Recipe.remove({_id: req.params.id}, function(err){
		res.redirect('/admin/recipes');
	});
});

/* Removing a user using GET '/admin/user/remove/#{user._id}' */
router.get('/user/remove/:id', function(req, res, next){
	User.remove({_id: req.params.id}, function(err){
		res.redirect('/admin/users');
	});
});

/*passport.serializeUser(function(user , done){
	done(null, user.id);
});

passport.deserializeUser(function(id , done){
	User.getUserById(id, function(err, user){
		done(err, user);
	});
});

passport.use('recipe-members', new LocalStrategy(
	function(username, password, done){
		User.checkUserByUsername(username, function(err, user){
			if(err) throw err;
			if(!user){
				return done(null, false, {message: 'Unknown user trying'});
			}
			User.comparePassword(password, user.password, function(err, isMatch){
				if(err) throw err; 
				if(isMatch){
					return done(null, user);
				}else{
					return done(null, false, {message:'Invalid password'});
				}
			});
		});
	}
));

router.post('/login', passport.authenticate('recipe-members', {failureRedirect:'/'}), function(req, res){
	//req.flash('success', 'You are now logged in');
	res.redirect('/recipes');
});

router.post('/register', function(req, res, next) {
	var fullname = req.body.fullname;
	var username = req.body.username;
	var email = req.body.email;
	var password = req.body.password;
	var password2 = req.body.password2;

	if(req.files.profileimage!=null){
		var profileimage = req.files.profileimage;
	}else{
		var profileimage = 'no_image.jpg';
	}

	req.checkBody('fullname','Name field is required').notEmpty();
	req.checkBody('username','Username field is required').notEmpty();
	req.checkBody('email','Email field is required').notEmpty();
	req.checkBody('password','Password field is required').notEmpty();
	req.checkBody('password2','Password does not match').equals(req.body.password);
	req.checkBody('email','Email given is invalid').isEmail();
  
	var errors = req.validationErrors();

	if(errors){
		res.render('index', {
	  		errors: errors,
	  		fullname: fullname,
	  		username: username,
	  		email: email,
	  		password: password,
	  		password2: password2
  		
  		});
	}else{
		var newUser = new User({
			fullname: fullname,
			username: username,
	  		email: email,
	  		password: password
		});
	  	
	  	User.createUser(newUser, function(err, user){
	  		if(err) throw err;
	  	});

		req.flash('success', 'You are now registered');
		res.redirect('/');
  }
  	
}); 

/* Login the current user out */
/*router.get('/logout',function(req, res){
	req.logout();
	res.redirect('/');
});*/

module.exports = router;
