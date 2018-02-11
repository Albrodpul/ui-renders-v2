'use strict'

angular
.module('renderApp')
      .controller('example', function ($scope, $http) {
            console.log('Example Controller Initialized');
            $http.get('http://localhost:8800/app/states/renders/example/example.json')
                .then(function(response){
                      $scope.model = response.data.data[0];
            });

      });