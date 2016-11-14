'use strict';
var express = require('express');
var router = express.Router();
var models = require('../models');
var Page = models.Page;
var User = models.User;

router.get('/', function(req, res, next) {
	res.send('hi');
});

router.post('/', function(req, res, next) {
	var page = Page.build({
		title: req.body.title,
		content: req.body.content
	});
	page.save()
	.then(function(result) {
		res.json(result);
	});
});

router.get('/add', function(req, res, next) {
	res.render('addpage');
});

// router.get('/users', function(req, res, next) {
// 	res.redirect('/');
// });

// router.get('/users/123', function(req, res, next) {
// 	res.redirect('/');
// });

// router.post('/users', function(req, res, next) {
// 	res.json(req.body);
// });

module.exports = router;
