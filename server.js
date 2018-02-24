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
var secureServer = https.createServer(ssl_options, app);
var server = http.createServer(app);

var io = require('socket.io')(secureServer);

// --- EXPRESS INIT ---

// redirect to https
app.get('*', function (req, res, next) {
  !req.secure ? res.redirect('https://plasmoxy.openode.io' + req.url) : next();
})

app.use('/assets', express.static('assets'));

// --- CUSTOM  ---
var count = 0;

// --- SOCKETS ---

io.on('connection', function(client){
  log('' + client.handshake.address + 'connected');
  console.log('' + client.handshake.address + 'con');
  client.on('event', function(data){
    log('data');
  });
  client.on('disconnect', function(){});
});

// --- ROUTING ---

app.get('/', function (req, res, next) {
  res.sendFile(__dirname + '/index.html');
})

app.get('/log', function (req, res, next) {
  res.send(logString);
})


// --- START ---

secureServer.listen(443)
server.listen(80)

console.log('[server.js] Listening for http and https')
