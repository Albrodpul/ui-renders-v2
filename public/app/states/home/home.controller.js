(function() {
      
        'use strict';
      
        angular
          .module('renderApp')
          .controller('HomeController', homeController);
      
        homeController.$inject = ['authService', '$scope','$state'];
      
        function homeController(authService, $scope,$state) {
      
          var vm = this;
          vm.auth = authService;
          vm.profile;
          window.location.href="/#";
        }
      
      })();