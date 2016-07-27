var server = require('./server.js');
var fs = require('fs');
var https = require('https');
var http = require('http');

var port = process.env.PORT || 80;

if(process.env.HTTPS === 'true')
{
    var options = {
        key  : fs.readFileSync('ssl.key'),
        cert : fs.readFileSync('ssl.crt')
    };
    https.createServer(options, server).listen(port, function (){
        console.log('Started in HTTPS mode');
    });
}
else
{
    http.createServer(server).listen(port, function (){
        console.log('Started in plain HTTP mode');
    });
}