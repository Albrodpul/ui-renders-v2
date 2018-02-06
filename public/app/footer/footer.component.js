'use strict'

angular
      .module("appFooter")
      .component("appFooter", {
            templateUrl: 'app/footer/footer.template.html',
            controller: ["$scope", "$http", "$state", function ($scope, $http, $state) {
                  console.log("Footer Controller initialized");

            }]
        });