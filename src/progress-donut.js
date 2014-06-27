
(function (ng) {
"use strict";

function drawDonutChart(opts) {

  var width = opts.width,
    height = opts.height,
    percent = opts.percent,
    text_y = opts.text_y;

  width = typeof width !== 'undefined' ? width : 290;
  height = typeof height !== 'undefined' ? height : 290;
  text_y = typeof text_y !== 'undefined' ? text_y : "-.10em";

  if (!opts.arcWidth) {
    opts.arcWidth = 20;
  }

  var svg, path, text;

  var dataset = {
      lower: calcPercent(0),
      upper: calcPercent(percent)
    },
    radius = Math.min(width, height) / 2,
    pie = d3.layout.pie().sort(null),
    format = d3.format(".0%");

  var arc = d3.svg.arc()
    .innerRadius(radius - opts.arcWidth)
    .outerRadius(radius);

  var initChart = function () {

    svg = d3.select(opts.element).append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    path = svg.selectAll("path")
      .data(pie(dataset.lower))
      .enter().append("path")
      .attr("class", function(d, i) { return "color" + i })
      .attr("d", arc)
      .each(function(d) { this._current = d; }); // store the initial values

    text = svg.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", text_y);
  }


  var updateArcs = function () {

    var progress = 0;
    var timeout = setTimeout(function () {
      clearTimeout(timeout);
      path = path.data(pie(dataset.upper)); // update the data
      path.transition().duration(opts.duration).attrTween("d", function (a) {
        // Store the displayed angles in _current.
        // Then, interpolate from _current to the new angles.
        // During the transition, _current is updated in-place by d3.interpolate.
        var i  = d3.interpolate(this._current, a);
        var i2 = d3.interpolate(progress, percent)
        this._current = i(0);
        return function(t) {

          if (opts.showPercentage) {
            text.text( format(i2(t) / 100) );
          }
          return arc(i(t));
        };
      }); // redraw the arcs
    }, 200);

  };


  if (opts.newChart) {
    initChart();

  } else {
    svg = d3.select(opts.element);
    path = svg.selectAll('path');
    text = svg.select('text');
  }


  if (!opts.showPercentage) {
    text.text(opts.display);
  }

  if (typeof(percent) === "string" && opts.showPercentage) {
    text.text(percent);
  
  } else {
    updateArcs();
  }

};

function calcPercent(percent) {
  return [percent, 100-percent];
};


// -----------


ng.module('d3.donut.directives')

.directive('donutProgress', [function(){

  return {

    compile: function (tmplElm, tmplAttr) {

      return function ($scope, linkElm, linkAttr) {


        var generateDonut = function (opts) {

          opts.element = '[donut-progress]';
          
          if (linkAttr.id) {
            opts.element = "#" + linkAttr.id;
          }

          opts.display = opts.data;
          opts.percent = ( opts.data / opts.max ) * 100;
          opts.text_y = ".35em";

          if (!opts.size) {
            opts.size = 290;
          }
          opts.height = opts.width = opts.size;

          drawDonutChart(opts);
          
        };

        $scope.$watch(linkAttr.donutProgress, function (newVal) {

          console.log(newVal);

          generateDonut(newVal);

          newVal.newChart = false;

        }, true);

      };

    }

  };
  
}]);


}(angular));

