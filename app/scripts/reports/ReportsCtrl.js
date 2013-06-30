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

      $scope.openDialog = function(){
        var d = $dialog.dialog($scope.opts);
        d.open().then(function(result){
          if(result)
          {
            alert('dialog closed with result: ' + result);
          }
        });
      };

      $scope.$watch('dateRange', function(numberOfDays, oldValue) {
        if (parseInt(numberOfDays, 10) === -1) {
          $scope.eventVolume = generateFakeData(oldValue);
          $scope.openDialog();
        } else {
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
