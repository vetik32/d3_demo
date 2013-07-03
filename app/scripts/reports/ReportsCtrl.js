'use strict';

angular.module('d3DemoApp')
    .controller('ReportsCtrl', function ($scope, Reports, LocalReports, $dialog) {

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


      $scope.dateRange = $scope.dates[0].value;
      $scope.reportFilter = {
        from : null,
        to : null
      };


      $scope.opts = {
        backdrop: false,
        keyboard: true,
        backdropClick: true,
        templateUrl: 'scripts/reports/reportDatepicker.tpl.html',
        controller: 'ReportDatepickerCtrl'
      };

      $scope.openDialog = function(onCloseAction){
        var d = $dialog.dialog($scope.opts);
        d.open().then(function(result){
          if (result && onCloseAction) {
            onCloseAction();
          }
        });
      };

      $scope.selectCustomRange = function () {
        $scope.openDialog(function () {
          $scope.eventVolume = generateFakeData(15);
        });
      };

      $scope.$watch('dateRange', function(numberOfDays, oldValue) {
        if (parseInt(numberOfDays, 10) !== -1) {
/*
          $scope.eventVolume = generateFakeData(oldValue);
        } else {
*/
          $scope.reportFilter.from = numberOfDays;
          $scope.eventVolume = generateFakeData(numberOfDays);
        }
      });


      $scope.graphTypes = {
        'liniar': 'Line Graphs',
        'bar': 'Bar Graphs'
      };

      $scope.type = 'bar';
      $scope.grouped = true;

      $scope.switchChartType = function(value){
        if ($scope.type === 'liniar') {
          $scope.grouped = false;
        }
      }


      //TODO: datepicker - sets start/end dates, generateFakeData consider it and generates the date range right.
      function generateFakeData(numberOfDays) {
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

      LocalReports.get({reportType: 'line_data'}, function (report) {
        $scope.eventVolume = generateFakeData($scope.dateRange);
      });



      LocalReports.get({reportType: 'service_class_by_partner'}, function (response) {
        $scope.pieData = response.results;
      });

      Reports.query(function (response) {
        $scope.pieData = response.results;
      });


    });
