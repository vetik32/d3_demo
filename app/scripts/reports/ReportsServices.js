'use strict';

angular.module('ReportsServices', ['ngResource'])
    .factory('LocalReports', ['$resource', function ($resource) {
      return $resource('data/:reportType.json', {}, {
        query: {method: 'GET', params: {reportType: 'line_data'}}
      });
    }])
    .factory('Reports', ['$resource', function ($resource) {
      //http://ec2-23-20-50-165.compute-1.amazonaws.com/api/reports/?start-time=2013-04-01T00:00Z&end-time=2013-06-02T00:00Z&dimension=service_class&partner__name__icontains=hipmunk
      return $resource('http://ec2-23-20-50-165.compute-1.amazonaws.com/api/reports/', {}, {
        query: {
          method: 'GET',
          params: {
            'start-time': '2013-04-01T00:00Z',
            'end-time': '2013-06-02T00:00Z',
            'dimension': 'service_class',
            'partner__name__icontains': 'hipmunk'
          }
        }
      });
    }]);
