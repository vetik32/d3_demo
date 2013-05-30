'use strict';

angular.module('d3DemoApp')
    .controller('UserCtrl',['$scope', '$location', function ($scope, $location) {
      $scope.user = {
        name: 'John Smith'
      };

      $scope.navigation = [
        {
          display: 'Home',
          url: 'home'
        },
        {
          display: 'Demographics',
          url: 'demographics'
        },
        {
          display: 'Advertisers',
          url: 'advertisers'
        },
        {
          display: 'Integration Guide',
          url: 'integration'
        },
        {
          display: 'Partners',
          url: 'partners'
        }

      ];

      $scope.getMenuItemClass = function(item) {
        var hashPath = $location.$$path || '/';
        if (hashPath.substring(1) === item.url) {
          return 'active';
        }
        return '';
      };

    }]);
