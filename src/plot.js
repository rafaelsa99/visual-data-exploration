class Plot{
 
    constructor(input_id, label_id, selection_id = null) {
        this.input_id = input_id;
        this.label_id = label_id;
        this.selection_id = selection_id;
    }

    plot_alternativas_candidatos(files_list, data, plot, plotColors, minYear, maxYear){
        let slider = d3.select(this.input_id);
        let label = d3.select(this.label_id);  
        let selection = d3.select(this.selection_id);      
        label.text(maxYear);
        data.alternativas_candidatos(files_list, maxYear, plot, plotColors, 0)
    
        const updateOnSelection = (value) => {
            data.alternativas_candidatos(files_list, d3.select(this.input_id).property("value"), plot, plotColors, value);
        }

        const updateOnSlider = (value) => {
            data.alternativas_candidatos(files_list, value, plot, plotColors, parseInt(d3.select(this.selection_id).property("value")));
        }

        selection
            .on('change', function() {
                updateOnSelection(parseInt(this.value));
        });

        slider
            .attr("min", minYear)
            .attr("max", maxYear)
            .attr("value", maxYear)
            .attr("step", 1)
            .on("input", function(d) {
                label.text(this.value);
                updateOnSlider(this.value);
            });
    }

    plot_preferencias_opcoes(files_list, data, plot, plotOptions, minYear, maxYear){
        let slider = d3.select(this.input_id);
        let label = d3.select(this.label_id);  
        label.text(maxYear);
        data.preferencias_opcoes(files_list, maxYear, plot, plotOptions)

        slider
            .attr("min", minYear)
            .attr("max", maxYear)
            .attr("value", maxYear)
            .attr("step", 1)
            .on("input", function(d) {
                label.text(this.value);
                //plot.cleanPlotWithoutSmoothness();
                //radarChart.clean_plot();
                data.preferencias_opcoes(files_list, this.value, plot, plotOptions);
            });
    }
    
}

export default Plot;