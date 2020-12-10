class RadarChart {
    constructor(div_id) {
        // set the dimensions and margins of the graph
        this.margin = { top: 10, right: 100, bottom: 30, left: 50 };
        this.width = 1060 - this.margin.left - this.margin.right;
        this.height = 800 - this.margin.top - this.margin.bottom;
        this.div_id = div_id;

        // append the svg object to the body of the page
        this.svg = d3.select(div_id)
            .append("svg")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .attr("class", "radar")
            .append("g")
            .attr("transform", "translate(" + (this.width / 2 + this.margin.left) + "," + (this.height / 2 + this.margin.top) + ")");
    }

    create_plot_csv = (data, options) => {

        var _this = this;

        var margin = _this.margin;
        var width = _this.width;
        var height = _this.height;
        var svg = _this.svg;

        const max = Math.max;
        const sin = Math.sin;
        const cos = Math.cos;
        const HALF_PI = Math.PI / 2;

        const cfg = {
            levels: 3,				//How many levels or inner circles should there be drawn
            maxValue: 0, 			//What is the value that the biggest circle will represent
            labelFactor: 1.25, 	//How much farther than the radius of the outer circle should the labels be placed
            wrapWidth: 60, 		//The number of pixels after which a label needs to be given a new line
            opacityArea: 0.35, 	//The opacity of the area of the blob
            dotRadius: 4, 			//The size of the colored circles of each blog
            opacityCircles: 0.1, 	//The opacity of the circles of each blob
            strokeWidth: 2, 		//The width of the stroke around each blob
            roundStrokes: false,	//If true the area and stroke will follow a round path (cardinal-closed)
            color: d3.scaleOrdinal(d3.schemeCategory10),	//Color function,
            format: '.2%',
            unit: '',
            legend: false
        };

        const wrap = (text, width) => {
            text.each(function () {
                var text = d3.select(this),
                    words = text.text().split(/\s+/).reverse(),
                    word,
                    line = [],
                    lineNumber = 0,
                    lineHeight = 1.4, // ems
                    y = text.attr("y"),
                    x = text.attr("x"),
                    dy = parseFloat(text.attr("dy")),
                    tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

                while (word = words.pop()) {
                    line.push(word);
                    tspan.text(line.join(" "));
                    if (tspan.node().getComputedTextLength() > width) {
                        line.pop();
                        tspan.text(line.join(" "));
                        line = [word];
                        tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                    }
                }
            });
        }//wrap

        //Put all of the options into a variable called cfg
        if ('undefined' !== typeof options) {
            for (var i in options) {
                if ('undefined' !== typeof options[i]) { cfg[i] = options[i]; }
            }//for i
        }//if

        //If the supplied maxValue is smaller than the actual one, replace by the max in the data
        // var maxValue = max(cfg.maxValue, d3.max(data, function(i){return d3.max(i.map(function(o){return o.value;}))}));
        let maxValue = 0;
        for (let j = 0; j < data.length; j++) {
            for (let i = 0; i < data[j].axes.length; i++) {
                data[j].axes[i]['id'] = data[j].name;
                if (data[j].axes[i]['value'] > maxValue) {
                    maxValue = data[j].axes[i]['value'];
                }
            }
        }
        maxValue = max(cfg.maxValue, maxValue);

        const allAxis = data[0].axes.map((i, j) => i.axis),	//Names of each axis
            total = allAxis.length,					//The number of different axes
            radius = Math.min(cfg.w / 2, cfg.h / 2), 	//Radius of the outermost circle
            Format = d3.format(cfg.format),			 	//Formatting
            angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"

        //Scale for the radius
        const rScale = d3.scaleLinear()
            .range([0, radius])
            .domain([0, maxValue]);

        /////////////////////////////////////////////////////////
        ////////// Glow filter for some extra pizzazz ///////////
        /////////////////////////////////////////////////////////

        //Filter for the outside glow
        let filter = svg.append('defs').append('filter').attr('id', 'glow'),
            feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation', '2.5').attr('result', 'coloredBlur'),
            feMerge = filter.append('feMerge'),
            feMergeNode_1 = feMerge.append('feMergeNode').attr('in', 'coloredBlur'),
            feMergeNode_2 = feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

        /////////////////////////////////////////////////////////
        /////////////// Draw the Circular grid //////////////////
        /////////////////////////////////////////////////////////

        //Wrapper for the grid & axes
        let axisGrid = svg.append("g").attr("class", "axisWrapper");

        //Draw the background circles
        axisGrid.selectAll(".levels")
            .data(d3.range(1, (cfg.levels + 1)).reverse())
            .enter()
            .append("circle")
            .attr("class", "gridCircle")
            .attr("r", d => radius / cfg.levels * d)
            .style("fill", "#CDCDCD")
            .style("stroke", "#CDCDCD")
            .style("fill-opacity", cfg.opacityCircles)
            .style("filter", "url(#glow)");

        //Text indicating at what % each level is
        axisGrid.selectAll(".axisLabel")
            .data(d3.range(1, (cfg.levels + 1)).reverse())
            .enter().append("text")
            .attr("class", "axisLabel")
            .attr("x", 4)
            .attr("y", d => -d * radius / cfg.levels)
            .attr("dy", "0.4em")
            .style("font-size", "10px")
            .attr("fill", "#737373")
            .text(d => Format(maxValue * d / cfg.levels) + cfg.unit);

        /////////////////////////////////////////////////////////
        //////////////////// Draw the axes //////////////////////
        /////////////////////////////////////////////////////////

        //Create the straight lines radiating outward from the center
        var axis = axisGrid.selectAll(".axis")
            .data(allAxis)
            .enter()
            .append("g")
            .attr("class", "axis");
        //Append the lines
        axis.append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", (d, i) => rScale(maxValue * 1.1) * cos(angleSlice * i - HALF_PI))
            .attr("y2", (d, i) => rScale(maxValue * 1.1) * sin(angleSlice * i - HALF_PI))
            .attr("class", "line")
            .style("stroke", "white")
            .style("stroke-width", "2px");

        //Append the labels at each axis
        axis.append("text")
            .attr("class", "legend")
            .style("font-size", "11px")
            .attr("text-anchor", "middle")
            .attr("dy", "0.35em")
            .attr("x", (d, i) => rScale(maxValue * cfg.labelFactor) * cos(angleSlice * i - HALF_PI))
            .attr("y", (d, i) => rScale(maxValue * cfg.labelFactor) * sin(angleSlice * i - HALF_PI))
            .text(d => d)
            .call(wrap, cfg.wrapWidth);

        /////////////////////////////////////////////////////////
        ///////////// Draw the radar chart blobs ////////////////
        /////////////////////////////////////////////////////////

        //The radial line function
        const radarLine = d3.radialLine()
            .curve(d3.curveLinearClosed)
            .radius(d => rScale(d.value))
            .angle((d, i) => i * angleSlice);

        if (cfg.roundStrokes) {
            radarLine.curve(d3.curveCardinalClosed)
        }

        //Create a wrapper for the blobs
        const blobWrapper = svg.selectAll(".radarWrapper")
            .data(data)
            .enter().append("g")
            .attr("class", "radarWrapper");

        //Append the backgrounds
        blobWrapper
            .append("path")
            .attr("class", "radarArea")
            .attr("d", d => radarLine(d.axes))
            .style("fill", (d, i) => cfg.color(i))
            .style("fill-opacity", cfg.opacityArea)
            .on('mouseover', function (d, i) {
                //Dim all blobs
                parent.selectAll(".radarArea")
                    .transition().duration(200)
                    .style("fill-opacity", 0.1);
                //Bring back the hovered over blob
                d3.select(this)
                    .transition().duration(200)
                    .style("fill-opacity", 0.7);
            })
            .on('mouseout', () => {
                //Bring back all blobs
                parent.selectAll(".radarArea")
                    .transition().duration(200)
                    .style("fill-opacity", cfg.opacityArea);
            });

        //Create the outlines
        blobWrapper.append("path")
            .attr("class", "radarStroke")
            .attr("d", function (d, i) { return radarLine(d.axes); })
            .style("stroke-width", cfg.strokeWidth + "px")
            .style("stroke", (d, i) => cfg.color(i))
            .style("fill", "none")
            .style("filter", "url(#glow)");

        //Append the circles
        blobWrapper.selectAll(".radarCircle")
            .data(d => d.axes)
            .enter()
            .append("circle")
            .attr("class", "radarCircle")
            .attr("r", cfg.dotRadius)
            .attr("cx", (d, i) => rScale(d.value) * cos(angleSlice * i - HALF_PI))
            .attr("cy", (d, i) => rScale(d.value) * sin(angleSlice * i - HALF_PI))
            .style("fill", (d) => cfg.color(d.id))
            .style("fill-opacity", 0.8);

        /////////////////////////////////////////////////////////
        //////// Append invisible circles for tooltip ///////////
        /////////////////////////////////////////////////////////

        //Wrapper for the invisible circles on top
        const blobCircleWrapper = svg.selectAll(".radarCircleWrapper")
            .data(data)
            .enter().append("g")
            .attr("class", "radarCircleWrapper");

        //Append a set of invisible circles on top for the mouseover pop-up
        blobCircleWrapper.selectAll(".radarInvisibleCircle")
            .data(d => d.axes)
            .enter().append("circle")
            .attr("class", "radarInvisibleCircle")
            .attr("r", cfg.dotRadius * 1.5)
            .attr("cx", (d, i) => rScale(d.value) * cos(angleSlice * i - HALF_PI))
            .attr("cy", (d, i) => rScale(d.value) * sin(angleSlice * i - HALF_PI))
            .style("fill", "none")
            .style("pointer-events", "all")
            .on("mouseover", function (d, i) {
                tooltip
                    .attr('x', this.cx.baseVal.value - 10)
                    .attr('y', this.cy.baseVal.value - 10)
                    .transition()
                    .style('display', 'block')
                    .text(Format(d.value) + cfg.unit);
            })
            .on("mouseout", function () {
                tooltip.transition()
                    .style('display', 'none').text('');
            });

        const tooltip = svg.append("text")
            .attr("class", "tooltip")
            .attr('x', 0)
            .attr('y', 0)
            .style("font-size", "12px")
            .style('display', 'none')
            .attr("text-anchor", "middle")
            .attr("dy", "0.35em");

        if (cfg.legend !== false && typeof cfg.legend === "object") {
            let legendZone = svg.append('g');
            let names = data.map(el => el.name);
            if (cfg.legend.title) {
                let title = legendZone.append("text")
                    .attr("class", "title")
                    .attr('transform', `translate(${cfg.legend.translateX},${cfg.legend.translateY})`)
                    .attr("x", cfg.w - 70)
                    .attr("y", 10)
                    .attr("font-size", "12px")
                    .attr("fill", "#404040")
                    .text(cfg.legend.title);
            }
            let legend = legendZone.append("g")
                .attr("class", "legend")
                .attr("height", 100)
                .attr("width", 200)
                .attr('transform', `translate(${cfg.legend.translateX},${cfg.legend.translateY + 20})`);
            // Create rectangles markers
            legend.selectAll('rect')
                .data(names)
                .enter()
                .append("rect")
                .attr("x", cfg.w - 65)
                .attr("y", (d, i) => i * 20)
                .attr("width", 10)
                .attr("height", 10)
                .style("fill", (d, i) => cfg.color(i));
            // Create labels
            legend.selectAll('text')
                .data(names)
                .enter()
                .append("text")
                .attr("x", cfg.w - 52)
                .attr("y", (d, i) => i * 20 + 9)
                .attr("font-size", "11px")
                .attr("fill", "#737373")
                .text(d => d);
        }

        // Parse the Data
        //d3.csv(csv_file, function(data) {

        //})
    }

    create_plot(data, options) {

        var _this = this;

        var div_id = this.div_id;

        var svg = _this.svg;

        const max = Math.max;
        const sin = Math.sin;
        const cos = Math.cos;
        const HALF_PI = Math.PI / 2;

        //Wraps SVG text - Taken from http://bl.ocks.org/mbostock/7555321
        const wrap = (text, width) => {
            text.each(function () {
                var text = d3.select(this),
                    words = text.text().split(/\s+/).reverse(),
                    word,
                    line = [],
                    lineNumber = 0,
                    lineHeight = 1.4, // ems
                    y = text.attr("y"),
                    x = text.attr("x"),
                    dy = parseFloat(text.attr("dy")),
                    tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

                while (word = words.pop()) {
                    line.push(word);
                    tspan.text(line.join(" "));
                    if (tspan.node().getComputedTextLength() > width) {
                        line.pop();
                        tspan.text(line.join(" "));
                        line = [word];
                        tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                    }
                }
            });
        }//wrap

        const cfg = {
            levels: 3,				//How many levels or inner circles should there be drawn
            maxValue: 0, 			//What is the value that the biggest circle will represent
            labelFactor: 1.25, 	//How much farther than the radius of the outer circle should the labels be placed
            wrapWidth: 60, 		//The number of pixels after which a label needs to be given a new line
            opacityArea: 0.35, 	//The opacity of the area of the blob
            dotRadius: 4, 			//The size of the colored circles of each blog
            opacityCircles: 0.1, 	//The opacity of the circles of each blob
            strokeWidth: 2, 		//The width of the stroke around each blob
            roundStrokes: false,	//If true the area and stroke will follow a round path (cardinal-closed)
            color: d3.scaleOrdinal(d3.schemeCategory10),	//Color function,
            format: '.2%'
        };

        //Put all of the options into a variable called cfg
        if ('undefined' !== typeof options) {
            for (var i in options) {
                if ('undefined' !== typeof options[i]) { cfg[i] = options[i]; }
            }//for i
        }//if

        //If the supplied maxValue is smaller than the actual one, replace by the max in the data
        // var maxValue = max(cfg.maxValue, d3.max(data, function(i){return d3.max(i.map(function(o){return o.value;}))}));
        let maxValue = 0;
        for (let j = 0; j < data.length; j++) {
            for (let i = 0; i < data[j].axes.length; i++) {
                data[j].axes[i]['id'] = data[j].name;
                if (data[j].axes[i]['value'] > maxValue) {
                    maxValue = data[j].axes[i]['value'];
                }
            }
        }
        maxValue = max(cfg.maxValue, maxValue);

        const allAxis = data[0].axes.map((i, j) => i.axis),	//Names of each axis
            total = allAxis.length,					//The number of different axes
            radius = Math.min(cfg.w / 2, cfg.h / 2), 	//Radius of the outermost circle
            Format = d3.format(cfg.format),			 	//Formatting
            angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"

        //Scale for the radius
        const rScale = d3.scaleLinear()
            .range([0, radius])
            .domain([0, maxValue]);

        /////////////////////////////////////////////////////////
        ////////// Glow filter for some extra pizzazz ///////////
        /////////////////////////////////////////////////////////

        //Filter for the outside glow
        let filter = svg.append('defs').append('filter').attr('id', 'glow'),
            feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation', '2.5').attr('result', 'coloredBlur'),
            feMerge = filter.append('feMerge'),
            feMergeNode_1 = feMerge.append('feMergeNode').attr('in', 'coloredBlur'),
            feMergeNode_2 = feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

        /////////////////////////////////////////////////////////
        /////////////// Draw the Circular grid //////////////////
        /////////////////////////////////////////////////////////

        //Wrapper for the grid & axes
        let axisGrid = svg.append("g").attr("class", "axisWrapper");

        //Draw the background circles
        axisGrid.selectAll(".levels")
            .data(d3.range(1, (cfg.levels + 1)).reverse())
            .enter()
            .append("circle")
            .attr("class", "gridCircle")
            .attr("r", d => radius / cfg.levels * d)
            .style("fill", "#CDCDCD")
            .style("stroke", "#CDCDCD")
            .style("fill-opacity", cfg.opacityCircles)
            .style("filter", "url(#glow)");

        //Text indicating at what % each level is
        axisGrid.selectAll(".axisLabel")
            .data(d3.range(1, (cfg.levels + 1)).reverse())
            .enter().append("text")
            .attr("class", "axisLabel")
            .attr("x", 4)
            .attr("y", d => -d * radius / cfg.levels)
            .attr("dy", "0.4em")
            .style("font-size", "10px")
            .attr("fill", "#737373")
            .text(d => Format(maxValue * d / cfg.levels) + cfg.unit);

        /////////////////////////////////////////////////////////
        //////////////////// Draw the axes //////////////////////
        /////////////////////////////////////////////////////////

        //Create the straight lines radiating outward from the center
        var axis = axisGrid.selectAll(".axisWrapper")
            .data(allAxis)
            .enter()
            .append("g")
            .attr("class", "axis");
        //Append the lines
        axis.append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", (d, i) => rScale(maxValue * 1.1) * cos(angleSlice * i - HALF_PI))
            .attr("y2", (d, i) => rScale(maxValue * 1.1) * sin(angleSlice * i - HALF_PI))
            .attr("class", "line")
            .style("stroke", "white")
            .style("stroke-width", "2px");

        //Append the labels at each axis
        axis.append("text")
            .attr("class", "legend")
            .style("font-size", "11px")
            .attr("text-anchor", "middle")
            .attr("dy", "0.35em")
            .attr("x", (d, i) => rScale(maxValue * cfg.labelFactor) * cos(angleSlice * i - HALF_PI))
            .attr("y", (d, i) => rScale(maxValue * cfg.labelFactor) * sin(angleSlice * i - HALF_PI))
            .text(d => d)
            .call(wrap, cfg.wrapWidth);

        /////////////////////////////////////////////////////////
        ///////////// Draw the radar chart blobs ////////////////
        /////////////////////////////////////////////////////////

        //The radial line function
        const radarLine = d3.radialLine()
            .curve(d3.curveLinearClosed)
            .radius(d => rScale(d.value))
            .angle((d, i) => i * angleSlice);

        if (cfg.roundStrokes) {
            radarLine.curve(d3.curveCardinalClosed)
        }

        //Create a wrapper for the blobs
        const blobWrapper = svg.selectAll(".radarWrapper")
            .data(data)
            .enter().append("g")
            .attr("class", function (d) { return d.name });

        //Append the backgrounds
        blobWrapper
            .append("path")
            .attr("class", "radarArea")
            .attr("d", d => radarLine(d.axes))
            .style("fill", (d, i) => cfg.color(i))
            .style("fill-opacity", cfg.opacityArea)
            .on('mouseover', function (d, i) {
                //Dim all blobs
                d3.selectAll(".radarArea")
                    .transition().duration(200)
                    .style("fill-opacity", 0.1);
                //Bring back the hovered over blob
                d3.select(this)
                    .transition().duration(200)
                    .style("fill-opacity", 0.7);
                showTooltip(d.name)
            })
            .on('mouseout', () => {
                //Bring back all blobs
                d3.selectAll(".radarArea")
                    .transition().duration(200)
                    .style("fill-opacity", cfg.opacityArea);
                hideTooltip()
            });

        //Create the outlines
        blobWrapper.append("path")
            .attr("class", "radarStroke")
            .attr("d", function (d, i) { return radarLine(d.axes); })
            .style("stroke-width", cfg.strokeWidth + "px")
            .style("stroke", (d, i) => cfg.color(i))
            .style("fill", "none")
            .style("filter", "url(#glow)");

        //Append the circles
        blobWrapper.selectAll(".radarCircle")
            .data(d => d.axes)
            .enter()
            .append("circle")
            .attr("class", "radarCircle")
            .attr("r", cfg.dotRadius)
            .attr("cx", (d, i) => rScale(d.value) * cos(angleSlice * i - HALF_PI))
            .attr("cy", (d, i) => rScale(d.value) * sin(angleSlice * i - HALF_PI))
            .style("fill", (d) => cfg.color(d.id))
            .style("fill-opacity", 0.8);

        /////////////////////////////////////////////////////////
        //////// Append invisible circles for tooltip ///////////
        /////////////////////////////////////////////////////////

        //Wrapper for the invisible circles on top
        const blobCircleWrapper = svg.selectAll(".radarCircleWrapper")
            .data(data)
            .enter().append("g")
            .attr("class", "radarCircleWrapper");

        //Append a set of invisible circles on top for the mouseover pop-up
        blobCircleWrapper.selectAll(".radarInvisibleCircle")
            .data(d => d.axes)
            .enter().append("circle")
            .attr("class", "radarInvisibleCircle")
            .attr("r", cfg.dotRadius * 1.5)
            .attr("cx", (d, i) => rScale(d.value) * cos(angleSlice * i - HALF_PI))
            .attr("cy", (d, i) => rScale(d.value) * sin(angleSlice * i - HALF_PI))
            .style("fill", "none")
            .style("pointer-events", "all")
            .on("mouseover", function (d, i) {
                tooltip
                    .attr('x', this.cx.baseVal.value - 10)
                    .attr('y', this.cy.baseVal.value - 10)
                    .transition()
                    .style('display', 'block')
                    .text(Format(d.value) + cfg.unit);
            })
            .on("mouseout", function () {
                tooltip.transition()
                    .style('display', 'none').text('');
            });

        const tooltip = svg.append("text")
            .attr("class", "tooltip")
            .attr('x', 0)
            .attr('y', 0)
            .style("font-size", "12px")
            .style('display', 'none')
            .attr("text-anchor", "middle")
            .attr("dy", "0.35em");

        if (cfg.legend !== false && typeof cfg.legend === "object") {
            let legendZone = svg.append('g');
            let names = data.map(el => el.name);
            if (cfg.legend.title) {
                let title = legendZone.append("text")
                    .attr("class", "title")
                    .attr('transform', `translate(${cfg.legend.translateX},${cfg.legend.translateY})`)
                    .attr("x", cfg.w - 70)
                    .attr("y", 10)
                    .attr("font-size", "12px")
                    .attr("fill", "#404040")
                    .text(cfg.legend.title);
            }
            let legend = legendZone.append("g")
                .attr("class", "legend")
                .attr("height", 100)
                .attr("width", 200)
                .attr('transform', `translate(${cfg.legend.translateX},${cfg.legend.translateY + 20})`);
            // Create rectangles markers
            legend.selectAll('rect')
                .data(names)
                .enter()
                .append("rect")
                .attr("x", cfg.w - 65)
                .attr("y", (d, i) => i * 20)
                .attr("width", 10)
                .attr("height", 10)
                .style("fill", (d, i) => cfg.color(i));
            // Create labels
            legend.selectAll('text')
                .data(names)
                .enter()
                .append("text")
                .attr("x", cfg.w - 52)
                .attr("y", (d, i) => i * 20 + 9)
                //.attr("font-size", "11px")
                .attr("fill", "#737373")
                .text(d => d)
                //.style("fill", (d,i) => cfg.color(i))
                .style("font-size", 15)
                .on("click", function (d) {
                    // is the element currently visible ?
                    var currentOpacity = d3.selectAll("." + d).style("opacity")
                    // Change the opacity: from 0 to 1 or from 1 to 0
                    d3.selectAll("." + d).transition().style("opacity", currentOpacity == 1 ? 0 : 1).style("display", currentOpacity == 1 ? "none" : "block")

                })
        }


        // Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
        // Its opacity is set to 0: we don't see it by default.
        var tooltipText = d3.select(div_id)
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
            tooltipText
                .style("opacity", 1)
                .html(d)
                .style("left", (d3.event.pageX + 16) + "px")
                .style("top", (d3.event.pageY + 16) + "px");
        }

        // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
        var hideTooltip = (d) => {
            tooltipText
                .style("opacity", 0)
        }
    }//RadarChart
}

export default RadarChart;