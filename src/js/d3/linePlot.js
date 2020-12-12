class LinePlot {
    constructor(div_id) {
        // set the dimensions and margins of the graph
        this.margin = { top: 10, right: 100, bottom: 30, left: 50 };
        this.width = 1000 - this.margin.left - this.margin.right;
        this.height = 800 - this.margin.top - this.margin.bottom;
        this.div_id = div_id;

        // append the svg object to the body of the page
        this.svg = d3.select(div_id)
            .append("svg")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + this.margin.left + "," + this.margin.top + ")");
    }

    create_plot_csv = (csv_file, columns, label_x_axis) => {

        var _this = this;

        var margin = _this.margin;
        var width = _this.width;
        var height = _this.height;
        var svg = _this.svg;

        //Read the data
        d3.csv(csv_file, function (data) {
            // List of groups (here I have one group per column)
            //var allGroup = ["valueA", "valueB", "valueC"]

            // Reformat the data: we need an array of arrays of {x, y} tuples
            var dataReady = columns.map(function (grpName) { // .map allows to do something for each element of the list
                return {
                    name: grpName,
                    values: data.map(function (d) {
                        return { h_axis: +d[label_x_axis], value: +d[grpName] };
                    })
                };
            });
            // I strongly advise to have a look to dataReady with
            console.log(dataReady)

            // A color scale: one color for each group
            var myColor = d3.scaleOrdinal()
                .domain(columns)
                .range(d3.schemeSet2);

            // Add X axis --> it is a date format
            var x = d3.scaleLinear()
                .domain([0, 10])
                .range([0, width]);
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

            // Add Y axis
            var y = d3.scaleLinear()
                .domain([0, 20])
                .range([height, 0]);
            svg.append("g")
                .call(d3.axisLeft(y));

            // Add the lines
            var line = d3.line()
                .x(function (d) { return x(+d.h_axis) })
                .y(function (d) { return y(+d.value) })
            svg.selectAll("myLines")
                .data(dataReady)
                .enter()
                .append("path")
                .attr("class", function (d) { return d.name })
                .attr("d", function (d) { return line(d.values) })
                .attr("stroke", function (d) { return myColor(d.name) })
                .style("stroke-width", 4)
                .style("fill", "none")

            // Add the points
            svg
                // First we need to enter in a group
                .selectAll("myDots")
                .data(dataReady)
                .enter()
                .append('g')
                .style("fill", function (d) { return myColor(d.name) })
                .attr("class", function (d) { return d.name })
                // Second we need to enter in the 'values' part of this group
                .selectAll("myPoints")
                .data(function (d) { return d.values })
                .enter()
                .append("circle")
                .attr("cx", function (d) { return x(d.h_axis) })
                .attr("cy", function (d) { return y(d.value) })
                .attr("r", 5)
                .attr("stroke", "white")

            // Add a label at the end of each line
            svg
                .selectAll("myLabels")
                .data(dataReady)
                .enter()
                .append('g')
                .append("text")
                .attr("class", function (d) { return d.name })
                .datum(function (d) { return { name: d.name, value: d.values[d.values.length - 1] }; }) // keep only the last value of each time series
                .attr("transform", function (d) { return "translate(" + x(d.value.h_axis) + "," + y(d.value.value) + ")"; }) // Put the text at the position of the last point
                .attr("x", 12) // shift the text a bit more right
                .text(function (d) { return d.name; })
                .style("fill", function (d) { return myColor(d.name) })
                .style("font-size", 15)

            // Add a legend (interactive)
            svg
                .selectAll("myLegend")
                .data(dataReady)
                .enter()
                .append('g')
                .append("text")
                .attr('x', function (d, i) { return 30 + i * 60 })
                .attr('y', 30)
                .text(function (d) { return d.name; })
                .style("fill", function (d) { return myColor(d.name) })
                .style("font-size", 15)
                .on("click", function (d) {
                    // is the element currently visible ?
                    var currentOpacity = d3.selectAll("." + d.name).style("opacity")
                    // Change the opacity: from 0 to 1 or from 1 to 0
                    d3.selectAll("." + d.name).transition().style("opacity", currentOpacity == 1 ? 0 : 1)

                })
        })
    }

    cleanPlot(){
        var _this = this;
        var div_id = _this.div_id;
        d3.select(div_id).select("svg").remove();
        // append the svg object to the body of the page
        _this.svg = d3.select(div_id)
            .append("svg")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
    }

    create_plot = (data, columns, label_x_axis, y_axis_domain) => {

        var _this = this;

        var margin = _this.margin;
        var width = _this.width;
        var height = _this.height;
        var div_id = _this.div_id;
        var svg = _this.svg;

        //Read the data
        // List of groups (here I have one group per column)
        //var allGroup = ["valueA", "valueB", "valueC"]

        // Reformat the data: we need an array of arrays of {x, y} tuples
        var dataReady = columns.map(function (grpName) { // .map allows to do something for each element of the list
            return {
                name: grpName,
                values: data.filter(function (d) {
                    if (!isNaN(d[grpName]))
                        return { h_axis: +d[label_x_axis], value: + d[grpName] };
                }).map(function (d) {
                    return { h_axis: +d[label_x_axis], value: + d[grpName] };
                })
            };
        });

        // A color scale: one color for each group
        var myColor = d3.scaleOrdinal()
            .domain(columns)
            .range(d3.schemeSet2);

        // Add X axis --> it is a date format
        var x = d3.scaleLinear()
            //.domain(data.map(d => {return +d[label_x_axis]}))
            .domain(d3.extent(data, function (d) { return +d[label_x_axis]; })).nice()
            //.range([ 0, (width / (dataReady.length+1))]);
            .range([0, width]);
        
            svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).ticks(data.length).tickFormat(d3.format("d")));

            // Add Y axis
        var y = d3.scaleLinear()
            .domain(y_axis_domain)
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // Add the lines
        var line = d3.line()
            .x(function (d) { return x(+d.h_axis) })
            .y(function (d) { return y(+d.value) })
        svg.selectAll("myLines")
            .data(dataReady)
            .enter()
            .append("path")
            .attr("class", function (d) { return d.name })
            .attr("d", function (d) { return line(d.values) })
            .attr("stroke", function (d) { return myColor(d.name) })
            .style("stroke-width", 4)
            .style("fill", "none")

        // Add the points
        svg
            // First we need to enter in a group
            .selectAll("myDots")
            .data(dataReady)
            .enter()
            .append('g')
            .style("fill", function (d) { return myColor(d.name) })
            .attr("class", function (d) { return d.name })
            // Second we need to enter in the 'values' part of this group
            .selectAll("myPoints")
            .data(function (d) { 
                d.values.forEach(element => {
                    element["name"] = d.name
                });
                return d.values 
            })
            .enter()
            .append("circle")
            .attr("cx", function (d) { return x(d.h_axis) })
            .attr("cy", function (d) { return y(d.value) })
            .attr("r", 5)
            .attr("stroke", "white")
            .on("mouseover", function (d) { showTooltip(d); })
            .on("mouseout", function (d) { hideTooltip(d); });

        // Add a label at the end of each line
        svg
            .selectAll("myLabels")
            .data(dataReady)
            .enter()
            .append('g')
            .append("text")
            .attr("class", function (d) { return d.name })
            .datum(function (d) { return { name: d.name, value: d.values[d.values.length - 1] }; }) // keep only the last value of each time series
            .attr("transform", function (d) { return "translate(" + x(d.value.h_axis) + "," + y(d.value.value) + ")"; }) // Put the text at the position of the last point
            .attr("x", 15) // shift the text a bit more right
            .text(function (d) { return d.name; })
            .style("fill", function (d) { return myColor(d.name) })
            .style("font-size", 15)

        // Add a legend (interactive)
        svg
            .selectAll("myLegend")
            .data(dataReady)
            .enter()
            .append('g')
            .append("text")
            .attr('x', function (d, i) { return 30 + i * 90 })
            .attr('y', 30)
            .text(function (d) { return d.name; })
            .style("fill", function (d) { return myColor(d.name) })
            .style("font-size", 15)
            .on("click", function (d) {
                // is the element currently visible ?
                var currentOpacity = d3.selectAll("." + d.name).style("opacity")
                // Change the opacity: from 0 to 1 or from 1 to 0
                d3.selectAll("." + d.name).transition().style("opacity", currentOpacity == 1 ? 0 : 1)

            })

        // Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
        // Its opacity is set to 0: we don't see it by default.
        var tooltip = d3.select(div_id)
            .append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("opacity", 0)
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "1px")
            .style("border-radius", "2px")
            .style("padding", "10px")

        // A function that change this tooltip when the user hover a point.
        // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
        var showTooltip = (d) => {
            tooltip
                .style("opacity", 1)
                .html("Value: " + d.value.toFixed(2) + "<br>" + d.name)
                .style("left", (d3.event.pageX + 16) + "px")
                .style("top", (d3.event.pageY + 16) + "px");
        }

        // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
        var hideTooltip = (d) => {
            tooltip
                .style("opacity", 0)
        }
    }
}

export default LinePlot;

