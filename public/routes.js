var express = require("express");
var http = require('http');
var app = express();
var router = express.Router();
var path = require('path');
var fs = require('fs');
var request = require('request');

module.exports = router;

router.get('/', function (req, res) {
    var modelPath = '/index/model.json';
    var viewPath = '/index/view.ng';
    var ctrlPath = '/index/ctrl.ctl';
    if (!fs.existsSync('./public' + modelPath)) {
        console.log("WARNING: " + modelPath + " don't exists, sending 404...");
        return res.sendStatus(404);
    } else if (!fs.existsSync('./public' + viewPath)) {
        console.log("WARNING: " + viewPath + " don't exists, sending 404...");
        return res.sendStatus(404);
    } else if (!fs.existsSync('./public' + ctrlPath)) {
        console.log("WARNING: " + ctrlPath + " don't exists, sending 404...");
        return res.sendStatus(404);
    } else {
        console.log("Redirecting...");
        res.redirect('/render?model=' + modelPath + '&view=' + viewPath + '&ctrl=' + ctrlPath);
    }
});

router.get("/render", function (req, res) {
    var ctrl = req.query.ctrl;
    var model = req.query.model;
    var view = req.query.view;
    var http = req.protocol;
    var host = req.headers.host;

    if (!ctrl || !view || !model) {
        res.sendStatus(404);
    } else {

        function getData(callback) {
            if (model.includes('/index') && view.includes('/index') && ctrl.includes('/index')) {
                var uri = http + '://' + host + ctrl;
                request.get(uri, function (err, response, body) {
                    callback(err,body);
                });
            } else if (model.includes('/renders') && view.includes('/renders') && ctrl.includes('/renders')) {
                if (!fs.existsSync('./public' + model)) {
                    console.log("WARNING: " + model + " don't exists, sending 404...");
                    return res.sendStatus(404);
                } else if (!fs.existsSync('./public' + view)) {
                    console.log("WARNING: " + view + " don't exists, sending 404...");
                    return res.sendStatus(404);
                } else if (!fs.existsSync('./public' + ctrl)) {
                    console.log("WARNING: " + ctrl + " don't exists, sending 404...");
                    return res.sendStatus(404);
                } else {
                    var uri = http + '://' + host + ctrl;
                    request.get(uri, function (err, response, body) {
                        callback(err,body);
                    });
                }
            } else {
                request.get(ctrl, function (err, response, body) {
                    callback(err, body);
                });
            }
        }
        getData(function (err, body) {
            if (!err && body) {
                res.send("<html ng-app='renderApp'>\n" +
                    "<head>\n" +
                    "<title>ARenderizer</title>\n" +
                    "<link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css' integrity='sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u' crossorigin='anonymous'>\n" +
                    "<script type='text/javascript' src='bower_components/jquery/dist/jquery.min.js'></script>\n" +
                    "<script src='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js' integrity='sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa' crossorigin='anonymous'></script>\n" +
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
                    ".preloader_img { position: fixed; left: 0px; top: 0px; width: 100%; height: 100%; z-index: 9999; background-image: url(./utils/img/loading1_big_lgbg.gif); background-repeat: no-repeat; background-color: #fff; background-position: center; background-size: 40px 40px; }" +
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
            } else if (err && !body) {
                res.sendStatus(404);
            }
        });
    }
});