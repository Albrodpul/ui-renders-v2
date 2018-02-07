'use strict'

angular.
module('renderApp').
config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'angularAuth0Provider',
  function ($stateProvider, $locationProvider, $urlRouterProvider, angularAuth0Provider) {

    $stateProvider
      .state('home', {
        url: '/',
        controller: 'HomeController',
        templateUrl: 'app/home/home.template.html',
        controllerAs: 'vm'
      })
      .state('profile', {
        url: '/profile',
        controller: 'ProfileController',
        templateUrl: 'app/profile/profile.template.html',
        controllerAs: 'vm'
      })
      .state('callback', {
        url: '/callback',
        controller: 'CallbackController',
        templateUrl: 'app/callback/callback.html',
        controllerAs: 'vm'
      })
      .state('renders-list', {
        url: '/renders-list',
        component: 'rendersList'
      })
      .state('renderizer', {
        url: '/renderizer',
        component: 'renderizer'
      })
      .state('renderizer.render', {
        url: '/:id/:model/:view/:ctrl',
        controllerProvider: function ($stateParams) {
          const ctrl = ($stateParams.ctrl.split('/')[6]).split('.')[0];
          return ctrl;
        },
        templateUrl: function ($stateParams) {
          const view = ($stateParams.view.split('/')[6]).split('.')[0];
          const id = $stateParams.id;
          return 'app/renders/' + id + '/' + view + ".html";
        }
      })
      .state('about', {
        url: '/about',
        controller: 'about',
        templateUrl: 'app/about/about.template.html'
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