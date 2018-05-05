(function(){
  var rowConverter = function(d) {
    return {
      "borough": d["Borough"],
      "neighborhood": d["Neighborhood"],
      "building": d["Building Class Category"],
      "price": parseFloat(d["Sale Price($M)"])
    };
  }

// Open the csv
  d3.csv("nyc_sales_detailed.csv", rowConverter, function(data){
    function findAverages(data) {
      var amounts = d3.nest()
                .key(function(d){ return d.neighborhood;})
                .entries(data)
      var totals = d3.nest()
                .key(function(d){ return d.neighborhood;})
                .rollup(function(d){
                  return d3.sum(d, function(e){
                    return e.price;
                  })
                })
                .entries(data)
        for(var j = 0; j<totals.length; j++) {
          totals[j].value = totals[j].value/amounts[j].values.length
          }

        return totals
      };
      averages = findAverages(data);
// create map svg
    var map_width = 900,
        map_height = 900;

    var map_margin = {
      top: 20,
      left: 20,
      right: 20,
      bottom: 20
    };
    var map_svg = d3.select("#vis4").append("svg")
        .attr("width", map_width)
        .attr("height", map_height)
        .append("g")
        .attr('transform','translate(' + map_margin.left + ',' + map_margin.top +')');

    map_width = map_width - map_margin.left - map_margin.right;
    map_height = map_height - map_margin.top - map_margin.bottom;

    var color = d3.scaleQuantize()
      .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);


    var projection = d3.geoMercator()
      .center([-73.94, 40.70])
      .scale(50000)
      .translate([map_width / 3, map_height / 3]);


    var path = d3.geoPath()
      .projection(projection);
      var g = map_svg.append("g")
          .attr("class", "key")
          .attr("transform", "translate(0,180)");


    var x = d3.scaleLinear()
    .domain([1, 5])
    .rangeRound([220, 980]);

    var tooltip = map_svg
      .append("text")
      .attr("class", "tooltip")
      .style("opacity", 0);

    g.selectAll("rect")
      .data(color.range().map(function(d) {
          d = color.invertExtent(d);
          if (d[0] == null) d[0] = x.domain()[0];
          if (d[1] == null) d[1] = x.domain()[1];
          return d;
        }))
      .enter().append("rect")
        .attr("height", 12)
        .attr("x", function(d) { return x(d[0]); })
        .attr("width", function(d) { return x(d[1]) - x(d[0]); })
        .attr("fill", function(d) { return color(d[0]); });

    d3.json("nyc-pediacities-neighborhoods-polygon-v2.geo.geojson", function(error, nyc) {
      if (error) return console.error(error);

map_neighborhoods = []
data_neighborhoods = []
      for (var i = 0; i < averages.length; i++) {
          var dataNeighborhood = averages[i].key;
          data_neighborhoods.push(averages[i].key)
          var dataValue = (+averages[i].value);

          for(var j = 0; j < nyc.features.length; j++) {

            var jsonNeighborhood = nyc.features[j].properties.neighborhood;


            if (dataNeighborhood == jsonNeighborhood) {
              nyc.features[j].properties.value = dataValue;

              break;
            }

          }
        }
for (var i=0;i<nyc.features.length;i++) {
  map_neighborhoods.push(nyc.features[i].properties.neighborhood)
}
// console.log(map_neighborhoods)
// console.log(data_neighborhoods)
matched_neighborhoods = []
unmatched_neighborhoods = []
for (var i=0;i<map_neighborhoods.length; i++) {
  if (data_neighborhoods.includes(map_neighborhoods[i]) == true) {
    matched_neighborhoods.push(map_neighborhoods[i])
  } else {
  unmatched_neighborhoods.push(map_neighborhoods[i])
  }
};
// console.log(matched_neighborhoods)
// console.log(unmatched_neighborhoods)
        value_array = []
        for(var i = 0; i< nyc.features.length; i++) {
          value_array.push(nyc.features[i].properties.value)
        }
        color.domain([d3.min(value_array), d3.max(value_array)]);

      map_svg.selectAll("path")
        .data(nyc.features)
        .enter()
          .append("path")
          .attr('id', function(d, i) { return d.properties.neighborhood})
          .style('fill', function(d) {
                  var value = d.properties.value;

                  if(value) {
                    return color(value);
                  } else {
                    return '#ccc';
                  }
                })
          .attr('data-value', function(d) { return d.properties.value})
          .attr('stroke', 'black')
          .attr('stroke-width', '0.5px')
          .attr("d", path)
          .on("mouseover", function(d) {
                let this_value = d.properties.value;
                  tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                    d3.select(this).attr('fill', 'steelblue');
                  tooltip.text(d.properties.neighborhood)
                    .style("x", 200 +"px")
                    .style("y", - 228 + "px");

              })
              .on("mouseout", function(d) {
                d3.select(this).style('fill', function(d) {
                        var value = d.properties.value;

                        if(value) {
                          return color(value);
                        } else {
                          return '#ccc';
                        }
                      })
                tooltip.transition()
                  .duration(500)
                  .style("opacity", 0);
              });

        });
      });

    })();
