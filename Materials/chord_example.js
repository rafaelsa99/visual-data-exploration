//To embed the D3 javascript into the html, simply call the .js file with the script src ="" function. In practice, it's common to use div to define the area for D3 effects. For example, in this html web page, I inserted the D3 script in between a div element with id called "chart". 
//The id is called in the chord.js file to select that element by specifying d3.select("div#chart").append("svg").

var screenWidth=$(window).width();

var margin = {left: 10, top: 5, right: 10, bottom: 5},
	  width = Math.min(screenWidth, 700) - margin.left - margin.right,
	  height = Math.min(screenWidth, 700)*5/6 - margin.top - margin.bottom;

var outerRadius = Math.min(width, height) / 2  - 100,
  	innerRadius = outerRadius * 0.95;

//var formatPercent = d3.format(".1%");

var arc = d3.svg.arc()
.innerRadius(innerRadius)
.outerRadius(outerRadius);

var layout = d3.layout.chord()
.padding(.04)
.sortSubgroups(d3.descending)
.sortChords(d3.ascending);

var path = d3.svg.chord()
.radius(innerRadius);

var svg = d3.select("#svg1")
.attr("width", (width+margin.left+margin.right))
.attr("height", (height+margin.top+margin.bottom))
.append("g")
.attr("id", "circle")
.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

svg.append("circle")
.attr("r", outerRadius);

d3.csv("cities2.csv", function(cities) {
d3.json("location_matrix.json", function(matrix) {

// Compute the chord layout.
layout.matrix(matrix);

// Add a group per neighborhood.
var group = svg.selectAll(".group")
.data(layout.groups)
.enter().append("g")
.attr("class", "group")
.on("mouseover", mouseover);;

// Add a mouseover title for each arc.
group.append("title").text(function(d, i) {
 return Math.round(d.value) + "people leaving " +  cities[i].name;});

// Add the group arc.
var groupPath = group.append("path")
.attr("id", function(d, i) { return "group" + i; })
.attr("d", arc)
.style("fill", function(d, i) { return cities[i].color; });

//add text label of the groups
group.append("svg:text")
  	.each(function(d) { d.angle = ((d.startAngle + d.endAngle) / 2);})
  	.attr("dy", ".25em")
  	.attr("class", "titles")
  	.attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
  	.attr("transform", function(d,i) {
  		var c = arc.centroid(d);
  		return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
  		+ "translate(" + (innerRadius + 15) + ")" //how close the labels are to the outer arc
  		+ (d.angle > Math.PI ? "rotate(180)" : "")
  	})
  	.text(function(d,i) { return cities[i].name; });

// Add the chords.
var chord = svg.selectAll(".chord")
	.data(layout.chords)
	.enter().append("path")
	.attr("class", "chord")
	.style("fill", function(d) { return cities[d.source.index].color; })
	.attr("d", path);


// tool tip info for the chords
chord.append("title").text(function(d) {
		 return cities[d.source.index].name
		 + " → " + cities[d.target.index].name
		 + ": " + (d.source.value)
		 + "\n" + cities[d.target.index].name
		 + " → " + cities[d.source.index].name
		 + ": " + (d.target.value);
		 });
//mouse over function
function mouseover(d, i) {
		chord.classed("fade", function(p) {
		return p.source.index != i
		&& p.target.index != i;
		});
		}

});
});