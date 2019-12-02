function buildMetadata(sample) {
  // @TODO: Complete the following function that builds the metadata panel
  url = `/metadata/${sample}`;
  // Use d3 to select the panel with id of `#sample-metadata`
  var panelMetaData = d3.select("#sample-metadata");
  // Use `.html("") to clear any existing metadata
  panelMetaData.html("");
  // Use `Object.entries` to add each key and value pair to the panel
  // Hint: Inside the loop, you will need to use d3 to append new
  // tags for each key-value in the metadata.
  // Use `d3.json` to fetch the metadata for a sample
  d3.json(url).then(function(data){
    Object.entries(data).forEach(([key, value])=>{
      var newTag = panelMetaData.append("p3");
      newTag.text(`${key}: ${value}`);
      panelMetaData.append("br");
    });
  })
}

function buildCharts(sample) {
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = `/samples/${sample}`;
  d3.json(url).then(function (data) {
    // store all dictionary data intpo a list 
    var newData = [];
    count = data.sample_values.length;
    
    for (i=0; i<count; i++){
      var eachData = {};
      Object.entries(data).forEach(([key, value])=>{
        eachData[key] = value[i];
      });
      newData.push(eachData);
    };


      // sort all values and slice to get top 10
      newData.sort(function(a, b){
        return parseFloat(b.sample_values) - parseFloat(a.sample_values)
      });
      newData = newData.slice(0,10);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var pieChartData = [{
      values: newData.map(cell => cell.sample_values),
      labels: newData.map(cell => cell.otu_ids),
      type: "pie",
    }];

    var layout = {
      title: "Top 10 Samples",
      showlegend: true,
      height: 600,
      width: 600
    };
    Plotly.newPlot("pie", pieChartData, layout);
    
  // @TODO: Build a Bubble Chart using the sample data
    var bubbleData = {
      x: data.otu_ids,
      y: data.sample_values,
      mode: "markers",
      text: data.otu_labels,
      marker: {
        color: data.otu_ids,
        size: data.sample_values,
        colorscale: "Earth"
      }
    };
    var bubbleData = [bubbleData];
    var layout = {
      showlegend: false,
      height: 650,
      width: 1500
    };

    Plotly.newPlot("bubble", bubbleData, layout);
    })
  }

  
function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();

 
