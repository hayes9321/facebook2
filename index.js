require('dotenv').config();
var express = require('express');
var ejsLayouts = require('express-ejs-layouts');
var path = require('path');
var bodyParser = require('body-parser');
var passport = require('./config/ppConfig');
var session = require('express-session');
var flash = require('connect-flash');
var isLoggedIn = require('./middleware/isLoggedIn');
var app = express();

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(ejsLayouts);
app.use('/public', express.static(path.join(__dirname, '/public/')));
app.use(session({
  secret: process.env.SESSION_SECRET || 'mysupercoolsecret',
  resave: false,
  saveUninitialized: true
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.alerts = req.flash();
  next();
});

app.get('/', function(req, res) {
  res.render('home');
});

app.get('/profile', isLoggedIn, function(req, res) {
  res.render('profile');
});

app.get("/termsandconditions", function(req, res) {
	var user = req.user;
	res.render("privacy_and_Tc", {user: user});
});

app.use('/post', require('./controllers/post'));
app.use('/auth', require('./controllers/auth'));

var server = app.listen(process.env.PORT || 3000);

module.exports = server;

