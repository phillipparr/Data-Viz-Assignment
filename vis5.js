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
  var nested_jobs = d3.nest()
            .key(function(d){ return d.Group;})
            .entries(data)

//Dropdown change function
    for (let i=0; i < nested_jobs.length; i++) {
      let menuItem = document.createElement("li");
      menuItem.appendChild(document.createTextNode(nested_jobs[i].key));
      document.getElementById("dropdown").appendChild(menuItem);
      // menuItem.addEventListener("click", function(){
      //   group = nested_jobs[i].key
      //   document.getElementById("title").innerHTML = group
      //   bar_chart(group, );
      // });
    }

    var job_titles = []
    function major_job_titles(d) {
      for(var i=0; i<d.length; i++) {
        if(d[i].Level == 'total') {
          job_titles.push(d[i])
        }
        else if(d[i].Level == "major") {
        job_titles.push(d[i])
        }
      }
    }
    major_job_titles(data);
    console.log(job_titles)
    console.log(job_titles.map(function (d){ return d['Job Title']; }))


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

// console.log(nested_jobs.map(function(d) { return d.key}))


    function bar_chart(job_group, group_data) {
      function job_list(job_group) {
        job_list = []
        group = []
        for (var i = 0; i<nested_jobs.length; i++) {
          if (nested_jobs[i].key == job_group) {
            group.push(nested_jobs[i].values)
            one = nested_jobs[i].values
            for (var i = 0; i<one.length; i++) {
                job_list.push(one[i]['Job Title'])
              }
            }
          }
          return job_list
        }
    function annual_means(job_group) {
      group = []
      annual_means = []
      for (var i = 0; i<nested_jobs.length; i++) {
        if (nested_jobs[i].key == job_group) {
          group.push(nested_jobs[i].values)
          one = nested_jobs[i].values
          for (var i = 0; i<one.length; i++) {
              annual_means.push(one[i]['Annual Mean'])
            }
          }
        }
        return annual_means
    }
      means = annual_means(job_group)
      console.log(means)
      console.log(d3.max(means))
      y_scale.domain(function(d) {return job_list(job_group)});
      x_scale.domain([0, d3.max(means)]);


      var bars = svg.selectAll('.bar')
        .data(group_data)

      var new_bars = bars
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('fill', 'rgb(152, 171, 197)')
        .attr('width', '10px')
      //   .on("mouseover", function(d) {
      //         tooltip.transition()
      //           .duration(200)
      //           .style("opacity", .9);
      //         tooltip.text("$"+d3.format(",")(d['Annual Mean']))
      //           .attr("x",  x_scale(d['Annual Mean']) + 40 + "px")
      //           .attr("y", y_scale(d["Job Title"]) + y_scale.bandwidth() - 3 + "px");
      //       })
      //       .on("mouseout", function(d) {
      //         tooltip.transition()
      //           .duration(500)
      //           .style("opacity", 0);
      // });


      new_bars.merge(bars)
        .attr('width', console.log(x_scale(group_data['Annual Mean'])), function(d) {return x_scale(group_data['Annual Mean'])})
        .attr('height', function(d) {return y_scale.bandwidth()})
        .attr('x', 0)
        .attr('y', function(d) {return y_scale(group_data["Job Title"])});

      svg.select('.x.axis')
        .call(x_axis);

      svg.select('.y.axis')
        .call(y_axis)
    }

    bar_chart("Major Group", job_titles);
  });

})();
