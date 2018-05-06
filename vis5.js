(function(){
  var rowConverter1 = function(d) {
    return {
      "Job Title": d["Job Title"],
      "Level": d["Level"],
      "Annual Mean": parseFloat(+d["Annual Mean"].split(',').join('')),
      "Group": d["Group"]
    };
  }
  var rowConverter = function(d) {
    return {
      "borough": d["Borough"],
      "neighborhood": d["Neighborhood"],
      "building": d["Building Class Category"],
      "price": parseFloat(d["Sale Price($M)"])
    };
  }
// Open the first csv
  d3.csv("nyc_salary.csv", rowConverter1, function(data){
    // Jobs Dropdowns
    // jobs_containter.style.display = 'none';
    var nested_jobs = d3.nest()
              .key(function(d){ return d.Group;})
              .entries(data)

    var job_salary;

    mortgage_btn.style.display = 'none';
    main_job_btn.style.display = 'none';
    job_btn.style.display = 'none';
    explanation.style.display = 'none';
    for (let i=0; i < nested_jobs.length; i++) {
      let menuItem1 = document.createElement("li");
      menuItem1.appendChild(document.createTextNode(nested_jobs[i].key));
      document.getElementById("dropdown4").appendChild(menuItem1);
      menuItem1.addEventListener("click", function(){
        job_btn.style.display = 'block';
        job_btn.innerHTML = nested_jobs[i].key;
        second_jobs_dropdown(nested_jobs[i].values)
        salary.style.display = 'none';
      });
    }

    function second_jobs_dropdown(group) {
      myNode1 = document.getElementById("dropdown5")
      while (myNode1.firstChild) {
          myNode1.removeChild(myNode1.firstChild);
          }
      for (let i=0; i < group.length; i++) {
        let menuItem2 = document.createElement("li");
        menuItem2.appendChild(document.createTextNode(group[i]['Job Title']));
        document.getElementById("dropdown5").appendChild(menuItem2);
        menuItem2.addEventListener("click", function(){
          salary.style.display = 'block';
          group1 = group[i]['Job Title']
          job_salary = group[i]["Annual Mean"];
          document.getElementById("salary").innerHTML = group1 + " Average Salary: $" + d3.format(",")(job_salary);
          mortgage_btn.style.display = 'block';
        });
      }
    }
    d3.csv("nyc_sales_detailed.csv", rowConverter, function(data){
      // Cities dropdown
      var totals = d3.nest()
                .key(function(d){ return d.borough;})
                .rollup(function(d){
                  return d3.mean(d, function(e){
                    return e.price;
                  })
                })
                .entries(data)

        var neighborhoods = d3.nest()
                  .key(function(d){ return d.borough;})
                  .key(function(d){ return d.neighborhood})
                  .rollup(function(d){
                    return d3.mean(d, function(e){
                      return e.price;
                    })
                  })
                  .entries(data)
      var new_array = {}
      new_array['key'] = 'All Boroughs'
      new_array['values'] = totals
      neighborhoods.push(new_array)

      var house_price;

      city_btn.style.display = 'none';

      for (let i=0; i < neighborhoods.length; i++) {
        let menuItem = document.createElement("li");
        menuItem.appendChild(document.createTextNode(neighborhoods[i].key));
        document.getElementById("dropdown2").appendChild(menuItem);
        menuItem.addEventListener("click", function(){
          city_btn.style.display = 'block';
          city_btn.innerHTML = neighborhoods[i].key;
          second_cities_dropdown(neighborhoods[i].values);
          price.style.display = 'none';
        });
      }
      function second_cities_dropdown(borough) {
        myNode = document.getElementById("dropdown3")
        while (myNode.firstChild) {
            myNode.removeChild(myNode.firstChild);
            }
        for (let i=0; i < borough.length; i++) {
          let menuItem3 = document.createElement("li");
          menuItem3.appendChild(document.createTextNode(borough[i].key));
          document.getElementById("dropdown3").appendChild(menuItem3);
          menuItem3.addEventListener("click", function(){
            group = borough[i].key
            document.getElementById("price").innerHTML = group + " Average House Price: $" + d3.format(".2f")(borough[i].value) + " Million";
            price.style.display = 'block';
            house_price = borough[i].value * 1000000;
            main_job_btn.style.display = 'block';
          });
        }
      }
      document.getElementById('mortgage_btn').addEventListener("click", function() {
        calculate_mortgage(job_salary, house_price)
      })
      function calculate_mortgage(salary, price) {
        explanation.style.display = 'block';
        small_downpayment = Math.floor(price - (price * .035));
        document.getElementById('small_downpayment').innerHTML = "Mortgage amount with a small downpayment: $" + d3.format(",")(small_downpayment);
        big_downpayment = Math.floor(price - (price * .2));
        document.getElementById('big_downpayment').innerHTML = "Mortgage amount with a big downpayment: $" + d3.format(",")(big_downpayment);
        payment = (salary * .28)/12;
        document.getElementById('payment').innerHTML = "Monthly mortgage payment: $" + d3.format(",")(payment);
        small_years = small_downpayment/(payment*12);
        document.getElementById('small_years').innerHTML = "Years to pay off mortgage with a small downpayment: " + Math.floor(small_years);
        big_years = big_downpayment/(payment*12);
        document.getElementById('big_years').innerHTML = "Years to pay off mortgage with a big downpayment: " + Math.floor(big_years);
        mortgage_cap = salary * 3;
        if (mortgage_cap > small_downpayment) {
          document.getElementById('small_mortgage').innerHTML = "You can get a mortgage with a small downpayment. Hooray!";
        } else {
          document.getElementById('small_mortgage').innerHTML = "You likely can't get a mortgage with a small downpayment. Is this why people get married?";
        };
        if (mortgage_cap > big_downpayment) {
          document.getElementById('big_mortgage').innerHTML = "You can get a mortgage with a big downpayment. Good for you.";
        } else {
          document.getElementById('big_mortgage').innerHTML = "You likely can't get a mortgage with a big downpayment.";
        };
      }


    });
  });
})();
