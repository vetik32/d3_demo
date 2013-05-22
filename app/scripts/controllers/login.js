'use strict';

angular.module('d3DemoApp')
  .controller('LoginCtrl', function($scope, $routeParams, $location){
      $scope.auth = function(){
        console.log('test');
        $location.url('/chart');
      };
  });
