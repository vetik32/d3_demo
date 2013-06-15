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

        function getConcatinatedData(data) {
          return _.flatten(data);
        }

        function addCanvas(options) {
          var margin = options.margin,
              width = options.width,
              height = options.height;

          var svg = d3.select(options.element).append('svg')
              .attr('width', width + margin.left + margin.right)
              .attr('height', height + margin.top + margin.bottom);

          var canvas = svg.append('g').classed('canvas', true)
              .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

          return canvas;
        }

        function drawGrid(canvas, options) {
          var width = options.width,
              height = options.height;

          var yScale = d3.scale.linear().domain([0, 3000000]).range([height, 0]).nice();
          var yAxis = d3.svg.axis().scale(yScale).orient('left');

          var rules = canvas.append('g').classed('rules', true);


          var makeYAxis2 = yAxis
              .ticks(6)
              .tickSize(-width, -width, 0)
              .tickSubdivide(1)
              .tickFormat('');

          var makeXgrid = options.axis.x
              .ticks(5)
              .tickSize(-height, -height, 0)
              .tickFormat('');


          rules.append('svg:g').classed('grid x_grid', true)
              .attr('transform', 'translate(0,' + height + ')')
              .call(makeXgrid);


          rules.append('svg:g').classed('grid y_grid', true)
              .call(makeYAxis2);

          var labels = canvas.append('svg:g').classed('labels x_labels', true)
              .attr('transform', 'translate(0,' + height + ')')
              .call(options.axis.x
                  .tickSize(0)
                  .tickPadding(30)
                  .tickFormat(d3.time.format('%m/%d'))
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

          canvas.append('svg:g').classed('labels y_labels', true)
              .call(options.axis.y
                  .tickSubdivide(1)
                  .tickSize(20, 10, 0)
              );


          return rules;
        }


        function drawLineGraphs(data, selector) {

          var countAccessor = function (dataAtom) {
            return dataAtom.count;
          };

          var timeAccessor = function (dataAtom) {
            return dataAtom.time;
          };

          var MinMaxCountDomain = d3.extent(getConcatinatedData(data), countAccessor);
          var minMaxTimeDomain = d3.extent(getConcatinatedData(data), timeAccessor);

          var xScale = d3.time.scale().domain(minMaxTimeDomain).range([0, width]);
          var yScale = d3.scale.linear().domain(MinMaxCountDomain).range([height, 0]).nice();


          var xAxis = d3.svg.axis().scale(xScale);
          var yAxis = d3.svg.axis().scale(yScale).orient('left');

          /* scales applied to data */
          function xData(e) {
            return xScale(timeAccessor(e));
          }

          function yData(e) {
            return yScale(countAccessor(e));
          }


          drawGrid(vis, {
            'selector': selector,
            'width': width,
            'height': height,
            'margin': margin,
            'domain': { x: minMaxTimeDomain, y: MinMaxCountDomain},
            'scale': { x: xScale, y: yScale },
            'axis': { x: xAxis, y: yAxis }
          });

          var dataGroup = vis
              .append('g').classed('data liniar', true);


          var lineFunction = d3.svg.line()
              .x(function (e) {
                return xData(e);
              })
              .y(function (e) {
                return yData(e);
              });

          var index = 0;
          var legendWrap = vis.append('g')
              .attr('class', 'legendWrap')
              .attr('transform', 'translate(' + 0 + ',' + (height + margin.bottom / 2) + ')');

          _.each(data, function (partOfData, key) {
            index += 1;
            var group = dataGroup.append('g')
                .attr('class', key);
            group
                .append('path')
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

        }

        var margin = {top: 20, right: 10, bottom: 120, left: 110},
            width = 900 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;


        var vis = addCanvas({
          'element': element[0],
          'width': width,
          'height': height,
          'margin': margin
        });

        //var color = d3.scale.category20();
        var color = function (x) {
              var range = ['#f37321','#dc540a','#b44001','#883001','#5a2202'];
              return range[(x - 1) % range.length];
            };

        function drawBars(originalData){


          var stack = d3.layout.stack(),
              layers = stack(["cruise", "hotel", "flight","car","vacation"].map(function(item) {
                return originalData[item].map(function(d) {
                  return {x: new Date(d.time), y: +d.count};
                });
              })),
              n = layers.length, // number of layers
              m = layers[0].length, // number of samples per layer
              yGroupMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y; }); }),
              yStackMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y; }); });

          var x = d3.scale.ordinal()
              .domain(d3.range(m))
              .rangeRoundBands([0, width], .08);

          var y = d3.scale.linear()
              .domain([0, yStackMax])
              .range([height, 0]);

          var dataGroup = vis
              .append('g').classed('data bar', true);

          var layer = dataGroup.selectAll(".layer")
              .data(layers)
              .enter().append("g")
              .attr("class", "layer")
              .style("fill", function(d, i) {
                return color(i + 1);
              });

          var rect = layer.selectAll("rect")
              .data(function(d) { return d; })
              .enter().append("rect")
              .attr("x", function(d) { return x(d.x); })
              .attr("y", height)
              .attr("width", x.rangeBand())
              .attr("height", 0);

          rect.transition()
              .delay(function(d, i) { return i * 10; })
              .attr("y", function(d) { return y(d.y0 + d.y); })
              .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); });

          return {
            transitionGrouped: function () {
              y.domain([0, yGroupMax]);

              rect.transition()
                  .duration(500)
                  .delay(function (d, i) {
                    return i * 10;
                  })
                  .attr("x", function (d, i, j) {
                    return x(d.x) + x.rangeBand() / n * j;
                  })
                  .attr("width", x.rangeBand() / n)
                  .transition()
                  .attr("y", function (d) {
                    return y(d.y);
                  })
                  .attr("height", function (d) {
                    return height - y(d.y);
                  });
            },

            transitionStacked: function () {
              y.domain([0, yStackMax]);

              rect.transition()
                  .duration(500)
                  .delay(function (d, i) {
                    return i * 10;
                  })
                  .attr("y", function (d) {
                    return y(d.y0 + d.y);
                  })
                  .attr("height", function (d) {
                    return y(d.y0) - y(d.y0 + d.y);
                  })
                  .transition()
                  .attr("x", function (d) {
                    return x(d.x);
                  })
                  .attr("width", x.rangeBand());
            }

          }


