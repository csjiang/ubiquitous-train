'use strict';
var express = require('express');
var router = express.Router();
var models = require('../models');
var Page = models.Page;
var User = models.User;

router.get('/', function(req, res, next) {
	Page.findAll({})
	.then(function(foundPages) {
		if (req.query.deleted == true) {
			res.render('index', {
			pages: foundPages, 
			deleteSuccess: true
			});
		} else {
			res.render('index', {
			pages: foundPages
			});
		}
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
				content: req.body.content,
				tags: req.body.tags.split(' ')
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

router.get('/search', function(req, res, next) {
	if (Object.keys(req.query).length > 0) {
		return Page.findByTag(req.query.tagsearch.split())
		.then(function(pageMatch) {
			res.render('search', {
				pages: pageMatch
			})
		})
	} else {
		res.render('search')
	}
});

router.get('/:urlTitle/similar', function(req, res, next) {
	Page.findOne({
		where: {
			urlTitle: req.params.urlTitle
		}
	}).then(function(thisPage) {
		return thisPage.findSimilar()
	}).then(function(similarPages) {
		res.render('index', {
			pages: similarPages
		});
	})
});

router.get('/:urlTitle/delete', function(req, res, next) {
	Page.findOne({
		where: {
			urlTitle: req.params.urlTitle
		}
	}).then(function(thisPage) {
		return thisPage.destroy();
	}).then(function() {
		res.redirect('/?deleted=true');
		});
	});

router.get('/:urlTitle', function(req, res, next) {
	Page.findOne({
		where: {
			urlTitle: req.params.urlTitle
		}
	})
	.then(function(foundPage) {
		return User.findOne({
			where: {
				id: foundPage.authorId
			}
		})
		.then(function(foundUser) {
			res.render('wikipage', {
				page: foundPage, 
				user: foundUser, 
				tags: foundPage.tags});
		})
	})
	.catch(next);
});

router.use('/', function(err, req, res, next) {
	if(err) {
		var err = new Error('Error occurred; please try again.');
		res.render('error', {
			error: err, 
			message: err.message
		});
	}
});

module.exports = router;
