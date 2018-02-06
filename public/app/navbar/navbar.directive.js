(function() {
  'use strict';

  angular
    .module('renderApp')
    .directive('navbar',
      function navbar() {
        return {
          templateUrl: 'app/navbar/navbar.template.html',
          controller: navbarController,
          controllerAs: 'vm'
        }
      });

  navbarController.$inject = ['$scope', 'authService'];

  function navbarController($scope, authService) {
    var vm = this;
    vm.auth = authService;
    vm.profile;
    
    if (authService.isAuthenticated()) {
      console.log()
      if (authService.getCachedProfile()) {
        vm.profile = authService.getCachedProfile();
        
      }
      else {
        authService.getProfile(function(err, profile) {
          vm.profile = profile;
          $scope.$apply();
          
        });
      }
    }
    else {


    }

  }

})();
