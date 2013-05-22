'use strict';

angular.module('d3DemoApp', [])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/chart', {
        templateUrl: 'views/visitors_and_demographics.html',
        controller: 'MainCtrl'
      })
      .when('/', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
