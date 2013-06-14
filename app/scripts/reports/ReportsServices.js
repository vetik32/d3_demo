'use strict';

angular.module('ReportsServices', ['ngResource'])
    .factory('Reports', ['$resource', function ($resource) {
      return $resource('data/:reportType.json', {}, {
        query: {method: 'GET', params: {reportType: 'line_data'}}
      });
    }]);

