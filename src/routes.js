var express = require("express");
var http = require('http');
var app = express();
var router = express.Router();
var path = require('path');
var request = require('request');
var renders = require("./utils/filesUpload.js");

module.exports = router;

router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/../public/index.html'));
});

router.get('/callback', function (req, res) {
    res.sendFile(path.join(__dirname + '/../public/index.html'));
});

router.get('/profile', function (req, res) {
    res.sendFile(path.join(__dirname + '/../public/index.html'));
});

router.get("/render", function (req, res) {
    var ctrl = req.query.ctrl;
    var model = req.query.model;
    var view = req.query.view;

    if (!ctrl || !view || !model) {
        res.send("<html>" +
            "</html>");
    } else {

        function getData(callback) {
            request.get(ctrl, function (err, response, body) {
                callback(body);
            });
        }
        getData(function (body) {
            res.send("<html ng-app='renderApp'>\n" +
                "<head>\n" +
                "<title>ARenderizer</title>\n" +
                "<link rel='stylesheet' href='bower_components/bootstrap/dist/css/bootstrap.min.css'>\n" +
                "<script type='text/javascript' src='bower_components/jquery/dist/jquery.min.js'></script>\n" +
                "<script src='bower_components/bootstrap/dist/js/bootstrap.min.js'></script>\n" +
                "<script type='text/javascript' src='bower_components/angular/angular.js'></script>\n" +
                "<script type='text/javascript' src='bower_components/angular-route/angular-route.js'></script>\n" +
                "<script type='text/javascript' src='bower_components/angular-ui-router/release/angular-ui-router.js'></script>\n" +
                "<script type='text/javascript' src='bower_components/angular-route/angular-route.min.js'></script>\n" +
                "<script type='text/javascript' src='bower_components/angular-sanitize/angular-sanitize.min.js'></script>\n" +
                "<script>\n" +
                "document.addEventListener('DOMContentLoaded', function () {" +
                "console.log('preloader working');" +
                "setTimeout(function () {" +
                "$('#preloader').fadeOut();" +
                "$('.preloader_img').delay(150).fadeOut('slow');" +
                "}, 1000);" +
                "});" +
                "</script>\n" +
                "<style>" +
                ".preloader_img { position: fixed; left: 0px; top: 0px; width: 100%; height: 100%; z-index: 9999; background-image: url(../img/loading1_big_lgbg.gif); background-repeat: no-repeat; background-color: #fff; background-position: center; background-size: 40px 40px; }" +
                "</style>" +
                "</head>\n" +
                "<body class='container' ng-controller='renderController'>" +
                "<div id='preloader'><div class='preloader_img'></div></div>" +
                "<div id='my-element'></div>\n\r" +
                "<script type='text/javascript'>" +
                "'use strict';\n\r" +
                "angular.module('renderApp', [\n" +
                "'ui.router',\n" +
                "'ngSanitize'\n" +
                "]);\n\r " +
                "angular.module('renderApp').config(['$sceDelegateProvider',\n" +
                "function ($sceDelegateProvider) {\n\r" +
                "$sceDelegateProvider.resourceUrlWhitelist(['**']);\n\r" +
                "console.log('App Initialized');\r\n" +
                "}]);\n\r" +
                "angular.module('renderApp').directive('contenteditable', function () {\n" +
                "return {\n" +
                "require: 'ngModel',\n" +
                "link: function (scope, element, attrs, ctrl) {\n" +
                "element.bind('blur', function () {\n" +
                "scope.$apply(function () {\n" +
                "ctrl.$setViewValue(element.html());\n" +
                "});\n" +
                "});\n" +
                "ctrl.$render = function () {\n" +
                "element.html(ctrl.$viewValue);\n" +
                "};\n" +
                "ctrl.$render();\n" +
                "}\n" +
                "};\n" +
                "});\n\r" +
                "angular.module('renderApp').controller('renderController',function($scope, $http, $state, $stateParams, $templateRequest, $sce, $compile, $q){\n\r" +
                "console.log('Render Controller Initialized');\n\r" +
                "function json() {\n" +
                "   return $http.get('" + model + "');\n" +
                "}\n\r" +
                "var templateUrl = $sce.getTrustedResourceUrl('" + view + "');\n" +
                "$templateRequest(templateUrl).then(function (template) {\n" +
                "$compile($('#my-element').html(template).contents())($scope);\n" +
                "}, function () {\n\r" +
                "});\n\r" +
                "$q((resolve, reject) => {\n" +
                "   json().then((data) => {\n" +
                "       $scope.model = data.data;\n" +
                body +
                "});\n\r" +
                "\n\r" +
                "});\n\r" +
                "});" +
                "</script>" +
                "</body>" +
                "</html>");
        });
    }
});