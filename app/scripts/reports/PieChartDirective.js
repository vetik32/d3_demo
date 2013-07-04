'use strict';

angular.module('sjCharts', [])
    .directive('pieChart', function () {
      return {
        restrict: 'A',
        terminal: true,
        scope: {
          val: '='
        },
        link: function postLink(scope, element, attrs) {
          var selector = element[0],
              width = 300,
              height = 300,
              margin = {top: 20, right: 0, bottom: 20, left: 140},
              radius = Math.min(width, height) / 2;


          var arc = d3.svg.arc()
              .outerRadius(radius - 10)
              .innerRadius(radius - 100);

          var valueAccessor = function (d) {
            return d.count;
          };

          var labelAccessor = function (d) {
            return d.value;
          };

          var pie = d3.layout.pie().value(valueAccessor);

          $(selector).empty();

          var svg = d3.select(selector).append('svg')
              .attr('width', width + margin.left + margin.right)
              .attr('height', height + margin.top + margin.bottom);

          var arcs = svg.append('g')
              .attr('transform', 'translate(' + (width / 2 + margin.left) + ',' + height / 2 + ')');

          scope.$watch('val', function (newVal, oldVal) {

              if (typeof newVal === 'undefined') {
                return;
              }

              arcs.selectAll('*').remove();

/*
              var newVal = _.map(d3.range(7).map(Math.random).sort(d3.descending), function (n, index) {
                return {
                  key: 'Advertizer ' + String.fromCharCode(65 + index),
                  value: parseInt(n * 500000, 10)
                };
              });
*/

              var minMaxImpressionDomain = d3.extent(newVal, valueAccessor);

              //var color = d3.scale.linear().domain(minMaxImpressionDomain).range(['#ade1f9', '#005ba0']);
              var color = function (x) {
                var range = ['#005ba0','#007abf','#00b0ed','#75d1f5','#ade1f9'];
                return range[(x - 1) % range.length];
              };

              var numFormmater = d3.format(',');

              var g = arcs.selectAll('.arc')
                  .data(pie(newVal))
                  .enter().append('g')
                  .attr('class', 'arc');

              var colorIndex = 0;
              g.append('path')
                  .attr('d', arc)
                  .style('fill', function (d) {
                    return color(++colorIndex);
                    //return color(labelAccessor(d));
                  });

              var legend = svg.append('g')
                  .attr('class', 'legend')
                  .attr('width', 200)
                  .attr('height', 200)
                  .selectAll('g')
                  .data(newVal)
                  .enter()
                  .append('g')
                  .attr('transform', function (d, i) {
                    return 'translate(0,' + i * 40 + ')';
                  });

              colorIndex = 0;
              legend.append('circle')
                  .attr('transform', 'translate(5,10)')
                  .attr('r', 5)
                  .style('fill', function (d) {
                    return color(++colorIndex);
                    //return color(valueAccessor(d));
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
                    return numFormmater(valueAccessor(d));
                  });
          });
        }
      };
    });