// Inspired by Lee Byron's test data generator.
          function bumpLayer(n, o) {

            function bump(a) {
              var x = 1 / (.1 + Math.random()),
                  y = 2 * Math.random() - .5,
                  z = 10 / (.1 + Math.random());
              for (var i = 0; i < n; i++) {
                var w = (i / n - y) * z;
                a[i] += x * Math.exp(-w * w);
              }
            }

            var a = [], i;
            for (i = 0; i < n; ++i) a[i] = o + o * Math.random();
            for (i = 0; i < 5; ++i) bump(a);
            return a.map(function(d, i) { return {x: i, y: Math.max(0, d)}; });
          }
          // reset grouped state to false
        }

        var barGraphDrawn = false;

        scope.$watch('val', function (newVal, oldVal) {

          // clear the elements inside of the directive
          vis.selectAll('*').remove();

          // if 'val' is undefined, exit
          if (!newVal) {
            return;
          }

          var bars = null;

          if (scope.type === 'liniar') {
            drawLineGraphs(newVal, element[0]);
          } else {
            bars = drawBars(newVal, element[0]);
          }

          scope.$watch('type', function () {
            if (!barGraphDrawn) {
              bars = drawBars(newVal, element[0]);
              barGraphDrawn = true;
            }
            $(vis[0]).find('.data').css('display','none')
                .filter('.' + scope.type).css('display','');
          });

          // setup a watch on 'grouped' to switch between views
          scope.$watch('grouped', function (newVal, oldVal) {
            // ignore first call which happens before we even have data from the Github API
            if (newVal === oldVal) {
              return;
            }
            if (newVal) {
              bars.transitionStacked();
            } else {
              bars.transitionGrouped();
            }
          });

        });



      }
    };
  });
