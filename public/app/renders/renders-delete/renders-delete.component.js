'use strict'

angular
      .module("rendersDelete")
      .component("rendersDelete", {
            templateUrl: 'app/renders/renders-delete/renders-delete.template.html',
            controller: ["$scope", "$http", "$state", function ($scope, $http, $state) {
                  console.log("Renders Delete Controller initialized");

                  var baseURL = "/api/v1/uis";

                    $scope.delete = function(model,view,ctrl){
                        $http.delete(baseURL+"/"+model+"/"+view+"/"+ctrl)
                            .then(function(response){
                                $scope.$parent.getAll();
                            });
                    }

            }]
        });