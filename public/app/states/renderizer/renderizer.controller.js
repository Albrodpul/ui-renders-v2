'use strict'

angular
      .module("renderApp")
      .controller("renderizer", function ($scope, $http, $state, $stateParams) {
            console.log("Renderizer Controller initialized");

            var apiURL;
            var uiURL;
            var hostname = window.location.hostname;
            if (hostname == "localhost") {
                  apiURL = 'http://localhost:8800/getFiles';
                  uiURL = 'http://localhost:8800/app/states/renders';
            } else {
                  apiURL = "https://" + hostname + "/getFiles";
                  uiURL = "https://" + hostname + "/app/states/renders";
            }

            $state.go("renderizer");

            $http.get(apiURL)
                  .then(function (response) {
                        var idlist = [];
                        for (var i = 0; i < response.data.length; i++) {
                              idlist.push(response.data[i][0]);
                        }
                        $scope.idlist = idlist;
                  })

            $scope.ids = function (id) {
                  if (!id) {
                        delete $scope.model;
                        delete $scope.view;
                        delete $scope.ctrl;
                        $state.go("renderizer");
                  } else {
                        $http.get(apiURL)
                              .then(function (response) {
                                    var data = response.data.filter(i => i[0] == id);
                                    $scope.model = uiURL + "/" + data[0][1] + "/" + data[0][1] + ".json";
                                    $scope.view = uiURL + "/" + data[0][2] + "/" + data[0][2] + ".ang";
                                    $scope.ctrl = uiURL + "/" + data[0][3] + "/" + data[0][3] + ".ctl";
                              })
                  }
            }

            var modelAux;
            var viewAux;
            var ctrlAux;
            if ($stateParams.model && $stateParams.view && $stateParams.ctrl) {
                  modelAux = (($stateParams.model).split('/')[7]).split('.')[0];
                  viewAux = (($stateParams.view).split('/')[7]).split('.')[0];
                  ctrlAux = (($stateParams.ctrl).split('/')[7]).split('.')[0];
            } else {
                  modelAux = null;
                  viewAux = null;
                  ctrlAux = null;
            }
            if (!modelAux && !viewAux && !ctrlAux) {
                  $state.go("renderizer");
                  $scope.id = null;
                  $scope.model = null;
                  $scope.view = null;
                  $scope.ctrl = null;
            } else {
                  $http.get(apiURL)
                        .then(function (response) {
                              var data = response.data.filter(i => i[1] == modelAux);
                              var id = data[0][0];
                              var model = uiURL + "/" + data[0][1] + "/" + data[0][1] + ".json";
                              var view = uiURL + "/" + data[0][2] + "/" + data[0][2] + ".ang";
                              var ctrl = uiURL + "/" + data[0][3] + "/" + data[0][3] + ".ctl";
                              $scope.error = "";
                              (function () {
                                    if (window.localStorage) {
                                          if (!localStorage.getItem('firstLoad')) {
                                                localStorage['firstLoad'] = true;
                                                window.location.reload();
                                          } else
                                                localStorage.removeItem('firstLoad');
                                    }
                              })();
                              $state.go("renderizer.render", {
                                    "model": model,
                                    "view": view,
                                    "ctrl": ctrl
                              });
                              $scope.id = id;
                              $scope.model = model;
                              $scope.view = view;
                              $scope.ctrl = ctrl;
                        });
            }

            $scope.checkState = function (id, model, view, ctrl) {
                  if (!id && !model && !view && !ctrl) {
                        $state.go("renderizer");
                  } else {
                        $http.get(apiURL)
                              .then(function (response) {
                                    var data = response.data.filter(i => i[0] == id);
                                    var model = uiURL + "/" + data[0][1] + "/" + data[0][1] + ".json";
                                    var view = uiURL + "/" + data[0][2] + "/" + data[0][2] + ".ang";
                                    var ctrl = uiURL + "/" + data[0][3] + "/" + data[0][3] + ".ctl";
                                    $scope.error = "";
                                    $state.go("renderizer.render", {
                                          "model": model,
                                          "view": view,
                                          "ctrl": ctrl
                                    });
                              }, function (err) {
                                    $scope.error = "Render not found";
                                    $state.go("renderizer");
                              });
                  }
            }

            $scope.downloadModel = function (id) {
                  var modelUrl = "app/states/renders/" + id + "/" + id + ".json";
                  var modelDownload = id + ".json";
                  $http({
                        url: modelUrl,
                        method: "GET",
                        responseType: "blob"
                  }).then(function (response) {
                        saveAs(response.data, modelDownload);
                  });
            }

            $scope.downloadCtrl = function (id) {
                  var ctrlUrl = "app/states/renders/" + id + "/" + id + ".ctl";
                  var ctrlDownload = id + ".ctl";
                  $http({
                        url: ctrlUrl,
                        method: "GET",
                        responseType: "blob"
                  }).then(function (response) {
                        saveAs(response.data, ctrlDownload);
                  });
            }

            $scope.downloadView = function (id) {
                  var viewUrl = "app/states/renders/" + id + "/" + id + ".ang";
                  var viewDownload = id + ".ang";
                  $http({
                        url: viewUrl,
                        method: "GET",
                        responseType: "blob"
                  }).then(function (response) {
                        saveAs(response.data, viewDownload);
                  });
            }
      });