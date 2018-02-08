var path = require('path');
var fs = require('fs');
var fsextra = require('fs-extra');
var shell = require('shelljs');
const fileUpload = require('express-fileupload');

module.exports = {
    postFiles: function (request, response, next) {
        var apiURL;
        var uiURL;
        var hostname = request.get('host').split(':')[0];
        if (hostname == "localhost") {
            apiURL = 'http://localhost:8080/api/v1/renders';
            uiURL = 'http://localhost:8800/app/renders';
        } else {
            apiURL = "https://api-renders.herokuapp.com/api/v1/renders";
            uiURL = "https://ui-renders.herokuapp.com/app/renders";
        }
        var model = request.files.model;
        if (!model) {
            console.log("WARNING: No model json uploaded")
            return response.status(400);
        }
        var view = request.files.view;
        if (!view) {
            console.log("WARNING: No view html uploaded")
            return response.status(400);
        }
        var ctrl = request.files.ctrl;
        if (!ctrl) {
            console.log("WARNING: No controller uploaded");
            return response.status(400);
        }

        if (model.name.split('.')[0] != view.name.split('.')[0]) {
            console.log("WARNING: View file name must be " + model.name.split('.')[0] + ".html");
            return response.status(400);
        }
        if (model.name.split('.')[0] != ctrl.name.split('.')[0]) {
            console.log("WARNING: Controller file name must be " + model.name.split('.')[0] + ".js");
            return response.status(400);
        }
        var id = model.name.split('.')[0];
        console.log("Uploading " + id + '/' + model.name + '/' + view.name + '/' + ctrl.name);
        var dirPath = './public/app/renders/' + id;
        var modelPath = './public/app/renders/' + id + '/' + model.name.split('.')[0] + '.json';
        var templatePath = './public/app/renders/' + id + '/' + view.name.split('.')[0] + '.html';
        var controllerPath = './public/app/renders/' + id + '/' + ctrl.name.split('.')[0] + '.js';
        var indexPath = './public/index.html';
        var modelLines = model.data.toString();
        var ctrlLines = ctrl.data.toString();
        if (fs.existsSync(dirPath)) {
            console.log("WARNING: " + dirPath + " already exists, sending 409...");
            return response.sendStatus(409);
        }
        if (!modelLines.includes('"renders":')) {
            console.log('WARNING: Model must include "renders":');
            return response.status(400);
        }
        if (!modelLines.includes('"default": "' + apiURL + '/' + id + '"')) {
            console.log('WARNING: Model must include "default": "' + apiURL + '/' + id + '"');
            return response.status(400);
        }
        if (!ctrlLines.includes(".module('renderApp')")) {
            console.log("WARNING: Controller must include .module('renderApp')");
            return response.status(400);
        }
        if (!ctrlLines.includes(".controller('" + id + "',")) {
            console.log("WARNING: Controller must include .controller('" + id + "', function ...");
            return response.status(400);
        }
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

        shell.sed('-i', '</html>', '<script type="text/javascript" src="app/renders/' + id + '/' + id + '.js"></script>\n</html>', indexPath);

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