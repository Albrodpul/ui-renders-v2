'use strict'

angular.
module('renderApp').
config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'angularAuth0Provider', '$sceDelegateProvider',
  function ($stateProvider, $locationProvider, $urlRouterProvider, angularAuth0Provider, $sceDelegateProvider) {

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