'use strict'

angular
      .module("renderizer")
      .component("renderizer", {
            templateUrl: 'app/renderizer/renderizer.template.html',
            controller: ["$scope", "$http", "$state", function ($scope, $http, $state) {
                  console.log("Renderizer Controller initialized");

                  var hostname = window.location.hostname;
                  var http = window.location.protocol;
                  var baseURL = http + '//' + hostname + ':8080/api/v1/renders';
                  $state.go("renderizer");
                  (function () {
                        if (window.localStorage) {
                              if (!localStorage.getItem('firstLoad')) {
                                    localStorage['firstLoad'] = true;
                                    window.location.reload();
                              } else
                                    localStorage.removeItem('firstLoad');
                        }
                  })();

                  $http.get(baseURL)
                        .then(function (response) {
                              var idlist = [];
                              for (var i = 0; i < response.data.length; i++) {
                                    idlist.push(response.data[i].id);
                              }
                              $scope.idlist = idlist;
                        })

                  $scope.ids = function (id) {
                        if (!id) {
                              delete $scope.model;
                              delete $scope.view;
                              delete $scope.ctrl;
                              $state.go("uis");
                        } else {
                              $http.get(baseURL + "/" + id)
                                    .then(function (response) {
                                          $scope.model = response.data[0].sampleModel;
                                          $scope.view = response.data[0].view;
                                          $scope.ctrl = response.data[0].ctrl;
                                    })
                        }
                  }

                  $scope.checkState = function (id, model, view, ctrl) {
                        if (!id && !model && !view && !ctrl) {
                              $state.go("uis");
                        } else {
                              $http.get(baseURL + "/" + id)
                                    .then(function (response) {
                                          $scope.myValue = false;
                                          $state.go("renderizer.render", {
                                                "id": id,
                                                "model": model,
                                                "view": view,
                                                "ctrl": ctrl
                                          });
                                    }, function (err) {
                                          $scope.myValue = true;
                                          $scope.error = err.status + " " + err.statusText;
                                          $state.go("uis");
                                    });
                        }
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