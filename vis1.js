(function(){
  var rowConverter = function(d) {
    return {
      "Job Title": d["Job Title"],
      "Level": d["Level"],
      "Annual Mean": parseFloat(+d["Annual Mean"].split(',').join('')),
      "Group": d["Group"]
    };
  }
// Open the csv
  d3.csv("nyc_salary.csv", rowConverter, function(data){
    console.log(data)
  var nested_jobs = d3.nest()
            .key(function(d){ return d.Group;})
            .entries(data)
// console.log(nested_jobs)
//Dropdown change function
    for (let i=0; i < nested_jobs.length; i++) {
      let menuItem = document.createElement("li");
      menuItem.appendChild(document.createTextNode(nested_jobs[i].key));
      document.getElementById("dropdown").appendChild(menuItem);
      menuItem.addEventListener("click", function(){
        group = nested_jobs[i].key
        document.getElementById("title").innerHTML = group
        bar_chart(nested_jobs[i].values);
      });
    }

    var width = 900;
    var height = 600;

    var margin = {
      top: 20,
      left: 350,
      bottom: 50,
      right: 50
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
      .paddingInner(0.1);


    var x_scale = d3.scaleLinear()
      .range([0, width])

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
            .attr("y", -338)
            .attr("x",-250)
            .text("Job Group");

      svg.append("text")
                  .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
                  .attr('y', 565)
                  .attr("x", 120)
                  .text("Salary ($)");

    var tooltip = svg
      .append("text")
      .attr("class", "tooltip")
      .style("opacity", 0);



    function bar_chart(group_data) {

      y_scale.domain(group_data.map(function (d){ return d['Job Title']; }))
      x_scale.domain([0, d3.max(group_data, function(d){return d['Annual Mean']})]);


      var bars = svg.selectAll('.bar')
        .data(group_data)

      bars
        .exit()
        .remove();

      var new_bars = bars
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('fill', 'rgb(152, 171, 197)')
        .style('opacity', .7)
        .on("mouseover", function(d) {
              tooltip.transition()
                .duration(200)
                .style("opacity", 1);
              tooltip.text("$"+d3.format(",")(d['Annual Mean']))
                .attr("x",  x_scale(d['Annual Mean']) + 20 + "px")
                .attr("y", y_scale(d["Job Title"]) + y_scale.bandwidth() - 1 + "px");
            })
            .on("mouseout", function(d) {
              tooltip.transition()
                .duration(500)
                .style("opacity", 0);
      });


      new_bars.merge(bars)
        .attr('width',  function(d) {return x_scale(d['Annual Mean'])})
        .attr('height', function(d) {return y_scale.bandwidth()})
        .attr('x', 0)
        .attr('y', function(d) {return y_scale(d["Job Title"])});

      svg.select('.x.axis')
        .call(x_axis);

      svg.select('.y.axis')
        .call(y_axis)
    }
    values = nested_jobs[0].values

    bar_chart(values);
  });

})();
