'use strict';

angular.module('d3DemoApp')
    .controller('ReportsCtrl', function ($scope, Reports, LocalReports) {

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
      $scope.grouped = false;

      $scope.switchChartType = function(value){
        if ($scope.type === 'liniar') {
          $scope.grouped = false;
        }
      }

      LocalReports.get({reportType: 'line_data'}, function (report) {
        $scope.eventVolume = report;
      });

      LocalReports.get({reportType: 'service_class_by_partner'}, function (response) {
        $scope.pieData = response.results;
      });

      Reports.query(function (response) {
        $scope.pieData = response.results;
      });


    });
