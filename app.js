'use strict';

var express = require('express');
var app = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');
var nunjucks = require('nunjucks');
var router = require('./routes')

//templating setup 
var env = nunjucks.configure('views', {noCache: true});
app.set('view engine', 'html'); //allows res.render to work w html files
app.engine('html', nunjucks.render); //res.render uses nunjucks to render html 

//logging middleware
app.use(morgan('tiny'));

//body parsing middleware
app.use(bodyParser.urlencoded({extended: true})); //handles HTML form submissions
app.use(bodyParser.json()); //handles HTML requests

//starts the server
app.listen(3000, function() {
	console.log('Server listening on port 3000');
});

//static middleware
app.use(express.static('/public'));

//modular routing 
app.use('/', router)



