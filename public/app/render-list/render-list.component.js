'use strict'

angular
      .module("renderList")
      .component("renderList", {
            templateUrl: 'app/render-list/render-list.template.html',
            controller: ["$scope", "$http", "$state", function ($scope, $http, $state) {
                  console.log("Render List Controller initialized");

                  var host = window.location.host;
                  var http = window.location.protocol;
                  var baseURL = "/api/v1/uis";
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
                              var modellist = [];
                              for (var i = 0; i < response.data.length; i++) {
                                    modellist.push(response.data[i].uid);
                              }
                              $scope.modellist = modellist;
                        })

                  $scope.models = function (model) {
                        if (!model) {
                              delete $scope.view;
                              delete $scope.ctrl;
                              $state.go("uis");
                        } else {
                              $http.get(baseURL + "/" + model)
                                    .then(function (response) {
                                          $scope.view = response.data[0].options[0].view;
                                          $scope.ctrl = response.data[0].options[0].ctrl;
                                    })
                        }
                  }

                  $scope.checkState = function (model, view, ctrl) {
                        if (!model && !view && !ctrl) {
                              $state.go("uis");
                        } else {
                              $http.get(baseURL + "/" + model + "/" + view + "/" + ctrl)
                                    .then(function (response) {
                                          $scope.myValue = false;
                                          $state.go("uis.render", { "model": model, "view": view, "ctrl": ctrl });
                                    }, function (err) {
                                          $scope.myValue = true;
                                          $scope.error = err.status + " " + err.statusText;
                                          $state.go("uis");
                                    });
                        }
                  }
            }]
      });
