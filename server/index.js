var express = require('express');

var app = express();
var http = require('http');

// Bootstrap application settings
require('./config/express')(app);

// Bootstrap routes
require('./config/routes')(app);

var server = http.createServer(app).listen(app.get('port'));

// socket init
var environment = require('./config/environment.js');
var io = environment.loadSocketIo(server);

environment.authorize(io);
