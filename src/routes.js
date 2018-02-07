var express = require("express");
var app = express();
var router = express.Router();
var path = require('path');
var renders = require("./utils/filesUpload.js");

module.exports = router;

router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/../public/index.html'));
});

router.get('/callback', function (req, res) {
    res.sendFile(path.join(__dirname + '/../public/index.html'));
});

router.post("/uploadFiles",renders.postFiles);
router.delete("/deleteFiles/:id",renders.deleteFiles);