var express = require('express');
var router = express.Router();

var a = 0;

router.get('/', function (req, res) {
	return res.send(a);
});

router.get('/plus', function(req, res) {
	a += 0;
	return res.send(a);
});

router.get('/minus', function(req, res) {
	a -= 0;
	return res.send(a);
});

module.exports = router;
