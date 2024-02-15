//Width and height
var w = 800;
var h = 300;
var padding = 40;

var dataset, xScale, yScale, xAxis, yAxis, line; //Empty, for now

//For converting Dates to strings
var formatTime = d3.timeFormat("%Y");

//Function for converting CSV values from strings to Dates and numbers
var rowConverter = function (d) {
  return {
    date: new Date(+d.year, +d.month - 1), //Make a new Date object for each year + month
    average: parseFloat(d.average), //Convert from string to float
  };
};

//Load in data
d3.csv("../mauna_loa_co2_monthly_averages.csv", rowConverter).then(function (
  data
) {
  var dataset = data;

  //Print data to console as table, for verification
  //console.table(dataset, ["date", "average"]);

  //Create scale functions
  xScale = d3
    .scaleTime()
    .domain([
      d3.min(dataset, function (d) {
        return d.date;
      }),
      d3.max(dataset, function (d) {
        return d.date;
      }),
    ])
    .range([padding, w]);

  yScale = d3
    .scaleLinear()
    .domain([
      d3.min(dataset, function (d) {
        if (d.average >= 0) {
          return d.average;
        }
      }) - 10,
      d3.max(dataset, function (d) {
        return d.average;
      }),
    ])
    .range([h - padding, 0]);

  //Define axes
  xAxis = d3.axisBottom().scale(xScale).ticks(10).tickFormat(formatTime);

  //Define Y axis
  yAxis = d3.axisLeft().scale(yScale).ticks(10);

  //Define line generator
  line = d3
    .line()
    .defined(function (d) {
      return d.average >= 0;
    })
    .x(function (d) {
      return xScale(d.date);
    })
    .y(function (d) {
      return yScale(d.average);
    });

  //Create SVG element
  var svg = d3.select("body").append("svg").attr("width", w).attr("height", h);

  //Create line
  svg
    .append("path")
    .datum(dataset)
    .attr("class", "line")
    .attr("d", line)
    .attr("fill", "none")
    .attr("stroke", "blue");

  svg
    .append("line")
    .attr("class", "line safelevel")
    .attr("x1", padding)
    .attr("x2", w)
    .attr("y1", yScale(350))
    .attr("y2", yScale(350));

  //Create axes
  svg
    .append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .call(xAxis);

  svg
    .append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis);
});
