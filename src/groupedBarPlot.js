class GroupedBarPlot{
    constructor(div_id){
        // set the dimensions and margins of the graph
        this.margin = {top: 10, right: 30, bottom: 20, left: 50};
        this.width = 460 - this.margin.left - this.margin.right;
        this.height = 400 - this.margin.top - this.margin.bottom;
        
        // append the svg object to the body of the page
        this.svg = d3.select(div_id)
        .append("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
        .append("g")
        .attr("transform",
                "translate(" + this.margin.left + "," + this.margin.top + ")");
    }

    create_plot = (csv_file, label_x_axis) => {

        var _this = this;

        var margin = _this.margin;
        var width = _this.width;
        var height = _this.height;
        var svg = _this.svg;
        
        // Parse the Data
        d3.csv(csv_file, function(data) {

            // List of subgroups = header of the csv files = soil condition here
            var subgroups = data.columns.slice(1)
        
            // List of groups = species here = value of the first column called group -> I show them on the X axis
            var groups = d3.map(data, function(d){return(d[label_x_axis])}).keys()
        
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
            .range([ height, 0 ]);
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
            .range(['#e41a1c','#377eb8','#4daf4a'])
        
            // Show the bars
            svg.append("g")
            .selectAll("g")
            // Enter in data = loop group per group
            .data(data)
            .enter()
            .append("g")
                .attr("transform", function(d) { return "translate(" + x(d[label_x_axis]) + ",0)"; })
            .selectAll("rect")
            .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
            .enter().append("rect")
                .attr("x", function(d) { return xSubgroup(d.key); })
                .attr("y", function(d) { return y(d.value); })
                .attr("width", xSubgroup.bandwidth())
                .attr("height", function(d) { return height - y(d.value); })
                .attr("fill", function(d) { return color(d.key); });
        
        })
    }
}

export default GroupedBarPlot;