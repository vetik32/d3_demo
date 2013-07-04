'use strict';

angular.module('d3DemoApp')
  .directive('ghVisualization', function () {
    return {
      restrict: 'A',
      terminal: true,
      scope: {
        val: '=',
        type: '=',
        graphType: '=',
        rangeDate: '=',
        grouped: '='
      },
      link: function postLink(scope, element, attrs) {
        var WEEK_DAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        var margin = {top: 20, right: 10, bottom: 120, left: 110},
            width = 900 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        var countAccessor = function (d) {
          return d.count;
        };

        var timeAccessor = function (d) {
          return d.time;
        };

        function getConcatinatedData(data) {
          return _.flatten(data);
        }

        function addCanvas(element) {
          var svg = d3.select(element).append('svg')
              .attr('width', width + margin.left + margin.right)
              .attr('height', height + margin.top + margin.bottom);

          var canvas = svg.append('g').classed('canvas', true)
              .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

          return canvas;
        }

        var color = d3.scale.linear().range(['#f37321','#dc540a','#b44001','#883001','#5a2202']);
        var canvas = addCanvas(element[0]);

        var minMaxInterval = function(flattenData, fieldAccessorFn) {
          return d3.extent(flattenData, fieldAccessorFn);
        };

        scope.$watch('val', function (newVal, oldVal) {

          // if 'val' is undefined, exit
          if (!newVal) {
            return;
          }

          // clear the elements inside of the directive
          canvas.selectAll('*').remove();

          var stack = d3.layout.stack(),
              layers = stack(['cruise', 'hotel', 'flight','car','vacation'].map(function(item) {
                return newVal[item].map(function(d) {
                  return { x: new Date(d.time), y: +d.count };
                });
              })),
              yGroupMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y; }); }),
              yStackMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y; }); });

          var yAxisMaxValue = scope.grouped ? yStackMax : yGroupMax;

          var timeDomain = minMaxInterval(getConcatinatedData(newVal), timeAccessor);

          var timeScaleOffset = 50;
          var xScale = d3.time.scale().domain(timeDomain).range([timeScaleOffset, width - timeScaleOffset]);
          var yScale = d3.scale.linear().domain([0,yAxisMaxValue]).range([height, 0]).nice();


          var barsCount = layers[0].length;
          var tickCount = barsCount > 7 ? 7 : barsCount;
          var xAxis = d3.svg.axis().scale(xScale).ticks(tickCount);  //TODO: set x axis ticks to 7/30/custom
          var yAxis = d3.svg.axis().scale(yScale).orient('left');
          var gridForAxisY = d3.svg.axis().scale(yScale).orient('left');

          /* scales applied to data */
          function xData(e) {
            return xScale(timeAccessor(e));
          }

          function yData(e) {
            return yScale(countAccessor(e));
          }

          function updateYDomain(newDomain){
            yScale.domain(newDomain).nice();
          }

          function drawGrid() {

            var rules = canvas.append('g').classed('rules', true);
            var yGrid = rules.append('svg:g').classed('grid y_grid', true)
                .call(gridForAxisY
                    //.ticks(5)
                    .tickSize(-width, -width, -width)
                    .tickSubdivide(1)
                    .tickFormat(''));

            var labels = canvas.append('svg:g').classed('labels x_labels', true)
                .attr('transform', 'translate(0,' + height + ')')
                .call(xAxis
                    //.ticks(tickCount)
                    .tickSize(0)
                    .tickPadding(30)
                    .tickFormat(d3.time.format('%x'))
                );

            //add week day above x axe labels
            labels.selectAll('.tick.major')
                .append('text')
                .classed('days', true)
                .attr('text-anchor', 'middle')
                .text(function (d) {
                  return WEEK_DAY[d.getDay()];
                })
                .attr('dy', 20);

            var yLabels = canvas.append('svg:g').classed('labels y_labels', true)
                .call(yAxis
                    .tickSize(10, 0, 0)
                );

            return {
              updataToNewScale: function () {
                yGrid.transition().call(gridForAxisY);
                //yLabels.transition().call(yAxis);
              }
            }
          }

          var lineFunction = d3.svg.line()
              .x(function (e) {
                return xData(e);
              })
              .y(function (e) {
                return yData(e);
              });

          function drawLineGraphs() {
            var dataGroup = canvas
                .append('g').classed('data liniar', true);


            var index = 0;
            var legendWrap = canvas.append('g')
                .attr('class', 'legendWrap')
                .attr('transform', 'translate(' + 0 + ',' + (height + margin.bottom / 2) + ')');

            _.each(newVal, function (partOfData, key) {
              index += 1;
              var group = dataGroup.append('g');


              group
                  .append('path')
                  .attr('class', key)
                  .attr('d', lineFunction(partOfData))
                  .attr('stroke', color(index))
                  .attr('stroke-width', 2)
                  .attr('fill', 'none');

              var itemLegendGroup = legendWrap.append('g');

              itemLegendGroup.append('rect')
                  .attr('width', 10)
                  .attr('height', 6)
                  .style('fill', color(index));

              itemLegendGroup.append('text')
                  .attr('dy', '7')
                  .attr('dx', '15')
                  .text(key);
            });


            var series = legendWrap.selectAll('g');

            var ypos = 5,
                newxpos = 5,
                maxwidth = 0,
                xpos;

            var legendItemPadding = 35;

            series.attr('transform', function (/*d, i*/) {
              var length = d3.select(this).select('text').node().getComputedTextLength() + legendItemPadding;
              xpos = newxpos;

              if (width < margin.left + margin.right + xpos + length) {
                newxpos = xpos = 5;
                ypos += 20;
              }

              newxpos += length;
              if (newxpos > maxwidth) {
                maxwidth = newxpos;
              }

              return 'translate(' + xpos + ',' + ypos + ')';
            });

            return {
              updateToNewScale: function () {
                _.each(newVal, function (partOfData, key) {
                  var group = dataGroup.select('.' + key);
                  group.transition().attr('d', lineFunction(partOfData))
                });

              }
            }
          }

          function drawBars(){

            var n = layers.length;
            var xRangeBand = Math.round(500 / layers[0].length);
            var grouppedBarsOffset = xRangeBand/2;

            var dataGroup = canvas
                .append('g').classed('data bar', true);

            var layer = dataGroup.selectAll('.layer')
                .data(layers)
                .enter().append('g')
                .attr('class', 'layer')
                .style('fill', function(d, i) {
                  return color(i + 1);
                });

            var rect = layer.selectAll('rect')
                .data(function(d) { return d; })
                .enter().append('rect')
                .attr('x', function (d, i, j) {
                  return xScale(d.x) - grouppedBarsOffset;
                  //return xScale(d.x) - grouppedBarsOffset + xRangeBand / n * j;
                })
                .attr('y', height)
                .attr('width', xRangeBand / n)
                .attr('height', 0);


            var bars = {
              transitionGrouped: function () {
                updateYDomain([0, yGroupMax]);

                rect.transition()
                    .duration(500)
                    .delay(function (d, i) {
                      return i * 10;
                    })
                    .attr('x', function (d, i, j) {
                      return xScale(d.x) - grouppedBarsOffset + xRangeBand / n * j;
                    })
                    .attr('width', xRangeBand / n)
                    .transition()
                    .attr('y', function (d) {
                      return yScale(d.y);
                    })
                    .attr('height', function (d) {
                      return height - yScale(d.y);
                    });
              },

              transitionStacked: function () {
                updateYDomain([0, yStackMax]);

                rect.transition()
                    .duration(500)
                    .delay(function (d, i) {
                      return i * 10;
                    })
                    .attr('y', function (d) {
                      return yScale(d.y0 + d.y);
                    })
                    .attr('height', function (d) {
                      return yScale(d.y0) - yScale(d.y0 + d.y);
                    })
                    .transition()
                    .attr('x', function (d) {
                      return xScale(d.x) - grouppedBarsOffset;
                    })
                    .attr('width', xRangeBand);
              }
            }

            return bars;
          }

          var grid = drawGrid();
          var lines = drawLineGraphs();
          var bars = drawBars();

          function updateCanvasElements() {
            canvas.select('.labels.y_labels').transition().call(yAxis);
            lines.updateToNewScale();
            grid.updataToNewScale();
          }

          scope.$watch('type', function(type, oldVal){
            var $dataGroups = $(canvas[0][0]).find('.data');
            $dataGroups.css('display','none');
            $dataGroups.filter('.' + type).css('display', '');
          });

          // setup a watch on 'grouped' to switch between views
          scope.$watch('grouped', function (grouped, oldVal) {

            if (grouped) {
              bars.transitionStacked();
            } else {
              bars.transitionGrouped();
            }

            updateCanvasElements();
          });
        });
      }
    };
  });
