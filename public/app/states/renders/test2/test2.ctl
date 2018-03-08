'use strict'

angular
      .module("renderApp")
      .controller("test2", function ($scope, $http) {
            console.log("Test2 Controller Initialized");
            $http.get("https://ui-renders.herokuapp.com/app/states/renders/test2/test2.json")
                  .then(function (response) {
                        $scope.model = response.data;
                  });

            $scope.generate = function () {
                  $scope.something = $scope.model.data.prueba2;
            }
      });