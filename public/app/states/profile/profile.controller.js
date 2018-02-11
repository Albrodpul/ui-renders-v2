(function () {

  'use strict';

  angular
    .module('renderApp')
    .controller('ProfileController', profileController);

  profileController.$inject = ['$scope', 'authService'];

  function profileController($scope, authService) {

    var vm = this;
    vm.auth = authService;
    vm.profile;

    if (authService.getCachedProfile()) {
      vm.profile = authService.getCachedProfile();

      socialProfile(vm.profile);
    }
    else {
      authService.getProfile(function (err, profile) {

        vm.profile = profile;
        $scope.$apply();
        socialProfile(profile);
      });
    }
    function socialProfile(profile) {
      if (profile.sub.match("google")) {
        $scope.tProfile = "google";
      } else if (profile.sub.match("twitter")) {
        $scope.tProfile = "twitter";
      } else if (profile.sub.match("facebook")) {
        console.log("?");
        $scope.tProfile = "facebook";
      }
    }

  }


})();
