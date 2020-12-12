class Plot {

    constructor(input_id, label_id, selection_id = null) {
        this.input_id = input_id;
        this.label_id = label_id;
        this.selection_id = selection_id;
    }

    plot_alternativas_candidatos(files_list, data, plot, plotColors, minYear, maxYear) {
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
            .on('change', function () {
                updateOnSelection(parseInt(this.value));
            });

        slider
            .attr("min", minYear)
            .attr("max", maxYear)
            .attr("value", maxYear)
            .attr("step", 1)
            .on("input", function (d) {
                label.text(this.value);
                updateOnSlider(this.value);
            });
    }

    plot_preferencias_opcoes(files_list, data, plot, plotOptions, minYear, maxYear) {
        let slider = d3.select(this.input_id);
        let label = d3.select(this.label_id);
        label.text(maxYear);
        data.preferencias_opcoes(files_list, maxYear, plot, plotOptions)

        slider
            .attr("min", minYear)
            .attr("max", maxYear)
            .attr("value", maxYear)
            .attr("step", 1)
            .on("input", function (d) {
                label.text(this.value);
                data.preferencias_opcoes(files_list, this.value, plot, plotOptions);
            });
    }

    plot_notas_colocados(files_list, dataClass, plot, data, course) {
        // Range
        let call_BarPlot = (min, max) => {
            dataClass.notas_colocados(files_list, course, min, max, plot);
        }

        dataClass.notas_colocados(files_list, course, d3v6.min(data), d3v6.max(data), plot);

        var sliderRange = d3v6
            .sliderBottom()
            .min(d3v6.min(data))
            .max(d3v6.max(data))
            .step(1)
            .width(300)
            .ticks(data.length)
            .tickFormat(d3v6.format('d'))
            .default([data[0], data[data.length - 1]])
            .fill('#2196f3')
            .on('onchange', val => {
                d3v6.select(this.label_id).text(val.map(d3v6.format('')));
                let rangeVal = d3v6.select(this.label_id)._groups[0][0].innerHTML.split(",")
                call_BarPlot(rangeVal[0], rangeVal[1])
            });

        var gRange = d3v6
            .select(this.input_id)
            .append('svg')
            .attr('width', 500)
            .attr('height', 100)
            .append('g')
            .attr('transform', 'translate(30,30)');

        gRange.call(sliderRange);

        d3v6.select(this.label_id).text(
            sliderRange
                .value()
                .map(d3v6.format(''))
                .join('-')
        );
    }

    plot_notas_ultimos_colocados(files_list, dataClass, plot, data) {
        // Range
        let call_BarPlot = (min, max) => {
            dataClass.notas_ultimos_colocados(files_list, min, max, plot);
        }

        dataClass.notas_ultimos_colocados(files_list, d3v6.min(data), d3v6.max(data), plot);

        var sliderRange = d3v6
            .sliderBottom()
            .min(d3v6.min(data))
            .max(d3v6.max(data))
            .step(1)
            .width(300)
            .ticks(data.length)
            .tickFormat(d3v6.format('d'))
            .default([data[0], data[data.length - 1]])
            .fill('#2196f3')
            .on('onchange', val => {
                d3v6.select(this.label_id).text(val.map(d3v6.format('')));
                let rangeVal = d3v6.select(this.label_id)._groups[0][0].innerHTML.split(",")
                call_BarPlot(rangeVal[0], rangeVal[1])
            });

        var gRange = d3v6
            .select(this.input_id)
            .append('svg')
            .attr('width', 500)
            .attr('height', 100)
            .append('g')
            .attr('transform', 'translate(30,30)');

        gRange.call(sliderRange);

        d3v6.select(this.label_id).text(
            sliderRange
                .value()
                .map(d3v6.format(''))
                .join('-')
        );
    }

    plot_evolucao(files_list, dataClass, buttonID, data, chart, chartOptions) {

        document.getElementById(buttonID).onclick = function () {
            const delayLoop = (fn, delay) => {
                return (x, i) => {
                    setTimeout(() => {
                        fn(x);
                    }, i * delay);
                };
            };
            let rangeYears = []
            let rangeVal = d3v6.select('p#value-range')._groups[0][0].innerHTML.split(",")
            for(var i = parseInt(rangeVal[0]); i <= parseInt(rangeVal[1]); i++){
                rangeYears.push(i)
            }
            var promise = Promise.resolve();
            rangeYears.forEach(delayLoop(updateData, d3.select('#duration').property("value") * 1000));
        };

        var sliderRange = d3v6
            .sliderBottom()
            .min(d3v6.min(data))
            .max(d3v6.max(data))
            .step(1)
            .width(300)
            .ticks(data.length)
            .tickFormat(d3v6.format('d'))
            .default([data[0], data[data.length - 1]])
            .fill('#2196f3')
            .on('onchange', val => {
                d3v6.select(this.label_id).text(val.map(d3v6.format('')));
            });

        var gRange = d3v6
            .select(this.input_id)
            .append('svg')
            .attr('width', 500)
            .attr('height', 100)
            .append('g')
            .attr('transform', 'translate(30,30)');

        gRange.call(sliderRange);

        d3v6.select(this.label_id).text(
            sliderRange
                .value()
                .map(d3v6.format(''))
                .join('-')
        );

        // ** Update data section (Called from the onclick)
        function updateData(element) {
            setTimeout(function () {
                dataClass.preferencias_opcoes(files_list, element, chart, chartOptions);
                d3.select("#sliderRadar").property("value", element);
                d3.select("#labelRadar").text(element);
            }, 250)
        }
    }

    plot_percentagem_posicao_curso(files_list, dataClass, plot, data, course) {
        // Range
        let call_BarPlot = (min, max) => {
            dataClass.percentagem_posicao_curso(files_list, course, min, max, plot);
        }

        dataClass.percentagem_posicao_curso(files_list, course, d3v6.min(data), d3v6.max(data), plot);

        var sliderRange = d3v6
            .sliderBottom()
            .min(d3v6.min(data))
            .max(d3v6.max(data))
            .step(1)
            .width(300)
            .ticks(data.length)
            .tickFormat(d3v6.format('d'))
            .default([data[0], data[data.length - 1]])
            .fill('#2196f3')
            .on('onchange', val => {
                d3v6.select(this.label_id).text(val.map(d3v6.format('')));
                let rangeVal = d3v6.select(this.label_id)._groups[0][0].innerHTML.split(",")
                call_BarPlot(rangeVal[0], rangeVal[1])
            });

        var gRange = d3v6
            .select(this.input_id)
            .append('svg')
            .attr('width', 500)
            .attr('height', 100)
            .append('g')
            .attr('transform', 'translate(30,30)');

        gRange.call(sliderRange);

        d3v6.select(this.label_id).text(
            sliderRange
                .value()
                .map(d3v6.format(''))
                .join('-')
        );
    }
}

export default Plot;