'use strict';

angular.module('d3DemoApp')
    .controller('ReportsCtrl', function ($scope, Reports, LocalReports, $dialog) {

      $scope.reportFilter = {
        from : null,
        to : null
      };

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
          'value': '-1',
          'label': 'Specific Date'
        }
      ];

      $scope.opts = {
        backdrop: false,
        keyboard: true,
        backdropClick: true,
        templateUrl: 'scripts/reports/reportDatepicker.tpl.html',
        controller: 'DatepickerCtrl'
      };

      $scope.openSelectDateRangeDialog = function(){
        var d = $dialog.dialog($scope.opts);
        d.open().then(function(range){
          if (range) {
            setDateRange(range);
          }
        });
      };

      $scope.$watch('dateRange', function(numberOfDays, oldValue) {

        if (typeof numberOfDays === 'undefined') {
          return;
        }

        if (parseInt(numberOfDays, 10) !== -1) {
          generateReportForNDays(numberOfDays);
        }
      });

      var generateReportForNDays = function(numberOfDays){
        if (numberOfDays !== -1) {
          var to = moment().valueOf();
          var from = moment().subtract('days', numberOfDays).valueOf();
          setDateRange({from: from, to: to});
        }
      };

      var setDateRange = function (range, addon) {
        $scope.reportFilter.from = range.from;
        $scope.reportFilter.to = range.to;
        $scope.eventVolume = generateFakeData(addon);
      };

      // does selecting of default radio
      $scope.dateRange = $scope.dates[0].value

      $scope.graphTypes = {
        'liniar': 'Line Graphs',
        'bar': 'Bar Graphs'
      };

      $scope.type = 'bar';
      $scope.grouped = true;

      $scope.switchChartType = function(){
        if ($scope.type === 'liniar') {
          $scope.grouped = false;
        }
      };

      function generateFakeData(addon) {
        var from = moment($scope.reportFilter.from);
        var to = moment($scope.reportFilter.to);
        var numberOfDays = to.diff(from, 'days') + (addon? addon : 0);

        if (numberOfDays > 190) {
           numberOfDays = 183;
        }

        var generatedData = {};

        ['cruise', 'hotel', 'flight','car','vacation'].map(function(item){
          var data = [], i;
          for (i = 0; i < numberOfDays; i+=1) {
            data.push({
              count: parseInt(Math.random() * 5000000, 10),
              time: new Date('01/' + (i + 1) + '/13').getTime()
            })
          }
          generatedData[item] = data;
        });

        return generatedData;
      }

/*
      LocalReports.get({reportType: 'line_data'}, function (report) {
        $scope.eventVolume = generateFakeData($scope.dateRange);
      });
*/

      LocalReports.get({reportType: 'service_class_by_partner'}, function (response) {
        $scope.pieData = response.results;
      });

      //Reports.query(function (response) {
      //  $scope.pieData = response.results;
      //});
    });
