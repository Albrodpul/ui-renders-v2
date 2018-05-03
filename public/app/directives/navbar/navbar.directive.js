(function () {
  'use strict';

  angular
    .module('renderApp')
    .directive('navbar',
      function navbar() {
        return {
          templateUrl: 'app/directives/navbar/navbar.template.html',
          controller: navbarController,
          controllerAs: 'vm'
        }
      });

  navbarController.$inject = ['$scope', 'authService', '$rootScope'];

  function navbarController($scope, authService, $rootScope) {
    var vm = this;
    vm.auth = authService;
    vm.profile;

    if (authService.isAuthenticated()) {
      console.log()
      if (authService.getCachedProfile()) {
        vm.profile = authService.getCachedProfile();

      } else {
        authService.getProfile(function (err, profile) {
          vm.profile = profile;
          $scope.$apply();

        });
      }
    } else {


    }

    $scope.deleteRoot = function () {
      $rootScope.render = false;
      $rootScope.id = null;
      $rootScope.model = null;
      $rootScope.view = null;
      $rootScope.ctrl = null;
      $rootScope.advancedCheck = false;
    }

  }

})();