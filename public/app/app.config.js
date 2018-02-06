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
        .state('renders', {
          url: '/renders',
          component: 'renders'
        })
        .state('edit', {
          url: '/renders/:model/:view/:ctrl',
          component: 'rendersEdit'
        })
        .state('uis', {
          url: '/api/v1/uis',
          component: 'renderList'
        })
        .state('uis.render', {
          url: '/:model/:view/:ctrl',
          controllerProvider: function ($stateParams) {
            const ctrl = $stateParams.ctrl.split('.')[0];
            return ctrl;
          },
          templateUrl: function ($stateParams) {
            const view = $stateParams.view;
            const model = $stateParams.model;
            return 'app/uis/' + model + '/' + view;
          }
        })
        .state('add', {
          url: '/add',
          component: 'add'
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
