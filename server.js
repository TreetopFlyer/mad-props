require('dotenv').config();
var express = require("express");
var handlebars = require("express-handlebars");
var bodyParser = require("body-parser");
var server;
server = express();
server.engine("handlebars", handlebars())
server.set("view engine", "handlebars");
server.use('/static', express.static(__dirname+'/static'));
server.use('/', bodyParser.json());
server.use('/', require('./middleware/auth'));
server.use('/', require('./middleware/login'));
server.use('/', require('./middleware/users'));
module.exports = server;