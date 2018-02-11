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
        controller: 'rendersList',
        templateUrl: 'app/renders-list/renders-list.template.html'
      })
      .state('renderizer', {
        url: '/renderizer',
        controller: 'renderizer',
        templateUrl: 'app/renderizer/renderizer.template.html'
      })
      .state('renderizer.render', {
        url: '?model',
        resolve: {
          apiUrl: ['$http', '$stateParams', function ($http, $stateParams) {
            return $http({
              method: 'GET',
              url: $stateParams.model
            });
          }],
          items: ['$http', 'apiUrl', function ($http, apiUrl) {
            return $http({
              method: 'GET',
              url: apiUrl.data.renders[0].default
            });
          }]
        },
        controllerProvider: function (items) {
          var ctrl = (items.data[0].ctrl.split('/')[6]).split('.')[0];
          return ctrl;
        },
        templateProvider: function ($templateRequest, items) {
          const view = items.data[0].view.split('/')[6];
          const id = items.data[0].id;
          var pathToTemplate = 'app/renders/' + id + '/' + view;
          return $templateRequest(pathToTemplate);
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