var express = require("express");

var server;
server = express();
server.use('/static', express.static(__dirname+'/static'));

server.get('/test', function(inReq, inRes){
    inRes.send("works");
})

module.exports = server;