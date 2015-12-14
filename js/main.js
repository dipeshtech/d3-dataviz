/*
US Flight Delay time visualization.
Author: @dipeshtech

Built with D3.JS and Dimple.JS
*/

var svgLine = dimple.newSvg("#chartContainer", 590, 400);
var svgHist = dimple.newSvg("#hourBar", 590, 400);
var svgHistCount = dimple.newSvg("#hourNumberOfFlights", 590, 400);


var monthArray = ["Jan", "Feb", "March", "Apr", "May", "June", "July",
                  "Ago", "Sep", "Oct", "Nov", "Dec"];

var monthMap = {1:"Jan", 2:"Feb", 3:"March", 4:"Apr",
                5:"May", 6:"June", 7:"July", 8:"Ago",
                9:"Sep", 10:"Oct", 11:"Nov", 12:"Dec"};


// Variables to build visualization
var hours = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12',
              '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
  days = [
    { name: 'Monday', abbr: 'Mo' },
    { name: 'Tuesday', abbr: 'Tu' },
    { name: 'Wednesday', abbr: 'We' },
    { name: 'Thursday', abbr: 'Th' },
    { name: 'Friday', abbr: 'Fr' },
    { name: 'Saturday', abbr: 'Sa' },
    { name: 'Sunday', abbr: 'Su' }
  ];


