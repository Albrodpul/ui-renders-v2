var express = require("express");
var app = express();
var router = express.Router();
var path = require('path');

module.exports = router;

router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/../public/index.html'));
});

router.get('/callback', function (req, res) {
    res.sendFile(path.join(__dirname + '/../public/index.html'));
});