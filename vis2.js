(function(){
  var rowConverter = function(d) {
    return {
      "borough": d["Borough"],
      "neighborhood": d["Neighborhood"],
      "building": d["Building Class Category"],
      "price": parseFloat(d["Sale Price($M)"])
    };
  }

  d3.csv("nyc_sales_detailed.csv", rowConverter, function(data){

    function findAverages(data) {
      var amounts = d3.nest()
                .key(function(d){ return d["borough"];})
                .entries(data)

      var totals = d3.nest()
                .key(function(d){ return d.borough;})
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
      totals = findAverages(data);

      var width = 700;
      var height = 500;

      var margin = {
        top: 20,
        left: 150,
        bottom: 50,
        right: 100
      }

      var svg = d3.select("#vis2")
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top +')');

      width = width - margin.left - margin.right;
      height = height - margin.top - margin.bottom;


      var y_scale = d3.scaleBand()
        .range([height,0])
        .domain(totals.map(function (d){ return d.key; }))
        .paddingInner(0.1);


      var x_scale = d3.scaleLinear()
        .range([0, width])
        .domain([0, d3.max(totals, function(d){return d.value})]);

      var x_axis = d3.axisBottom(x_scale);

      var y_axis = d3.axisLeft(y_scale);

      svg.append('g')
        .attr('transform', 'translate(0, ' + height +')')
        .attr('class','x axis');

      svg.append('g')
        .attr('class', 'y axis');

// Axis labels
    svg.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("y", -110)
            .attr("x",-220)
            .text("Borough");

      svg.append("text")
                  .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
                  .attr("y", 465)
                  .attr("x", 240)
                  .text("Price ($M)");

      var tooltip = svg
        .append("text")
        .attr("class", "tooltip")
        .style("opacity", 0);

      function barChart(totals) {

        var bars = svg.selectAll('.bar')
          .data(totals)

        var new_bars = bars
          .enter()
          .append('rect')
          .attr('class', 'bar')
          .attr('fill', 'rgb(152, 171, 197)')
          .attr('width', '10px')
          .on("mouseover", function(d) {
              console.log(d);
                tooltip.transition()
                  .duration(200)
                  .style("opacity", .9);
                tooltip.text("$"+d3.format(".2f")(d.value) + "M")
                  .attr("x",  x_scale(d.value) + 20 + "px")
                  .attr("y", y_scale(d.key) + y_scale.bandwidth() - 25 + "px");
              })
              .on("mouseout", function(d) {
                tooltip.transition()
                  .duration(500)
                  .style("opacity", 0);
        });

        new_bars.merge(bars)
          .attr('width', function(d) {return x_scale(d.value) })
          .attr('height', function(d) {return y_scale.bandwidth()})
          .attr('x', 0)
          .attr('y', function(d) {return y_scale(d.key)});

        svg.select('.x.axis')
          .call(x_axis);

        svg.select('.y.axis')
          .call(y_axis)
      }

      barChart(totals);

    });




})();
