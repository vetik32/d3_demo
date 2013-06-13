'use strict';

angular.module('ReportsServices', ['ngResource'])
    .factory('EventVolumeReport', ['$resource', function ($resource) {
      return $resource('data/:reportType.json', {}, {
        query: {method: 'GET', params: {reportType: 'line_data'}}
      });
    }]);

