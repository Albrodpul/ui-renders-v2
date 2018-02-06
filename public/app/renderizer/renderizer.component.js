'use strict'

angular
      .module("renderizer")
      .component("renderizer", {
            templateUrl: 'app/renderizer/renderizer.template.html',
            controller: ["$scope", "$http", "$state", function ($scope, $http, $state) {
                  console.log("Renderizer Controller initialized");

                  var host = window.location.host;
                  var http = window.location.protocol;
                  var baseURL = "http://localhost:8080/api/v1/renders";
                  $state.go("uis");
                  (function () {
                        if (window.localStorage) {
                              if (!localStorage.getItem('firstLoad')) {
                                    localStorage['firstLoad'] = true;
                                    window.location.reload();
                              }
                              else
                                    localStorage.removeItem('firstLoad');
                        }
                  })();
                  
                  $scope.myValue = false;
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
                                          console.log(response.data[0]);
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
                                          $state.go("renderizer.render", { "id": id, "model": model, "view": view, "ctrl": ctrl });
                                    }, function (err) {
                                          $scope.myValue = true;
                                          $scope.error = err.status + " " + err.statusText;
                                          $state.go("uis");
                                    });
                        }
                  }
            }]
      });
