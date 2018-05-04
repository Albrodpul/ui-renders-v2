'use strict'

angular
      .module("renderApp")
      .controller("renderizer", function ($scope, $http, $state, $stateParams, $templateRequest, $sce, $compile, $q) {
            console.log("Renderizer Controller initialized");

            var modelAux;
            var viewAux;
            var ctrlAux;

            if ($stateParams.model && $stateParams.view && $stateParams.ctrl) {

                  modelAux = $stateParams.model;
                  viewAux = $stateParams.view;
                  ctrlAux = $stateParams.ctrl;

                  function json() {
                        return $http.get(modelAux);
                  }

                  var templateUrl = $sce.getTrustedResourceUrl(viewAux);

                  $templateRequest(templateUrl).then(function (template) {
                        // template is the HTML template as a string

                        // Let's put it into an HTML element and parse any directives and expressions
                        // in the code. (Note: This is just an example, modifying the DOM from within
                        // a controller is considered bad style.)
                        $compile($("#my-element").html(template).contents())($scope);
                        $q((resolve, reject) => {
                              json().then((data) => {
                                    $scope.model = data.data;
                              });
                              
                        });
                  }, function () {
                        // An error has occurred here
                  });
            } else {
                  $state.go("home");
            }




      });