'use strict';

angular.module('d3DemoApp').controller('MainCtrl', ['$scope', '$location', function ($scope, $location) {

  $scope.template = {
    url: 'views/' + $location.$$url.substring(1) + '.html'
  };

}]);


