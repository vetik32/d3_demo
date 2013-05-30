'use strict';

angular.module('d3DemoApp', [])
    .config(function ($routeProvider) {
      $routeProvider
          .when('/', {
            templateUrl: 'views/login.html',
            controller: 'LoginCtrl'
          })
          .when('/home', {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl'
          })
          .when('/demographics', {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl'
          })
          .when('/advertisers', {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl'
          })
          .when('/integration', {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl'
          })
          .when('/partners', {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl'
          })
          .otherwise({
            redirectTo: '/'
          });
    });
