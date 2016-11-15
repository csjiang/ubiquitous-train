'use strict';

const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const wikiRouter = require('./routes/wiki');
const authorRouter = require('./routes/authors');
const models = require('./models');

//templating setup
const env = nunjucks.configure('views', {noCache: true});
const AutoEscapeExtension = require('nunjucks-autoescape')(nunjucks);
env.addExtension('AutoEscapeExtension', new AutoEscapeExtension(env));
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

//homepage
app.get('/', function(req, res, next) {
	models.Page.findAll({})
	.then(function(foundPages) {
		res.render('index', {
			pages: foundPages
		});
	})
	.catch(next)
});

//about page
app.get('/about', function(req, res, next) {
	res.render('about');
});

//modular routing
app.use('/wiki', wikiRouter);
app.use('/users', authorRouter);

//this error handler is currently never reached
app.use('/', function(err, req, res, next) {
	if(err) {
		var err = new Error('Error occurred; please try again.');
		res.render('error', {
			error: err, 
			message: err.message
		});
	}
});

