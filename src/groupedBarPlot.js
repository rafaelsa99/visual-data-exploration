class GroupedBarPlot {
    constructor(div_id) {
        // set the dimensions and margins of the graph
        this.margin = { top: 10, right: 30, bottom: 30, left: 50 };
        this.width = 860 - this.margin.left - this.margin.right;
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

    create_plot_csv = (csv_file, label_x_axis) => {

        var _this = this;

        var margin = _this.margin;
        var width = _this.width;
        var height = _this.height;
        var svg = _this.svg;

        // Parse the Data
        d3.csv(csv_file, function (data) {

            // List of subgroups = header of the csv files = soil condition here
            var subgroups = data.columns.slice(1)

            // List of groups = species here = value of the first column called group -> I show them on the X axis
            var groups = d3.map(data, function (d) { return (d[label_x_axis]) }).keys()

            // Add X axis
            var x = d3.scaleBand()
                .domain(groups)
                .range([0, width])
                .padding([0.2])
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x).tickSize(0));

            // Add Y axis
            var y = d3.scaleLinear()
                .domain([0, 40])
                .range([height, 0]);
            svg.append("g")
                .call(d3.axisLeft(y));

            // Another scale for subgroup position?
            var xSubgroup = d3.scaleBand()
                .domain(subgroups)
                .range([0, x.bandwidth()])
                .padding([0.05])

            // color palette = one color per subgroup
            var color = d3.scaleOrdinal()
                .domain(subgroups)
                .range(['#e41a1c', '#377eb8', '#4daf4a'])

            // Show the bars
            svg.append("g")
                .selectAll("g")
                // Enter in data = loop group per group
                .data(data)
                .enter()
                .append("g")
                .attr("transform", function (d) { return "translate(" + x(d[label_x_axis]) + ",0)"; })
                .selectAll("rect")
                .data(function (d) { return subgroups.map(function (key) { return { key: key, value: d[key] }; }); })
                .enter().append("rect")
                .attr("x", function (d) { return xSubgroup(d.key); })
                .attr("y", function (d) { return y(d.value); })
                .attr("width", xSubgroup.bandwidth())
                .attr("height", function (d) { return height - y(d.value); })
                .attr("fill", function (d) { return color(d.key); });

        })
    }

    create_plot = (data, label_x_axis) => {

        var _this = this;

        var margin = _this.margin;
        var width = _this.width;
        var height = _this.height;
        var div_id = _this.div_id;
        var svg = _this.svg;


        // List of subgroups = header of the csv files = soil condition here
        var subgroups = data.columns.slice(1)

        // List of groups = species here = value of the first column called group -> I show them on the X axis
        var groups = d3.map(data, function (d) { return (d[label_x_axis]) }).keys()

        // Add X axis
        var x = d3.scaleBand()
            .domain(groups)
            .range([0, width])
            .padding([0.2])
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickSize(0));

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, 40])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // Another scale for subgroup position?
        var xSubgroup = d3.scaleBand()
            .domain(subgroups)
            .range([0, x.bandwidth()])
            .padding([0.05])

        // color palette = one color per subgroup
        var color = d3.scaleOrdinal()
            .domain(subgroups)
            //.range(d3.schemeTableau)
            .range(d3.schemeTableau10)
        //.range(["#4e79a7","#f28e2c","#e15759","#76b7b2","#59a14f","#edc949","#af7aa1","#ff9da7","#9c755f","#bab0ab"])

        // Show the bars
        svg.append("g")
            .selectAll("g")
            // Enter in data = loop group per group
            .data(data)
            .enter()
            .append("g")
            .attr("transform", function (d) { return "translate(" + x(d[label_x_axis]) + ",0)"; })
            .selectAll("rect")
            .data(function (d) { return subgroups.map(function (key) { return { key: key, value: d[key] }; }); })
            .enter().append("rect")
            .attr("class", function (d) { return d.key; })
            .attr("x", function (d) { return xSubgroup(d.key); })
            .attr("y", function (d) {
                if (d.value == undefined)
                    return y(0);
                else
                    return y(d.value);
            })
            .attr("width", xSubgroup.bandwidth())
            .attr("height", function (d) {
                if (d.value == undefined)
                    return height - y(0);
                else
                    return height - y(d.value);
            })
            .attr("fill", function (d) { return color(d.key); })
            .on("mouseover", function (d) { showTooltip(d); })
            .on("mouseout", function (d) { hideTooltip(d); });

        // Add the line
        svg.append("path")
            //.datum(function (d) { (data) => { return subgroups.map(function (key) { return { grade: d.grade, count: d[key] }; }); } })
            .datum(() => {
                let fdata = []
                let gradeN = 0
                let count = 0
                let sum = 0
                data.forEach(d => {
                    let sub = subgroups.map(function (key) { return { grade: d.grade, count: d[key] }; });
                    sub.forEach(element => {
                        if (gradeN != element.grade && gradeN != 0) {
                            fdata.push({ grade: gradeN, med: count / sum })
                            sum = 0
                            count = 0
                        }
                        gradeN = element.grade
                        if (element.count != undefined) {
                            count += parseInt(element.count)
                            sum += 1
                        }

                    });
                    fdata.push({ grade: gradeN, med: count / sum })
                });
                //console.log(fdata)
                return fdata
            })
            .attr("class", "averageLine")
            .attr("fill", "none")
            .attr("stroke", "#520f0f")
            .attr("stroke-width", 2.5)
            .attr("transform", function (d, i) { return "translate(" + x(d[i].grade) + ",0)"; })
            .attr("d", d3.line()
                .x(function (d) { return x(d.grade) })
                .y(function (d) { return y(d.med) })
            );

        // Add a label at the end of each line
        svg
            .selectAll("myLabels")
            .data([1])
            .enter()
            .append('g')
            .append("text")
            .attr("class", "Median")
            .attr('transform', `translate(${400},${400})`)
            .attr("x", width / 2 - 65)
            .attr("y", (d, i) => i * 20)
            .text("Median")
            .style("fill", "#520f0f")
            .style("font-size", 20)
            .on("click", function (d) {
                // is the element currently visible ?
                var currentOpacity = d3.selectAll(".averageLine").style("opacity")
                // Change the opacity: from 0 to 1 or from 1 to 0
                d3.selectAll(".averageLine").transition().style("opacity", currentOpacity == 1 ? 0 : 1)

            })

        let legend = svg.append("g")
            .attr("class", "legend")
            .attr("height", 100)
            .attr("width", 200)
            .style('color', "red")
            .attr('transform', `translate(${400},${30})`);
        // Create rectangles markers
        legend.selectAll('rect')
            .data(data)
            .enter()
            .append("rect")
            .attr("x", width / 2 - 65)
            .attr("y", (d, i) => i * 20)
            .attr("width", 10)
            .attr("height", 10)
            .style("fill", (d, i) => color(i));
        // Create labels
        legend.selectAll('text')
            .data(function (d) { return subgroups.map(function (key) { return { key: key }; }); })
            .enter()
            .append("text")
            .attr("x", width / 2 - 52)
            .attr("y", (d, i) => i * 20 + 9)
            //.attr("font-size", "11px")
            .attr("fill", "#737373")
            .text((d) => (d.key).replace("Ano", ""))
            //.style("fill", (d,i) => cfg.color(i))
            .style("font-size", 15)
            .on("click", function (d) {
                // is the element currently visible ?
                var currentOpacity = d3.selectAll("." + d.key).style("opacity")
                // Change the opacity: from 0 to 1 or from 1 to 0
                d3.selectAll("." + d.key).transition().style("opacity", currentOpacity == 1 ? 0 : 1).style("display", currentOpacity == 1 ? "none" : "block")

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
                .html("Value: " + d.value + "<br>Year: " + (d.key).replace("Ano", ""))
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

export default GroupedBarPlot;