require('dotenv').config();
var express = require("express");

var server;
server = express();
server.use('/static', express.static(__dirname+'/static'));
server.use('/', require('./middleware/auth'));
server.use('/', require('./middleware/login'));
server.use('/', require('./middleware/users'));
module.exports = server;