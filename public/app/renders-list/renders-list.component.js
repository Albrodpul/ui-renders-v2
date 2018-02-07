'use strict'

angular
      .module("rendersList")
      .component("rendersList", {
            templateUrl: 'app/renders-list/renders-list.template.html',
            controller: ["$scope", "$http", "$state", function ($scope, $http, $state) {
                  console.log("Renders Controller initialized");

                  var hostname = window.location.hostname;
                  var http = window.location.protocol;
                  var baseURL = http + '//' + hostname + ':8080/api/v1/renders/';

                  var refresh = function(){
                      $http.get(baseURL)
                        .then(function(response){
                            $scope.renders=response.data;
                        });
                  }

                  refresh();

                  $scope.getAll = function(){
                        refresh();
                  }

                  $scope.downloadModel = function (model) {
                        var modelUrl = "app/renders/" + (model.split('/')[6]).split('.')[0] + "/" + (model.split('/')[6]).split('.')[0] + ".json";
                        var modelDownload = (model.split('/')[6]).split('.')[0] + ".json";
                        $http({
                              url: modelUrl,
                              method: "GET",
                              responseType: "blob"
                        }).then(function (response) {
                              saveAs(response.data, modelDownload);
                        });
                  }                  

                  $scope.downloadCtrl = function (ctrl) {
                        var ctrlUrl = "app/renders/" + (ctrl.split('/')[6]).split('.')[0] + "/" + (ctrl.split('/')[6]).split('.')[0] + ".js";
                        var ctrlDownload = (ctrl.split('/')[6]).split('.')[0] + ".ctl";
                        $http({
                              url: ctrlUrl,
                              method: "GET",
                              responseType: "blob"
                        }).then(function (response) {
                              saveAs(response.data, ctrlDownload);
                        });
                  }

                  $scope.downloadView = function (view) {
                        var viewUrl = "app/renders/" + (view.split('/')[6]).split('.')[0] + "/" + (view.split('/')[6]).split('.')[0] + ".html";
                        var viewDownload = (view.split('/')[6]).split('.')[0] + ".ang";
                        $http({
                              url: viewUrl,
                              method: "GET",
                              responseType: "blob"
                        }).then(function (response) {
                              saveAs(response.data, viewDownload);
                        });
                  } 

            }]
        });