var express = require('express');
var db = require('../models');
var passport = require('../config/ppConfig');
var router = express.Router();

router.get('/facebook', passport.authenticate('facebook', {
  scope: ['public_profile', 'email','user_posts']
}));

router.get('/callback/facebook', passport.authenticate('facebook', {
  successRedirect: '/post/results',
  failureRedirect: '/',
  failureFlash: 'An error occurred, try again',
  successFlash: 'You logged in with Facebook!'
}));

router.get('/logout', function(req, res) {
  req.logout();
  req.flash('success', 'You have logged out');
  res.redirect('/');
});

module.exports = router;
