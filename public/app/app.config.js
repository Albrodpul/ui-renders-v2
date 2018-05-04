'use strict'

angular.
module('renderApp').
config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'angularAuth0Provider', '$sceDelegateProvider',
  function ($stateProvider, $locationProvider, $urlRouterProvider, angularAuth0Provider, $sceDelegateProvider) {

    $sceDelegateProvider.resourceUrlWhitelist(['**']);

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
        url: '/renderizer?model&view&ctrl',
        controller: 'renderizer',
        templateUrl: 'app/states/renderizer/renderizer.template.html'
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