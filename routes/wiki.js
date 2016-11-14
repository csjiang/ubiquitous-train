'use strict';
var express = require('express');
var router = express.Router();
var models = require('../models');
var Page = models.Page;
var User = models.User;

router.get('/', function(req, res, next) {
	Page.findAll({})
	.then(function(foundPages) {
		res.render('index', {pages: foundPages});
	})
	.catch(next)
});

router.get('/add', function(req, res, next) {
	res.render('addpage');
});

router.post('/', function(req, res, next) {
	var user = User.findOrCreate({
		where: {
			name: req.body.authorname,
			email: req.body.authoremail
		}
	})
	user
		.spread(function(resultCreated, created) {
			var user = resultCreated;

			var page = Page.build({
				title: req.body.title,
				content: req.body.content
			});

			return page.save()
			.then(function (page){
				return page.setAuthor(user);
			});
		})
		.then(function(page) {
			res.redirect(page.route);
		})
		.catch(next);
});

router.get('/:urlTitle', function(req, res, next) {
	Page.findOne({
		where: {
			urlTitle: req.params.urlTitle
		}
	})
	.then(function(foundPage) {
		res.render('wikipage', {page: foundPage});
	})
	.catch(next);
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
