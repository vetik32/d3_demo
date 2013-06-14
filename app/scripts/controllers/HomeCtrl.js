'use strict';

angular.module('d3DemoApp').controller('HomeCtrl', function ($scope) {

  $scope.client = {
    name: 'American Airlines'
  };

  $scope.states = [
    {
      'name': 'California',
      'percentage': '25%'
    },
    {
      'name': 'New York',
      'percentage': '20%'
    },
    {
      'name': 'Nebraska',
      'percentage': '10%'
    },
    {
      'name': 'Utah',
      'percentage': '8%'
    },
    {
      'name': 'Massachusetts',
      'percentage': '7%'
    }
  ];

  $scope.listOfItem = [
    {
      'name': 'Event Volume',
      'value': '123456789'
    },
    {
      'name': 'Cookie Volume',
      'value': '123456'
    },
    {
      'name': 'Unique Cookie Volume',
      'value': '123456'
    },
    {
      'name': 'Cookie Revenue eCPM',
      'value': '123456'
    },
    {
      'name': 'Event Revenue eCPM',
      'value': '123456'
    }
  ];

  function drawPieGraph(selector) {
  }

  drawPieGraph('#advertiserPieChart');
});


