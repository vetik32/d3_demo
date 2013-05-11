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


  function drawLineGraphs(data, selector) {
    var margin = 40;
    var width = 700 - margin;
    var height = 300 - margin;

    d3.select(selector)
        .append("svg")
        .attr("width", width + margin)
        .attr("height", height + margin)
        .append("g")
        .attr("class", "chart");

    d3.select("svg")
        .selectAll("circle.times_square")
        .data(data.times_square)
        .enter()
        .append("circle")
        .attr("class", "times_square");

    d3.select("svg")
        .selectAll("circle.grand_central")
        .data(data.grand_central)
        .enter()
        .append("circle")
        .attr("class", "grand_central");

    var count_extent = d3.extent(
        data.times_square.concat(data.grand_central),
        function (d) {
          return d.count
        }
    );
    var count_scale = d3.scale.linear()
        .domain(count_extent)
        .range([height, margin]);

    var time_extent = d3.extent(
        data.times_square.concat(data.grand_central),
        function (d) {
          return d.time
        }
    );
    var time_scale = d3.time.scale()
        .domain(time_extent)
        .range([margin, width]);

    d3.selectAll("circle")
        .attr("cy", function (d) {
          return count_scale(d.count)
        })
        .attr("cx", function (d) {
          return time_scale(d.time)
        })
        .attr("r", 3);

    var time_axis = d3.svg.axis()
        .scale(time_scale);

    d3.select("svg")
        .append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0, "+height+")")
        .call(time_axis);

    var count_axis = d3.svg.axis().scale(count_scale).orient("left");

    d3.select("svg")
        .append("g")
        .attr("class", "y axis")
        .attr("transform", "translate("+margin+", 0)")
        .call(count_axis);

    var line = d3.svg.line()
        .x(function (d) {
          return time_scale(d.time)
        })
        .y(function (d) {
          return count_scale(d.count)
        });

    d3.select("svg")
        .append("path")
        .attr("d", line(data.times_square))
        .attr("class", "times_square");

    d3.select("svg")
        .append("path")
        .attr("d", line(data.grand_central))
        .attr("class", "grand_central");

    d3.select(".y.axis")
        .append("text")
        .text("mean number of turnstile revolutions")
        .attr("transform", "rotate (90, #{-margin}, 0)")
        .attr("x", 20)
        .attr("y", 0);

    d3.select(".x.axis")
        .append("text")
        .text("time")
        .attr("x", (width / 1.6) - margin)
        .attr("y", margin / 1.5)
  }

  d3.json("data/turnstile_traffic.json", function(data){ drawLineGraphs(data, "#eventVolumeChart");});



  function drawPieGraph(selector) {
    var width = 300,
        height = 300,
        radius = Math.min(width, height) / 2;

    var color = d3.scale.ordinal()
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    var arc = d3.svg.arc()
        .outerRadius(radius - 10)
        .innerRadius(radius - 100);

    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) { return d.impression; });


    d3.json("data/pie_data.json", function(error, data) {
      var svg = d3.select(selector).append("svg")
          .attr("width", width)
          .attr("height", height)
          .append("g")
          .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

      data.forEach(function(d) {
        d.impression = +d.impression;
      });

      var g = svg.selectAll(".arc")
          .data(pie(data))
          .enter().append("g")
          .attr("class", "arc");

      g.append("path")
          .attr("d", arc)
          .style("fill", function(d) { return color(d.data.advertiser); });

      var legend = d3.select(selector).append("svg")
          .attr("class", "legend")
          .attr("width", 200)
          .attr("height", 200)
          .selectAll("g")
          .data(
              color.domain().slice()
          )
          .enter().append("g")
          .attr("transform", function(d, i) {
            return "translate(0," + i * 20 + ")";
          });

      legend.append("rect")
          .attr("width", 18)
          .attr("height", 18)
          .style("fill", color);

      legend.append("text")
          .attr("x", 24)
          .attr("y", 9)
          .attr("dy", ".35em")
          .text(function(d) { return "Advertiser " + d; });
    });

// Stash the old values for transition.
    function stash(d) {
      d.x0 = d.x;
      d.dx0 = d.dx;
    }

// Interpolate the arcs in data space.
    function arcTween(a) {
      var i = d3.interpolate({x: a.x0, dx: a.dx0}, a);
      return function(t) {
        var b = i(t);
        a.x0 = b.x;
        a.dx0 = b.dx;
        return arc(b);
      };
    }

    d3.select(self.frameElement).style("height", height + "px");
  }
  drawPieGraph("#advertiserPieChart");
});
