'use strict'

angular
      .module("renderApp")
      .controller("test2", function ($scope, $http) {
            console.log("Test2 Controller Initialized");
            $http.get("http://ui-renders.herokuapp.com/app/renders/test2/test2.json")
                  .then(function (response) {
                        $scope.model = response.data.data[0];
                  });
      }
      );