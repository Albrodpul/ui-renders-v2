'use strict'

angular
      .module("renderApp")
      .controller("renderizer", function ($scope, $http, $state) {
            console.log("Renderizer Controller initialized");

            var apiURL;
            var uiURL;
            var hostname = window.location.hostname;
            if (hostname == "localhost") {
                  apiURL = 'http://localhost:8800/getFiles';
                  uiURL = 'http://localhost:8800/app/states/renders';
            } else {
                  apiURL = "https://ui-renders.herokuapp.com/getFiles";
                  uiURL = "https://ui-renders.herokuapp.com/app/states/renders";
            }

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
                                          "model": model, "view": view, "ctrl": ctrl
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