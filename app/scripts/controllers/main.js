'use strict';

angular.module('d3DemoApp').controller('MainCtrl', function ($scope) {

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


  var WEEK_DAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  //var n = weekday[d.getDay()];

  /*
   * {selector,width,height}
   */
  function addCanvas(options) {

    var margin = options.margin,
        width = options.width,
        height = options.height;

    var svg = d3.select(options.selector).append('svg')
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


    /*
     grid.append('filter')
     .attr('id','A')
     .append('feGaussianBlur').attr('stdDeviation', '2');
     */


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
    /*
     make_x_axis()
     .ticks(8)
     .tickSize(-height, -height, 0)
     .tickFormat('')
     */


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

  function getConcatinatedData(data) {
    return _.flatten(data);
  }

  function drawLineGraphs(data, selector) {

    var margin = {top: 20, right: 10, bottom: 120, left: 110},
        width = 900 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

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

    var canvas = addCanvas({
      'selector': selector,
      'width': width,
      'height': height,
      'margin': margin
    });


/*    function make_x_axis() {
      return d3.svg.axis()
          .scale(xScale)
          .orient('bottom')
          .ticks(5)
    }

    function make_y_axis() {
      return d3.svg.axis()
          .scale(yScale)
          .orient('left')
          .ticks(5)
    }*/

    drawGrid(canvas, {
      'selector': selector,
      'width': width,
      'height': height,
      'margin': margin,
      'domain': { x: minMaxTimeDomain, y: MinMaxCountDomain},
      'scale': { x: xScale, y: yScale },
      'axis': { x: xAxis, y: yAxis }
    });

    var color = d3.scale.category20();
    var dataGroup = canvas
        .append('g').classed('data', true);


    var lineFunction = d3.svg.line()
        .x(function (e) {
          return xData(e);
        })
        .y(function (e) {
          return yData(e);
        });

    var index = 0;
    var legendWrap = canvas.append('g')
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

  d3.json('data/line_data.json', function (data) {
    drawLineGraphs(data, '#eventVolumeChart');
  });


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
            console.log(d);
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


