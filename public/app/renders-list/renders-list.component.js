'use strict'

angular
      .module("rendersList")
      .component("rendersList", {
            templateUrl: 'app/renders-list/renders-list.template.html',
            controller: ["$scope", "$http", "$state", function ($scope, $http, $state) {
                  console.log("Renders Controller initialized");

                  var baseURL = "http://localhost:8080/api/v1/renders";

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

            }]
        });