'use strict';
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.status(200).send('This action retrieves all wiki pages.');
	// res.render('index', {});
});

router.post('/', function(req, res, next) {
	res.status(201).send('New page submitted');
});

router.get('/add', function(req, res, next) {
	res.status(200).send('Add a page');
});

module.exports = router; 