'use strict'

angular.
module('renderApp').
config(['$stateProvider', '$locationProvider', '$urlRouterProvider',
  function ($stateProvider, $locationProvider, $urlRouterProvider) {

    var initInjector = angular.injector(['ng']);
    var $http = initInjector.get('$http');

    $stateProvider
      .state('home', {
        url: '/',
        controller: 'HomeController',
        templateUrl: 'app/states/home/home.template.html',
        controllerAs: 'vm'
      })
      .state('renderizer-ui', {
        url: '?model&view&ctrl',
        controllerProvider: function ($stateParams) {
          var ctrl = ($stateParams.ctrl.split('/')[7]).split('.')[0];
          return ctrl;
        },
        templateProvider: function ($templateRequest, $stateParams) {
          var model = ($stateParams.model.split('/')[7]).split('.')[0];
          var view = $stateParams.view.split('/')[7];
          var pathToTemplate = 'app/states/renders/' + model + '/' + view;
          return $templateRequest(pathToTemplate);
        }
      })


    $urlRouterProvider.otherwise('/');

    $locationProvider.hashPrefix('');

    console.log("App 2 Initialized");


  }

])