'use strict'

angular
      .module("renderApp")
      .controller("test", function ($scope, $http) {
            console.log("Test Controller Initialized");
            $scope.data="Hola"
            $scope.change=function(){
                  $scope.data="Adiós";
            }

      });