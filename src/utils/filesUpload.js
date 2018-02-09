var path = require('path');
var fs = require('fs');
var fsextra = require('fs-extra');
var shell = require('shelljs');
const fileUpload = require('express-fileupload');

module.exports = {
    postFiles: function (request, response, next) {
        var name = request.body.name;
        var apiURL;
        var uiURL;
        var hostname = request.get('host').split(':')[0];
        if (hostname == "localhost") {
            apiURL = 'http://localhost:8080/api/v1/renders';
            uiURL = 'http://localhost:8800/app/renders';
        } else {
            apiURL = "https://api-renders.herokuapp.com/api/v1/renders";
            uiURL = "https://ui-renders.herokuapp.com:50361/app/renders";
        }
        if (!name) {
            console.log("WARNING: Render name input must be fulfilled")
            return response.status(400);
        }
        var model = request.files.model;
        if (!model) {
            console.log("WARNING: No sample model json attached")
            return response.status(400);
        }
        var view = request.files.view;
        if (!view) {
            console.log("WARNING: No view html attached")
            return response.status(400);
        }
        var ctrl = request.files.ctrl;
        if (!ctrl) {
            console.log("WARNING: No controller attached");
            return response.status(400);
        }
        if (name != model.name.split('.')[0]) {
            console.log("WARNING: Sample model file name must be " + name + ".json");
            return response.status(400);
        }
        if (name != view.name.split('.')[0]) {
            console.log("WARNING: View file name must be " + name + ".ang");
            return response.status(400);
        }
        if (model.name.split('.')[0] != ctrl.name.split('.')[0]) {
            console.log("WARNING: Controller file name must be " + name + ".ctl");
            return response.status(400);
        }
        if (model.name.split('.')[1] != "json") {
            console.log("WARNING: Sample model file extension must be .json");
            return response.status(400);
        }
        if (view.name.split('.')[1] != "ang") {
            console.log("WARNING: View file extension must be .ang");
            return response.status(400);
        }
        if (ctrl.name.split('.')[1] != "ctl") {
            console.log("WARNING: Controller file extension must be .ctl");
            return response.status(400);
        }
        var dirPath = './public/app/renders/' + name;
        var modelPath = './public/app/renders/' + name + '/' + model.name.split('.')[0] + '.json';
        var templatePath = './public/app/renders/' + name + '/' + view.name.split('.')[0] + '.html';
        var controllerPath = './public/app/renders/' + name + '/' + ctrl.name.split('.')[0] + '.js';
        var indexPath = './public/index.html';
        var modelLines = model.data.toString();
        var ctrlLines = ctrl.data.toString();
        if (!modelLines.includes('"renders":')) {
            console.log('WARNING: Model must include "renders":');
            return response.status(400);
        }
        if (!modelLines.includes('"default": "' + apiURL + '/' + name + '"')) {
            console.log('WARNING: Model must include "default": "' + apiURL + '/' + name + '"');
            return response.status(400);
        }
        if (!ctrlLines.includes(".module('renderApp')")) {
            console.log("WARNING: Controller must include .module('renderApp')");
            return response.status(400);
        }
        if (!ctrlLines.includes(".controller('" + name + "',")) {
            console.log("WARNING: Controller must include .controller('" + name + "', function ...");
            return response.status(400);
        }
        if (!ctrlLines.includes("$http.get('" + uiURL + "/" + name + "/" + name + ".json'") ||
            !ctrlLines.includes("$scope.model = response.data.data[0];")) {
            console.log("WARNING: Controller must include $http.get('" + uiURL + "/" + name + "/" + name + ".json' and $scope.model = response.data.data[0];");
            return response.status(400);
        }
        if (fs.existsSync(dirPath)) {
            console.log("WARNING: " + dirPath + " already exists, sending 409...");
            return response.sendStatus(409);
        }
        console.log("Uploading " + name + '/' + model.name + '/' + view.name + '/' + ctrl.name);
        fsextra.ensureDir(dirPath)
            .catch(err => {
                console.error(err)
            });

        model.mv(modelPath, function (err) {
            if (err)
                return response.status(500).send(err);
        });

        view.mv(templatePath, function (err) {
            if (err)
                return response.status(500).send(err);
        });

        ctrl.mv(controllerPath, function (err) {
            if (err)
                return response.status(500).send(err);
        });

        shell.sed('-i', '</html>', '<script type="text/javascript" src="app/renders/' + name + '/' + name + '.js"></script>\n</html>', indexPath);

        response.sendStatus(201);
        response.end();
    },
    deleteFiles: function (request, response, next) {
        var id = request.params.id;
        console.log("Deleting folder " + id);
        const dirPath = './public/app/renders/' + id;
        var indexPath = './public/index.html';
        fsextra.remove(dirPath);
        shell.sed('-i', '<script type="text/javascript" src="app/renders/' + id + '/' + id + '.js"></script>', '', indexPath);
        response.sendStatus(200);
        response.end();
    }
}