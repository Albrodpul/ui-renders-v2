'use strict'

angular
      .module("renderApp")
      .controller("test", function ($scope, $http) {
            console.log("Test Controller Initialized");
            $http.get("http://localhost:8800/app/renders/test/test.json")
                  .then(function (response) {
                        $scope.model = response.data.data[0];
                  });


      });