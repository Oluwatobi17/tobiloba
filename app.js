var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var moment = require('moment');
var multer = require('multer');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var db = mongoose.connection;

var index = require('./routes/index');
var recipes = require('./routes/recipes');
var shop = require('./routes/shop');
var admin = require('./routes/admin');

var app = express();

app.locals.moment = require('moment');
app.locals.cart = cart || '';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// express-session
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

//passport session
app.use(passport.initialize());
app.use(passport.session());

//express messages and connect flash
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

/* Authentication for blog users */
app.get('*',function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

//Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value){
    var namespace = param.split('.')
    , root = namespace.shift()
    , formParam = root;

    while(namespace.length){
      formParam += '['+namespace.shift()+']';
    }
    return{
      param: formParam,
      msg : msg,
      value: value
    };
  }
}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/recipes', recipes);
app.use('/shop', shop);
app.use('/admin', admin);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
