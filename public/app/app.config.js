'use strict'

angular.
module('renderApp').
config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'angularAuth0Provider',
  function ($stateProvider, $locationProvider, $urlRouterProvider, angularAuth0Provider) {

    var initInjector = angular.injector(['ng']);
    var $http = initInjector.get('$http');

    $stateProvider
      .state('home', {
        url: '/',
        controller: 'HomeController',
        templateUrl: 'app/states/home/home.template.html',
        controllerAs: 'vm'
      })
      .state('profile', {
        url: '/profile',
        controller: 'ProfileController',
        templateUrl: 'app/states/profile/profile.template.html',
        controllerAs: 'vm'
      })
      .state('callback', {
        url: '/callback',
        controller: 'CallbackController',
        templateUrl: 'app/states/callback/callback.html',
        controllerAs: 'vm'
      })
      .state('renders-list', {
        url: '/renders-list',
        controller: 'rendersList',
        templateUrl: 'app/states/renders-list/renders-list.template.html'
      })
      .state('renderizer', {
        url: '/renderizer',
        controller: 'renderizer',
        templateUrl: 'app/states/renderizer/renderizer.template.html'
      })
      .state('renderizer.render', {
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
      .state('about', {
        url: '/about',
        controller: 'about',
        templateUrl: 'app/states/about/about.template.html'
      })


    $urlRouterProvider.otherwise('/');

    $locationProvider.hashPrefix('');

    // Initialization for the angular-auth0 library
    angularAuth0Provider.init({
      clientID: AUTH0_CLIENT_ID,
      domain: AUTH0_DOMAIN,
      responseType: 'token id_token',
      audience: 'https://' + AUTH0_DOMAIN + '/userinfo',
      redirectUri: AUTH0_CALLBACK_URL,
      scope: 'openid profile'
    });

    console.log("App Initialized");


  }

])