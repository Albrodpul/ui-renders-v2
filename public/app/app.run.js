(function () {

  'use strict';

  angular
    .module('renderApp')
    .run(run);

  run.$inject = ['authService', '$rootScope'];

  function run(authService, $rootScope) {
    // Handle the authentication
    // result in the hash
    authService.handleAuthentication();
    $rootScope.id = null;
    $rootScope.model = null;
    $rootScope.view = null;
    $rootScope.ctrl = null;
    $rootScope.render = false;

  }

})();