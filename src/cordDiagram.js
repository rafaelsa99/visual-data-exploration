class CordDiagram {
    constructor(div_id) {
        // set the dimensions and margins of the graph
        this.margin = { top: 10, right: 100, bottom: 30, left: 50 };
        this.width = 800 - this.margin.left - this.margin.right;
        this.height = 800 - this.margin.top - this.margin.bottom;
        this.innerRadius = Math.min(this.width, this.height) * .39;
        this.outerRadius = this.innerRadius * 1.04;
        this.div_id = div_id;

        // append the svg object to the body of the page
        this.svg = d3.select(div_id)
            .append("svg")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + (this.margin.left + this.width / 2) + "," + (this.margin.top + this.height / 2) + ")");
    }

    create_plot(matrix, nameProvider, colors) {

        var _this = this;

        var margin = _this.margin;
        var width = _this.width;
        var height = _this.height;
        var innerRadius = _this.innerRadius;
        var outerRadius = _this.outerRadius;
        var div_id = this.div_id;
        var svg = _this.svg;

        /*Initiate the color scale*/
        var fill = d3.scaleOrdinal()
            .domain(d3.range(nameProvider.length))
            .range(colors);

        var arc = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);


        var chord = d3.chord()
            .padAngle(.04)
            .sortSubgroups(d3.descending)
            .sortChords(d3.ascending)
            (matrix);

        var g = svg.selectAll(".group")
            .data(chord.groups)
            .enter().append("g")
            .attr("class", function (d) { return "group " + nameProvider[d.index]; });

        g.append("svg:path")
            .attr("class", "arc")
            .style("stroke", function (d) { return fill(d.index); })
            .style("fill", function (d) { return fill(d.index); })
            .attr("d", arc)
            .style("opacity", 0)
            .transition().duration(1000)
            .style("opacity", 0.4);

        /*//////////////////////////////////////////////////////////
        ////////////////// Initiate Ticks //////////////////////////
        //////////////////////////////////////////////////////////*/

        var ticks = svg.selectAll(".group").append("g")
            .attr("class", function (d) { return "ticks " + nameProvider[d.index]; })
            .selectAll(".ticks")
            .attr("class", "ticks")
            .data(function (d) { return groupTicks(d, 25); })
            .enter().append("g")
            .attr("transform", function (d) {
                return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
                    + "translate(" + outerRadius + 40 + ",0)";
            });

        /*Append the tick around the arcs*/
        ticks.append("line")
            .attr("x1", 1)
            .attr("y1", 0)
            .attr("x2", 5)
            .attr("y2", 0)
            .attr("class", "ticks")
            .style("stroke", "#FFF");

        /*Add the labels for the %'s*/
        ticks.append("text")
            .attr("x", 8)
            .attr("dy", ".35em")
            .attr("class", "tickLabels")
            .attr("transform", function (d) { return d.angle > Math.PI ? "rotate(180)translate(-16)" : null; })
            .style("text-anchor", function (d) { return d.angle > Math.PI ? "end" : null; })
            .text(function (d) { return d.label; })
            .attr('opacity', 0);

        /*//////////////////////////////////////////////////////////
        ////////////////// Initiate Names //////////////////////////
        //////////////////////////////////////////////////////////*/

        g.append("text")
            .each(function (d) { d.angle = (d.startAngle + d.endAngle) / 2; })
            .attr("dy", ".35em")
            .attr("class", "titles")
            .attr("text-anchor", function (d) { return d.angle > Math.PI ? "end" : null; })
            .attr("transform", function (d) {
                return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
                    + "translate(" + (innerRadius + 55) + ")"
                    + (d.angle > Math.PI ? "rotate(180)" : "");
            })
            .attr('opacity', 0)
            .text(function (d, i) { return nameProvider[i]; });

        /*//////////////////////////////////////////////////////////
        //////////////// Initiate inner chords /////////////////////
        //////////////////////////////////////////////////////////*/
        //console.log(chord)

        let opacityValueBase = 0.8;
        let opacityValue = 0.4;

        var chords = svg.selectAll(".chord")
            .data(chord)
            .enter().append("path")
            .attr("class", "chord")
            .style("stroke", function (d) { return d3.rgb(fill(d.source.index)).darker(); })
            .style("fill", function (d) { return fill(d.source.index); })
            .attr("d", d3.ribbon().radius(innerRadius))
            .attr('opacity', 0)
            .on("mouseover", function (d) { showTooltip(d); })
            .on("mouseout", function (d) { hideTooltip(d); });

        /*Make all arc visible*/
        svg.selectAll("g.group").select("path")
            .transition().duration(1000)
            .style("opacity", 0.85);

        /*Make mouse over and out possible*/
        d3.selectAll(".group")
            .on("mouseover", fade(.02))
            .on("mouseout", fade(.80));

        /*Show all chords*/
        chords.transition().duration(1000)
            .style("opacity", opacityValueBase);

        /*Show all the text*/
        d3.selectAll(".group").selectAll("line")
            .transition().duration(100)
            .style("stroke", "#000");
        /*Same for the %'s*/
        svg.selectAll(".group")
            .transition().duration(100)
            .selectAll(".tickLabels").style("opacity", 1);
        /*And the Names of each Arc*/
        svg.selectAll(".group")
            .transition().duration(100)
            .selectAll(".titles").style("opacity", 1);


        /*//////////////////////////////////////////////////////////
        ////////////////// Extra Functions /////////////////////////
        //////////////////////////////////////////////////////////*/


        /*Returns an event handler for fading a given chord group*/
        function fade(opacity) {
            return function (d, i) {
                svg.selectAll("path.chord")
                    .filter(function (d) { return d.source.index != i && d.target.index != i; })
                    .transition()
                    .style("stroke-opacity", opacity)
                    .style("fill-opacity", opacity);
            };
        };/*fade*/

        // Returns an array of tick angles and values for a given group and step.
        function groupTicks(d, step) {
            var k = (d.endAngle - d.startAngle) / d.value;
            return d3.range(0, d.value, step).map(function (value) {
                return { value: value, angle: value * k + d.startAngle };
            });
        }

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
                //.html(nameProvider[d.source.index] + " <-> " + nameProvider[d.target.index])
                .html("Course 1: " + nameProvider[d.source.index] + "<br>Course 2: " + nameProvider[d.target.index])
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

export default CordDiagram;

