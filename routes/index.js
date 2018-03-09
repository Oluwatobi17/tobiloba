var express = require('express');
var router = express.Router();

var User = require('../models/users');
var Report = require('../models/report');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

/* GET the login page */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

passport.serializeUser(function(user , done){
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

	/*if(req.files.profileimage!=null){
		var profileimage = req.files.profileimage;
	}else{
		var profileimage = 'no_image.jpg';
	}*/

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
router.get('/logout',function(req, res){
	req.logout();
	res.redirect('/');
});

/* GET a report form */
router.get('/report', function(req, res, next) {
	res.render('report', { title: 'DacRecipe: Lay your reports' });
});

/* POST a report from the client */
router.post('/report', function(req, res, next) {
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var email = req.body.email;
	var report = req.body.report;
	var date = new Date();

	/*req.checkBody('title','Title field is required').notEmpty();
	req.checkBody('ingredient','Ingredient field is required').notEmpty();
	req.checkBody('description','Description field is required').notEmpty();
	req.checkBody('time','Duration of this recipe is required').notEmpty();*/
  
	var errors = req.validationErrors();

	if(errors){
		res.render('report',{
	  		errors: errors
  		});
	}else{
		var newReport = new Report({
			firstname: firstname,
			lastname: lastname,
	  		email: email,
	  		report: report,
	  		date: date
		});
	  	
	  	Report.createReport(newReport, function(err, user){
	  		if(err) throw err;
	  	});
		res.redirect('/recipes');
	}
    
});

/* GET the about page */
router.get('/about', function(req, res, next) {
	res.render('about', { title: 'DacRecipe: About DacRecipe startup' });
});

module.exports = router;
