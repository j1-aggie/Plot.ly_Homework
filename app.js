// Belly button biodiversity

function getPlot(id) {
    // pull data from the json file
    d3.json('/data/samples.json').then((data) => {
        console.log(data)

        var wfreq = data.metadata.map(d => d.wfreq)
        console.log('Washing Freq: ${wfreq}')

        //filter sample values by id
        var samples = data.samples.filter(s => s.id.toString() === id)[0];
        //console.log(samples)

        //getting the top ten
        var samplevalues = samples.sample_values.slice(0, 10).reverse();
        //console.log(samplevalues)

        //getting only top 10 otu ids for the plot OTU and then reversing it.
        var OTU_top = (samples.otu_ids.slice(0, 10)).reverse();
        //console.log(OTU_top)

        //getting the otu id's to the desired form for the plot
        var OTU_id = OTU_top.map(d => "OTU " + d)
        //console.log('OTU IDS: ${OTU_id}')

        //getting the top 10 labels for the plot
        var labels = samples.otu_labels.slice(0, 10);
        console.log('Sample Values: ${samplevalues}')

        var trace = {
            x: samplevalues,
            y: OTU_id,
            text: labels,
            marker: {
                color: 'blue'
            },
            type: "bar",
            orientation: "h",
        };

        // create data variable
        var data = [trace];

        // create layout variable to set plot
        var layout = {
            title: "Top 10 OTU",
            yaxis: {
                tickmode: "linear",
            },
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 30
            }
        };

        // create the bar plot
        Plotly.newPlot("bar", data, layout);


        // bubble chart
        var trace1 = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            },
            text: samples.otu_labels
        };

        // layout for the bubble plot
        var layout_b = {
            xaxis: { title: "OTU ID" },
            height: 600,
            width: 1000
        };

        // creating data variable
        var data1 = [trace1];

        // creating the bubble plot
        Plotly.newPlot("bubble", data1, layout_b);

        // guage chart
        function buildGauge(wfreq) {
            let level = parseFloat(wfreq) * 20;

            let degrees = 180 - level;
            let radius = 0.5;
            let radians = (degrees * Math.Pi) / 180;
            let x = radius * Math.cos(radians);
            let y = radians * Math.sin(radians);
            let mainPath = "M-.0 -0.05 L .0 0.05 L";
            let pathX = String(x);
            let space = " ";
            let pathY = String(y);
            let pathEnd = " Z";
            let path = mainPath.concat(pathX, space, pathY, pathEnd);
            console.log(path);

        }
        var data_g = [
            {
                type: "scatter",
                x: [0],
                y: [0],
                marker: { size: 12, color: "850000" },
                showlegend: false,
                text: level,
                hoverinfo: "text+name"
            },
            {
                values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
                rotation: 90,
                text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
                textinfo: "text",
                textposition: "inside",
                marker: {
                    colors: [
                        "rgba(0,105,11,.5)",
                        "rgba(10,120,22,.5)",
                        "rgba(14,127,0,.5)",
                        "rgba(110,154,22,.5)",
                        "rgba(170,202,42,.5)",
                        "rgba(202,209,95,.5)",
                        "rgba(210,206,145,.5)",
                        "rgba(232,226,202,.5)",
                        "rgba(240, 230,215,.5)",
                        "rgba(255,255,255,0)"
                    ]
                },
                labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
                hoverinfo: "label",
                hole: 0.5,
                type: "pie",
                showlegend: false
            }
        ];
        var layout_g = {
            shapes: [
                {
                    type: "path",
                    path: path,
                    fillcolor: "850000",
                    line: {
                        color: "850000"
                    }
                }
            ],
            title: "Belly Button Washing Frequency <br> Scrubs per Week",
            width: 500,
            height: 500,
            xaxis: {
                zeroline: false,
                showticklabels: false,
                showgrid: false,
                range: [-1, 1]
            },
            yaxis: {
                zeroline: false,
                showticklabels: false,
                showgrid: false,
                range: [-1, 1]
            }
        }
        let GAUGE = document.getElementById("gauge");
        Plotly.newPlot(GAUGE, data_g, layout_g);
    });
}

//create the function to get the necessary data
function getInfo(id) {
    //read the json file to get data
    d3.json("data/samples.json").then((data) => {

        // get the metadata info for the demographic panel
        var metadata = data.metadata;
        console.log(metadata)

        // filter meta data info by id
        var result = metadata.filter(meta => meta.id.toString() === id)[0];

        // select demographic panel to put data
        var demographicInfo = d3.select("#sample-metadata");

        // empty the demographic info panel
        demographicInfo.html("");

        // grab the necessary demographic data
        Object.entries(result).forEach((key) => {
            demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");
        });
    });
}

// create the function for the change event
function optionChanged(id) {
    getPlot(id);
    getInfo(id);
}

// create the function for the initial data
function init() {
    // select dropdown menu
    var dropdown = d3.select("#selDataset");

    //read the data
    d3.json("data/samples.json").then((data) => {
        console.log(data)

        // get the id data to the dropdown menu
        data.names.forEach(function (name) {
            dropdown.append("option").text(name).property("value");
        });

        // call the functions to display the data
        getPlot(data.names[0]);
        getInfo(data.names[0]);

    });
}

init();