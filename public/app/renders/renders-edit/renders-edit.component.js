'use strict'

angular
    .module("rendersEdit")
    .component("rendersEdit", {
        templateUrl: 'app/renders/renders-edit/renders-edit.template.html',
        controller: ["$scope", "$http", "$state","$state", function ($scope, $http, $state) {
            console.log("Renders Edit Controller initialized");

            var baseURL = "/api/v1/uis";

            $scope.model = $state.params.model;
            $scope.view = $state.params.view;
            $scope.ctrl = $state.params.ctrl;

            var model = $scope.model;
            var view = $scope.view;
            var ctrl = $scope.ctrl;

            $scope.edit = function () {
                console.log("Updating files...");
                var viewFile = (document.getElementById('viewFile')).files[0];
                var ctrlFile = (document.getElementById('ctrlFile')).files[0];
                if (!viewFile || !ctrlFile) {
                    $scope.myValue = true;
                    $scope.error = "400 Bad Request";
                } else if (viewFile.name != view) {
                    $scope.myValue = true;
                    $scope.error = viewFile.name + " must be " + view;
                } else if (ctrlFile.name != ctrl) {
                    $scope.myValue = true;
                    $scope.error = ctrlFile.name + " must be " + ctrl;
                } else if (viewFile.name.split('.')[0] != ctrlFile.name.split('.')[0]) {
                    $scope.myValue = true;
                    $scope.error = "It must be " + viewFile.name.split('.')[0] + ".controller.js";
                } else if (viewFile.name.split('.')[1] + "." + viewFile.name.split('.')[2] != "template.html") {
                    $scope.myValue = true;
                    $scope.error = "It must be " + viewFile.name.split('.')[0] + ".template.html";
                } else if (ctrlFile.name.split('.')[1] + "." + ctrlFile.name.split('.')[2] != "controller.js") {
                    $scope.myValue = true;
                    $scope.error = "It must be " + ctrlFile.name.split('.')[0] + ".controller.js";
                } else {
                    const reader = new FileReader();
                    reader.onload = () => {
                        let text = reader.result;
                        var lines = text.split("\n").toString();
                        if (!lines.includes(".module('renderApp')")) {
                            $scope.myValue = true;
                            $scope.error = ctrlFile.name + " must include .module('renderApp')";
                            $scope.$apply();
                        }
                        else if (!lines.includes(".controller('" + model + "',")) {
                            $scope.myValue = true;
                            $scope.error = ctrlFile.name + " must include .controller('" + model + "', function...";
                            $scope.$apply();
                        } else {
                            $scope.myValue=false;
                            $state.go("uis");
                        }

                    };
                    reader.readAsText(ctrlFile);
                }
            }
        }]
    });