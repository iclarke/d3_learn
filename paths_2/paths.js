//Width and height
var w = 800;
var h = 300;
var padding = 40;

var dataset, xScale, yScale, line;  //Empty, for now

//Function for converting CSV values from strings to Dates and numbers
var rowConverter = function(d) {
  return {
    date: new Date(+d.year, (+d.month - 1)),  //Make a new Date object for each year + month
    average: parseFloat(d.average)  //Convert from string to float
  };
}

//Load in data
d3.csv("../mauna_loa_co2_monthly_averages.csv", rowConverter).then(function(data) {

  var dataset = data;

  //Print data to console as table, for verification
  //console.table(dataset, ["date", "average"]);

  //Create scale functions
  xScale = d3.scaleTime()
           .domain([
            d3.min(dataset, function(d) { return d.date; }),
            d3.max(dataset, function(d) { return d.date; })
          ])
           .range([0, w]);

  yScale = d3.scaleLinear()
          .domain([0, d3.max(dataset, function(d) { return d.average; })])
          .range([h, 0]);

  //Define line generator
  line = d3.line()
        .x(function(d) { return xScale(d.date); })
        .y(function(d) { return yScale(d.average); });
  
  //Create SVG element
  var svg = d3.select("body")
        .append("svg")
        .attr("width", w)
        .attr("height", h)
        .attr("fill","none").attr("stroke","blue");

  //Create line
  svg.append("path")
    .datum(dataset)
    .attr("class", "line")
    .attr("d", line);

});