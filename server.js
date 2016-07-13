require('dotenv').config();

var express = require("express");
var bodyParser = require("body-parser");

var server;
server = express();
server.use('/static', express.static(__dirname+'/static'));
server.use('/', bodyParser.json());

server.use('/', require('./middleware/cors'));
server.use('/', require('./middleware/auth'));

server.use('/', require('./routes/auth'));
server.use('/', require('./routes/admin'));
server.use('/', require('./routes/user'));
server.use('/', require('./routes/contests'));

module.exports = server;