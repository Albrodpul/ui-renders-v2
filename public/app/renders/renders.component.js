'use strict'

angular
      .module("renders")
      .component("renders", {
            templateUrl: 'app/renders/renders.template.html',
            controller: ["$scope", "$http", "$state", function ($scope, $http, $state) {
                  console.log("Renders Controller initialized");

                  var baseURL = "/api/v1/uis";

                  var refresh = function(){
                      $http.get(baseURL)
                        .then(function(response){
                            $scope.uis=response.data;
                        });
                  }

                  refresh();

                  $scope.getAll = function(){
                        refresh();
                  }

            }]
        });