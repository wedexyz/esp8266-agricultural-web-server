
  var ADCvalues = [];
  var Tvalues = [];
  var Hvalues = [];
  var Gvalues = [];
  var Mvalues = [];
  var Ivalues = [];
  var Bvalues = [];
  var timeStamp = [];
  function showGraph()
  {
      var ctx = document.getElementById("Chart").getContext('2d');
      var Chart2 = new Chart(ctx, {
          type: 'line',
          data: {
              labels: timeStamp,  //Bottom Labeling
              datasets: [{
                  label: "Kelembapan",
                  fill: true,  //Try with true
                  backgroundColor: 'rgb(59, 182, 240', //Dot marker color
                  borderColor: 'rgb(59, 182, 240', //Graph Line Color
                  data: ADCvalues,
              },{
                  label: "Temperature",
                  fill: false,  //Try with true
                  backgroundColor: 'rgb(213, 240, 59)', //Dot marker color
                  borderColor: 'rgb(213, 240, 59)', //Graph Line Color
                  data: Tvalues,
              },
              {
                  label: "Humidity",
                  fill: false,  //Try with true
                  backgroundColor: 'rgb(6, 95, 14)', //Dot marker color
                  borderColor: 'rgb(6, 95, 14)', //Graph Line Color
                  data: Hvalues,
              },
              {
                  label: "GAS",
                  fill: false,  //Try with true
                  backgroundColor: 'rgb(49, 44, 41)', //Dot marker color
                  borderColor: 'rgb(49, 44, 41)', //Graph Line Color
                  data: Gvalues,
              },
              {
                  label: "RED",
                  fill: false,  //Try with true
                  backgroundColor: 'rgba( 243,18, 156 , 1)', //Dot marker color
                  borderColor: 'rgba( 243,18, 156 , 1)', //Graph Line Color
                  data: Mvalues,
              },
              {
                  label: "GREEN",
                  fill: false,  //Try with true
                  backgroundColor: 'rgb(18, 243, 37)', //Dot marker color
                  borderColor: 'rgb(18, 243, 37)', //Graph Line Color
                  data: Ivalues,
              },
              {
                  label: "BLUE",
                  fill: false,  //Try with true
                  backgroundColor: 'rgb(33, 18, 243)', //Dot marker color
                  borderColor: 'rgb(33, 18, 243)', //Graph Line Color
                  data: Bvalues,
              }

            
            ],
          },
          options: {
              title: {
                      display: true,
                      text: "PLANT MONITORING"
                  },
              maintainAspectRatio: false,
              elements: {
              line: {
                      tension: 0.5 //Smoothening (Curved) of data lines
                  }
              },
              scales: {
                      yAxes: [{
                          ticks: {
                              beginAtZero:true
                          }
                      }]
              }
          }
      });
  
  }
  
  
  window.onload = function() {
    console.log(new Date().toLocaleTimeString());
  };
  
  
  setInterval(function() {
  
    getData();
  }, 1000); 
   
  function getData() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
       //Push the data in array
    var time = new Date().toLocaleTimeString();
    var txt = this.responseText;
    var obj = JSON.parse(txt); 
        ADCvalues.push(obj.ADC);
        Tvalues.push(obj.Temperature);
        Hvalues.push(obj.Humidity);
        Gvalues.push(obj.GAS);
        Mvalues.push(obj.MERAH);
        Ivalues.push(obj.HIJAU);
        Bvalues.push(obj.BIRU);
        timeStamp.push(time);
        showGraph(); 
      var table = document.getElementById("dataTable");
      var row = table.insertRow(1); 
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);
      var cell4 = row.insertCell(3);
      var cell5 = row.insertCell(4);
      var cell6 = row.insertCell(5);
      var cell7 = row.insertCell(6);
      var cell8 = row.insertCell(7);

      cell1.innerHTML = time;
      cell2.innerHTML = obj.ADC;
      cell3.innerHTML = obj.Temperature;
      cell4.innerHTML = obj.Humidity;
      cell5.innerHTML = obj.GAS;
      cell6.innerHTML = obj.MERAH;
      cell7.innerHTML = obj.HIJAU;
      cell8.innerHTML = obj.BIRU;
      segDisplay.value(obj.Temperature);
      gauge.value(obj.Temperature);
      }
    };
    xhttp.open("GET", "readADC", false); 
    xhttp.send();
  }

 var svg = d3.select("#speedometer")
          .append("svg:svg")
          .attr("width", 400)
          .attr("height", 400);

  var gauge = iopctrl.arcslider()
          .radius(120)
          .events(false)
          .indicator(iopctrl.defaultGaugeIndicator);
  gauge.axis().orient("in")
          .normalize(true)
          .ticks(12)
          .tickSubdivide(3)
          .tickSize(10, 8, 10)
          .tickPadding(5)
          .scale(d3.scale.linear()
                  .domain([0, 160])
                  .range([-3*Math.PI/4, 3*Math.PI/4]));

  var segDisplay = iopctrl.segdisplay()
          .width(80)
          .digitCount(6)
          .negative(false)
          .decimals(0);

  svg.append("g")
          .attr("class", "segdisplay")
          .attr("transform", "translate(130, 200)")
          .call(segDisplay);

  svg.append("g")
          .attr("class", "gauge")
          .call(gauge);
  
