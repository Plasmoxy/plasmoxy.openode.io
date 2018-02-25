var express = require('express');
var fs = require('fs');
var http = require('http');
var https = require('https');

var logString = '';

var ssl_options = {
  key: fs.readFileSync('ssl/private.key'),
  cert: fs.readFileSync('ssl/certificate.crt'),
  ca: fs.readFileSync('ssl/ca_bundle.crt')
};

function log(text) {
  logString += '[' + new Date().toLocaleString() + '] ' + text + '<br>';
}


// --- INITIALIZE ---

var app = express();
var server = https.createServer(ssl_options, app);
var insecureServer = http.createServer(app);

var io = require('socket.io').listen(server);

// --- EXPRESS INIT ---

// redirect to https, TODO: PROTECT THIS AGAINST MITM
app.get('*', function (req, res, next) {
  !req.secure ? res.redirect('https://plasmoxy.openode.io' + req.url) : next();
})

app.use('/assets', express.static('assets'));

// --- CUSTOM  ---


// --- SOCKETS ---

io.sockets.on('connection', function(client){
  var clientIp = client.request.connection.remoteAddress;
  client.on('chat message', function(msg){ // chat evente
    io.emit('chat message', '{ ' + clientIp + ' } ' + msg);
  });
});


// --- ROUTING ---

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
})

app.get('/chat', function (req,res) {
  res.sendFile(__dirname + '/chat.html');
})

app.get('/localchat', function (req,res) {
  res.sendFile(__dirname + '/localchat.html');
})

app.get('/log', function (req, res) {
  res.send(logString);
})


// --- START ---

server.listen(443)
insecureServer.listen(80)

console.log('[server.js] Listening for http and https')
