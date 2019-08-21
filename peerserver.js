var http = require('http');
var createError = require('http-errors');
var express = require('express');
var ExpressPeerServer = require('peer').ExpressPeerServer;

var port = '8080';
var app = express();
app.set('port', port);
var server = http.createServer(app);
server.listen(port);
var optionsForPeerjs = {
    debug: true
  } 
const peerserver = ExpressPeerServer(server, optionsForPeerjs);

peerserver.on('connection', (client) => { 
    console.log("peer client : ",client)
  });


app.use('/peerjs', peerserver);
app.use(function(req, res, next) {
    next(createError(404));
  });