// Read the CSV
d3.csv("data/2008-DateTime.csv", function(error, flights) {


  flights.forEach(function(d, i) {
    var dateArray = d.DateTime.split("-");
    d.dt = new Date(dateArray[0], dateArray[1], dateArray[2], dateArray[3]);

    d.index = i;

    // We actually get all the hour, day of week, month and year from
    // the DateTime object because the original columns from the CSV data
    // get aggregated from pandas
    d.Time = +d.dt.getHours();
    d.DayOfWeek = +d.dt.getDay();
    d.Month = +d.dt.getMonth();
    d.Year = +d.dt.getFullYear();
    d.TimeDay = d.DayOfWeek + "-" + d.Time;

    // Given that processed data already averaged DepDelay by DateTime,
    // I had to include count to do a weighted mean.
    d.DepDelay = +d.DepDelay;
    d.Count = +d.count;
    d.DepDelayTotal = d.DepDelay * d.Count;

    
  });


  flights = flights.filter(function(d) {
    if(isNaN(d.Time)){
        return false;
    }
    d.Time = parseInt(d.Time);
    return true;
  });

  /**********************************************************************/

  // group data by month.
  var flightsByMonth = d3.nest()
                          .key(function(d) { return d.Month; })
                          .rollup(function(d) {
                            return {
                              Month: d3.mean(d, function(g) {
                                if (g.Month == 0) {
                                  return 12;
                                } else {
                                  return g.Month;
                                }
                                }),
                              DepDelay: d3.sum(d, function(g) { return g.DepDelayTotal; }) / d3.sum(d, function(g) { return g.Count; })
                            }
                          })
                          .entries(flights);



  // The nested operation gives back a list of objects that contain inside them
  // a values object, which is what we actually want.
  for (var i = 0; i < flightsByMonth.length; i++){
    flightsByMonth[i] = flightsByMonth[i].values;
    flightsByMonth[i].MonthName = monthMap[flightsByMonth[i].Month];
  }


  /**********************************************************************/

  // A nest operator, for grouping the flight list into the newly created
  // variable, TimeDay, which is basically a Day of Week (0-6) together with
  // the hour of day (0-23).
  var flightsByHourDay = d3.nest()
                  .key(function(d) { return d.TimeDay; })
                  .rollup(function(d) {
                    var result = {
                      "DepDelay": d3.sum(d, function(g) { return g.DepDelayTotal; }) / d3.sum(d, function(g) { return g.Count; }),
                      "Time": d3.mean(d, function(g) { return g.Time;}),
                      "DayOfWeek": d3.mean(d, function(g) { return g.DayOfWeek;})
                    };
                    return result;
                  })
                  .entries(flights);


  // The nested operation gives back a list of objects that contain inside them
  // a values object, which is actually what we want.
  for (var i = 0; i < flightsByHourDay.length; i++){
    flightsByHourDay[i] = flightsByHourDay[i].values;
  }

  /**********************************************************************/

  // A nest operator, for grouping the flight list into the newly created
  // variable, TimeDay, which is basically a Day of Week (0-6) together with
  // the hour of day (0-23).
  var flightsByHour = d3.nest()
                  .key(function(d) { return d.Time; })
                  .rollup(function(d) {
                    var result = {
                      "DepDelay": d3.sum(d, function(g) { return g.DepDelayTotal; }) / d3.sum(d, function(g) { return g.Count; }),
                      "Time": d3.mean(d, function(g) { return g.Time;}),
                      "DayOfWeek": d3.mean(d, function(g) { return g.DayOfWeek;}),
                      "Count": d3.sum(d, function(g) {return g.Count; } )
                    };
                    return result;
                  })
                  .entries(flights);


  // The nested operation gives back a list of objects that contain inside them
  // a values object, which is actually what we want.
  for (var i = 0; i < flightsByHour.length; i++){
    flightsByHour[i] = flightsByHour[i].values;
  }

  /**********************************************************************/

  // Average delay time Bar chart
  var bar = new dimple.chart(svgHist, flightsByHour);
  bar.setBounds(60, 30, 510, 305);
  var x = bar.addCategoryAxis("x", "Time");
  x.addOrderRule("Time");
  var y = bar.addMeasureAxis("y", "DepDelay");
  var s = bar.addSeries(null, dimple.plot.bar);
  s.aggregate = dimple.aggregateMethod.avg;
  bar.draw();

  // Added Improvement
  x.titleShape.text("By hour of day (24-hour clock)");
  y.titleShape.text("Average departure delay time (minutes)");

  s.getTooltipText = function (e) {
                return [
                    "" + Math.round(e.y) + " min",
                ];
            };

  // Want to give special focus on hours which
  // have highest delay time. Added as an improvement
  var barFocus = d3.select("#hourBar")
                   .selectAll("rect")
                   .attr("fill", function(d) {
                        if (d.height > 40) {
                            return "#D53E4F";
                          }
                        else {
                          return "#3288BD";
                          }
                     });
    
    
  /**********************************************************************/

  // Number of flights Bar chart
  var barCount = new dimple.chart(svgHistCount, flightsByHour);
  barCount.setBounds(60, 30, 510, 305);
  var xCount = barCount.addCategoryAxis("x", "Time");
  xCount.addOrderRule("Time");
  var yCount = barCount.addMeasureAxis("y", "Count");
  var sCount = barCount.addSeries(null, dimple.plot.bar);
  sCount.aggregate = dimple.aggregateMethod.avg;

  barCount.draw();

  //Added Improvement
  xCount.titleShape.text("By hour of day (24-hour clock)");
  yCount.titleShape.text("Volume of flights");

  sCount.getTooltipText = function (e) {
               return [
                   "" + Math.round(e.y) + " flights",
               ];
           };

  // Want to give special focus on hours which
  // have highest delay time.
  var barFocusCount = d3.select("#hourNumberOfFlights")
                  .selectAll("rect")
                  .attr("fill", function(d) {
                       if (d.height < 50000) {
                           return "#D53E4F";
                         }
                       else {
                         return "#3288BD";
                         }
                    });

 /**********************************************************************/

  // Line chart
  var lineChart = new dimple.chart(svgLine, flightsByMonth);
  lineChart.setBounds(60, 30, 505, 305);
  var lineX = lineChart.addCategoryAxis("x", "MonthName");
  lineX.addOrderRule(monthArray);
  var lineY = lineChart.addMeasureAxis("y", "DepDelay");
  lineChart.addSeries(null, dimple.plot.line);
  var dots = lineChart.addSeries(null, dimple.plot.scatter);

  lineChart.draw();

  //Added Improvement
  lineX.titleShape.text("Month of Year");
  lineY.titleShape.text("Average departure delay time (minutes)");

  // Change colors of months with higher average delay time than 40 minutes
  var lineFocus = d3.select("#chartContainer")
                   .selectAll("circle")
                   .attr("fill", function(d) {
                        if (d.height > 9) {
                            return "#D53E4F";
                          }
                        else {
                          return "#3288BD";
                          }
                     });

  // Improve tooltip's content for line chart.
 dots.getTooltipText = function (e) {
               return [
                   "" + Math.round(e.y) + " min",
               ];
           };

 /**********************************************************************/


  // Call the function to build the tiles.
  createTiles();

  var colorPalette = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  // Calculate min-max to use with D3.js scale
  var min = d3.min(flightsByHourDay, function (d) { return d.DepDelay; });
  var max = d3.max(flightsByHourDay, function (d) { return d.DepDelay; });
  var bucket = d3.scale.quantize().domain([15, 80]).range(colorPalette);

  // This loop assigns the CSS classes to each tile so as to assign it
  // an appropriate color based on the `bucket` scaling domain-range relation.
  for (var i=0; i < flightsByHourDay.length; i++) {

    var f = flightsByHourDay[i];

    var delay = f.DepDelay;
    var color = bucket(delay);

    d3.select("#d" + f.DayOfWeek + "h" + f.Time + " .tile .front")
        .classed('q' + color + '-' + colorPalette.length, true)
        .attr('delay', function(){ return delay })
        .attr('data-toggle', 'tooltip')
        .attr('title', Math.round(delay) + ' min');
  }

    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    });

  /**********************************************************************/


});