(function(){
  var rowConverter = function(d) {
    return {
      "Job Title": d["Job Title"],
      "Level": d["Level"],
      "Annual Mean": parseFloat(+d["Annual Mean"].split(',').join(''))
    };
  }
// Open the csv
  d3.csv("nyc_salary.csv", rowConverter, function(data){
    // console.log(data)
    var job_titles = []
    function major_job_titles(d) {
      for(var i=0; i<d.length; i++) {
        if(d[i].Level == "major") {
        job_titles.push(d[i])
        }
      }
    }
    major_job_titles(data);
    // console.log(job_titles[0])


    var width = 700;
    var height = 500;

    var margin = {
      top: 20,
      left: 250,
      bottom: 50,
      right: 100
    }

    var svg = d3.select("#vis1")
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top +')');

    width = width - margin.left - margin.right;
    height = height - margin.top - margin.bottom;

    var y_scale = d3.scaleBand()
      .range([height,0])
      .domain(job_titles.map(function (d){ return d['Job Title']; }))
      .paddingInner(0.1);


    var x_scale = d3.scaleLinear()
      .range([0, width])
      .domain([0, d3.max(job_titles, function(d){return d['Annual Mean']})]);

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
            .attr("y", -210)
            .attr("x",-220)
            .text("Job Group");

      svg.append("text")
                  .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
                  .attr('y', 465)
                  .attr("x", 220)
                  .text("Salary ($)");

    var tooltip = svg
      .append("text")
      .attr("class", "tooltip")
      .style("opacity", 0);

    function barChart(job_titles) {

      var bars = svg.selectAll('.bar')
        .data(job_titles)

      var new_bars = bars
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('fill', 'rgb(152, 171, 197)')
        .attr('width', '10px')
        .on("mouseover", function(d) {
              tooltip.transition()
                .duration(200)
                .style("opacity", .9);
              tooltip.text("$"+d3.format(",")(d['Annual Mean']))
                .attr("x",  x_scale(d['Annual Mean']) + 40 + "px")
                .attr("y", y_scale(d["Job Title"]) + y_scale.bandwidth() - 3 + "px");
            })
            .on("mouseout", function(d) {
              tooltip.transition()
                .duration(500)
                .style("opacity", 0);
      });


      new_bars.merge(bars)
        .attr('width', function(d) {return x_scale(d['Annual Mean'])})
        .attr('height', function(d) {return y_scale.bandwidth()})
        .attr('x', 0)
        .attr('y', function(d) {return y_scale(d["Job Title"])});

      svg.select('.x.axis')
        .call(x_axis);

      svg.select('.y.axis')
        .call(y_axis)
    }

    barChart(job_titles);
  });

})();
