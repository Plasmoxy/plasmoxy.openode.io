var express = require('express');
var fs = require('fx');
var https = require('https');
var http = require('http');
var forceSsl = require('express-force-ssl');

var app = express();
app.use(forceSsl);

var options = {
  key: fs.readFileSync('ssl/private.key'),
  cert: fs.readFileSync('ssl/primary.crt'),
  ca: fs.readFileSync('ssl/ca_bundle.crt')
};

https.createServer(options, app).listen(443);
http.createServer(app).listen(80);
