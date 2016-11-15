'use strict';
var express = require('express');
var router = express.Router();
var models = require('../models');
var Page = models.Page;
var User = models.User;


router.get('/', function(req, res, next) {
	User.findAll({})
	.then(function(foundUsers) {
		res.render('authors', {
			authors: foundUsers
		});
	})
	.catch(next)
});

router.get('/:id', function(req, res, next) {
	User.findById(req.params.id)
	.then(function(foundUser) {
		Page.findAll({
			where: {
				authorId: foundUser.id
			}
		})
		.then(function(foundArticles) {
			res.render('one_author', {
			pages: foundArticles, 
			author: foundUser
			});
		})
	})
	.catch(next)
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