var express = require('express');
//var httpsRedirect = require('express-https-redirect');
var fs = require('fs');
var http = require('http');
var https = require('https');

var ssl_options = {
  key: fs.readFileSync('ssl/private.key'),
  cert: fs.readFileSync('ssl/certificate.crt'),
  ca: fs.readFileSync('ssl/ca_bundle.crt')
};

var app = express();

var secureServer = https.createServer(ssl_options, app);
var server = http.createServer(app);

app.get('*', function (req, res, next) { // redirect http to https
  !req.secure ? res.redirect('https://plasmoxy.openode.io' + req.url) : next();
})

// ---

var count = 0;

app.get('/', function (req, res, next) {
  var a = Number(req.query.a);
  if (isNaN(a)) a=0;
  var b = Number(req.query.b);
  if (isNaN(b)) b=0;
  res.send('' + a + ' + ' + b + ' = ' + (a+b));
})

app.get('/count', function (req, res, next) {
  count++;
  res.send('count = ' + count);
})


// ---

secureServer.listen(443)
server.listen(80)

console.log('[server.js] Listening for http and https')
