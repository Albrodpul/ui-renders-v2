'use strict'

angular
      .module("renderizer")
      .component("renderizer", {
            templateUrl: 'app/renderizer/renderizer.template.html',
            controller: ["$scope", "$http", "$state", function ($scope, $http, $state) {
                  console.log("Renderizer Controller initialized");

                  var apiURL;
                  var uiURL;
                  var hostname = window.location.hostname;
                  if (hostname == "localhost") {
                        apiURL = 'http://localhost:8080/api/v1/renders';
                        uiURL = 'http://localhost:8800/app/renders';
                  } else {
                        apiURL = "https://api-renders.herokuapp.com/api/v1/renders";
                        uiURL = "https://ui-renders.herokuapp.com/app/renders";
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
                                    idlist.push(response.data[i].id);
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
                              $http.get(apiURL + "/" + id)
                                    .then(function (response) {
                                          $scope.model = response.data[0].sampleModel;
                                          $scope.view = response.data[0].view;
                                          $scope.ctrl = response.data[0].ctrl;
                                    })
                        }
                  }

                  $scope.checkState = function (id, model, view, ctrl) {
                        if (!id && !model && !view && !ctrl) {
                              $state.go("renderizer");
                        } else {
                              $http.get(apiURL + "/" + id)
                                    .then(function (response) {
                                          $scope.error = "";
                                          $state.go("renderizer.render", {
                                                "model": model
                                          });
                                    }, function (err) {
                                          $scope.error = "Render not found";
                                          $state.go("renderizer");
                                    });
                        }
                  }

                  $scope.downloadModel = function (id) {
                        var modelUrl = "app/renders/" + id + "/" + id + ".json";
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
                        var ctrlUrl = "app/renders/" + id + "/" + id + ".ctl";
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
                        var viewUrl = "app/renders/" + id + "/" + id + ".ang";
                        var viewDownload = id + ".ang";
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