'use strict'

angular
      .module("renderApp")
      .controller("test", function ($scope, $http) {
            console.log("Test Controller Initialized");
            $http.get("https://ui-renders.herokuapp.com/app/states/renders/test/test.json")
                  .then(function (response) {
                        $scope.model = response.data;
                  });

            $scope.change = function () {
                  $scope.cell = $scope.model.data.test3;
            }

      });