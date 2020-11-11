// Belly button biodiversity

function getPlot(id) {
    // pull data from the json file
    d3.json('/data/samples.json').then((data) => {
        console.log(data)

        var wfreq = data.metadata.map(d => d.wfreq)
        console.log('Washing Freq: ${wfreq}')

        //filter sample values by id
        var samples = data.samples.filter(s => s.id.toString() === id)[0];
        console.log(samples)

        //getting the top ten
        var samplevalues = samples.sample_values.slice(0, 10).reverse();
        console.log(samplevalues)

        //getting only top 10 otu ids for the plot OTU and then reversing it.
        var OTU_top = (samples.otu_ids.slice(0, 10)).reverse();
        console.log(OTU_top)

        //getting the otu id's to the desired form for the plot
        var OTU_id = OTU_top.map(d => "OTU " + d)
        console.log('OTU IDS: ${OTU_id}')

        //getting the top 10 labels for the plot
        var labels = samples.otu_labels.slice(0, 10);
        console.log('Sample Values: ${samplevalues}')

        var trace = {
            x: samplevalues,
            y: OTU_id,
            text: labels,
            marker: {
                color: 'rgb(142, 125, 195)'
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

    }
    })


}