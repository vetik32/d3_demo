'use strict';

angular.module('d3DemoApp').controller('HomeCtrl', function ($scope) {

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
    var width = 300,
        height = 300,
        margin = {top: 20, right: 0, bottom: 20, left: 140},
        radius = Math.min(width, height) / 2;

    var arc = d3.svg.arc()
        .outerRadius(radius - 10)
        .innerRadius(radius - 100);

    var valueAccessor = function (d) {
      return d.value;
    };

    var labelAccessor = function (d) {
      return d.key;
    };

    var pie = d3.layout.pie().value(valueAccessor);
    $(selector).empty();
    d3.json('data/pie_data.json', function (/*error, data*/) {
      var svg = d3.select(selector).append('svg')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom);

      var arcs = svg.append('g')
          .attr('transform', 'translate(' + (width / 2 + margin.left) + ',' + height / 2 + ')');

      var randomData = _.map(d3.range(7).map(Math.random).sort(d3.descending), function (n, index) {
        return {
          key: 'Advertizer ' + String.fromCharCode(65 + index),
          value: parseInt(n * 500000, 10)
        };
      });

      var minMaxImpressionDomain = d3.extent(randomData, valueAccessor);

      var color = d3.scale.linear().domain(minMaxImpressionDomain).range(['#ade1f9', '#005ba0']);
      var numFormmater = d3.format(',');

      var g = arcs.selectAll('.arc')
          .data(pie(randomData))
          .enter().append('g')
          .attr('class', 'arc');

      g.append('path')
          .attr('d', arc)
          .style('fill', function (d) {
            return color(d.value);
          });

      var legend = svg.append('g')
          .attr('class', 'legend')
          .attr('width', 200)
          .attr('height', 200)
          .selectAll('g')
          .data(randomData)
          .enter()
          .append('g')
          .attr('transform', function (d, i) {
            return 'translate(0,' + i * 40 + ')';
          });

      legend.append('circle')
          .attr('transform', 'translate(5,10)')
          .attr('r', 5)
          .style('fill', function (d) {
            //console.log(d);
            return color(d.value);
          });

      legend.append('text')
          .attr('x', 24)
          .attr('y', 9)
          .attr('dy', '.35em')
          .text(labelAccessor);

      legend.append('text')
          .attr('x', 24)
          .attr('y', 25)
          .attr('dy', '.35em')
          .text(function (d) {
            return numFormmater(d.value);
          });
    });

  }

  drawPieGraph('#advertiserPieChart');
});


