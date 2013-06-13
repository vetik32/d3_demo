'use strict';

angular.module('d3DemoApp')
    .controller('ReportsCtrl', function ($scope, EventVolumeReport) {

      $scope.dates = [
        {
          'value': 30,
          'label': 'Last 30 days'
        },
        {
          'value': 7,
          'label': 'Last 7 days'
        },
        {
          'value': -1,
          'label': 'Specific Date'
        }
      ];

      $scope.rangeDate = $scope.dates[0].value;

      $scope.graphTypes = {
        'liniar': 'Line Graphs',
        'bar': 'Bar Graphs'
      };

      $scope.type = 'liniar';
      $scope.grouped = true;

      EventVolumeReport.query(function (response) {
        $scope.eventVolume = response;
      });

    })
;
