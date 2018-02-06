'use strict'

angular
      .module("renderApp")
      .controller("test2", function ($scope, $http) {
            console.log("Test2 Controller Initialized");
            $scope.data="Prueba";
            $scope.change=function(){
                  $scope.data="It works!";
            }
      }
      );