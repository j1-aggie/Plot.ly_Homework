// Belly button biodiversity

function getPlot(id) {
    // pull data from the json file
    d3.json('data/samples.json').then((data) => {
        console.log(data)

        //var wfreq = data.metadata.map(d => d.wfreq)
        //console.log('Washing Freq: ${wfreq}')

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

            // guage chart
            var wfreqDefault = result.wfreq;
            var data_g = [
                {
                    domain: { x: [0, 1], y: [0, 1] },
                    value: wfreqDefault,
                    title: { text: 'Weekly Washing Frequency' },
                    delta: { reference: 9, increasing: { color: "red" } },
                    type: "indicator",
                    mode: "gauge+delta+number",
                    gauge: {
                        axis: { range: [null, 9] },
                        steps: [
                            { range: [0, 1], color: "yellow" },
                            { range: [1, 2], color: "red" },
                            { range: [2, 3], color: "brown" },
                            { range: [3, 4], color: "blue" },
                            { range: [4, 5], color: "purple" },
                            { range: [5, 6], color: "teal" },
                            { range: [6, 7], color: "grey" },
                            { range: [7, 8], color: "pink" },
                            { range: [8, 9], color: "maroon" },


                        ],
                        threshold: {
                            line: { color: "red", width: 7 },
                            thickness: 2,
                            value: 10,
                        },
                    },

                },
            ];
            var layout_g = {
                width: 700,
                height: 600,
                margin: { t: 20, b: 40, 1: 100, r: 100 }

            };
            Plotly.newPlot("gauge", data_g, layout_g);

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