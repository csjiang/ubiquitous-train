'use strict';

var express = require('express');
var app = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');
var nunjucks = require('nunjucks');
var wikiRouter = require('./routes/wiki');
var authorRouter = require('./routes/authors');
var models = require('./models');

//templating setup
var env = nunjucks.configure('views', {noCache: true});
app.set('view engine', 'html'); //allows res.render to work w html files
app.engine('html', nunjucks.render); //res.render uses nunjucks to render html

//logging middleware
app.use(morgan('tiny'));

//body parsing middleware
app.use(bodyParser.urlencoded({extended: true})); //handles HTML form submissions
app.use(bodyParser.json()); //handles HTML requests

models.User.sync({})
.then(function() {
	return models.Page.sync({});
})
.then(function() {
	//starts the server
	app.listen(1337, function() {
		console.log('Server listening on port 1337');
	});
})
.catch(console.error);

//static middleware
app.use(express.static('/public'));

app.get('/', function(req, res, next) {
	models.Page.findAll({})
	.then(function(foundPages) {
		res.render('index', {pages: foundPages});
	})
	.catch(next)
});

//modular routing
app.use('/wiki', wikiRouter);
app.use('/users', authorRouter);



