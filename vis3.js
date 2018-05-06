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
    var amounts = d3.nest()
              .key(function(d){ return d["borough"];})
              .entries(data)
    for(var j = 0; j<amounts.length; j++) {
      amounts[j].values = amounts[j].values.length
      }
    // console.log(amounts)

    var width = 600;
    var height = 600;
    var radius = Math.min(width, height) / 3;

    var margin = {
      top: 250,
      left: 350,
      bottom: 50,
      right: 50
    }

    var color = d3.scaleOrdinal()
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    var arc = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(radius - 70);

    var pie = d3.pie()
        .sort(null)
        .value(function(d) { return d.values; });

// console.log(pie(amounts))

    var svg = d3.select("#vis3")
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top +')');

    width = width - margin.left - margin.right;
    height = height - margin.top - margin.bottom;
      // .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


    var textg = svg.append("g")
        .attr("class", "text-group")

    textg.append("text")
      .attr("class", "name-text")
      .attr('dx', '-30px');

    textg.append("text")
      .attr("class", "value-text")
      .attr('dy', '20px')
      .attr('dx', '-25px');


    let g = svg.selectAll(".arc")
        .data(pie(amounts))
      .enter().append("g")
        .attr("class", "arc");



    g.append("path")
        .attr("d", arc)
        .style("fill", function(d) { return color(d.data.key); })
        .on("mouseover", function(d) {

          d3.select(this).style("fill", "#d0743c");

          svg.select('.text-group')
            .style('opacity', 1);

          svg.select('.name-text')
            .text(d.data.key);

          svg.select('.value-text')
            .text(d.data.values);

    })
        .on("mouseout", function(d) {
          d3.select(this)
            .style("fill", color(d.data.key));

          svg.select('.text-group')
            .style('opacity', 0);
        });

  });

})();
