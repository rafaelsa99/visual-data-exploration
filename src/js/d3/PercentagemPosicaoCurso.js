class PercentagemPosicaoCurso{
    
    percentagem_posicao_curso(files_list, course, min_year, max_year, plot){
        
        var countOptions = new Map()
        let totalFiles = 0;
        let count = 1;
        let axis_max = 0;
        const append_data = (obj, options, pos) => {
            var i = countOptions.size
            var year = new Map()
            year.set("ano",obj.year)
            var sum = 0
            for(var j in options){
                sum += options[j];
            }
            countOptions.set(i, year);
            countOptions.get(i).set("Opção1", String((options.opt1/sum) * 100));
            countOptions.get(i).set("Opção2", String((options.opt2/sum) * 100));
            countOptions.get(i).set("Opção3", String((options.opt3/sum) * 100));
            countOptions.get(i).set("Opção4", String((options.opt4/sum) * 100));
            countOptions.get(i).set("Opção5", String((options.opt5/sum) * 100));
            countOptions.get(i).set("Opção6", String((options.opt6/sum) * 100));
            if(((options.opt1/sum) * 100) > axis_max){
                axis_max = ((options.opt1/sum) * 100);
            } 
            if(((options.opt2/sum) * 100) > axis_max){
                axis_max = ((options.opt2/sum) * 100);
            } 
            if(((options.opt3/sum) * 100) > axis_max){
                axis_max = ((options.opt3/sum) * 100);
            } 
            if(((options.opt4/sum) * 100) > axis_max){
                axis_max = ((options.opt4/sum) * 100);
            } 
            if(((options.opt5/sum) * 100) > axis_max){
                axis_max = ((options.opt5/sum) * 100);
            } 
            if(((options.opt6/sum) * 100) > axis_max){
                axis_max = ((options.opt6/sum) * 100);
            }
            if (pos == totalFiles) {
                plot.cleanPlot();
                plot.create_plot(get_JSON_Format(countOptions), ['Opção1', 'Opção2', 'Opção3', 'Opção4', 'Opção5', 'Opção6'],['ano'],[0,axis_max + 3],"Percentagem da Posição da Opção")
            }
        }

        const incCount = () =>{
            count += 1;
        }

        const incTotalFiles = () =>{
            totalFiles += 1;
        }

        const get_JSON_Format = (map) => {
            var jsonArray = []
            for(var j of map.values()){
                jsonArray.push(Object.fromEntries(j));
            }
            jsonArray.sort(
                function (a, b) {
                    if (a.ano > b.ano) {
                        return 1; 
                    }
                    if (a.ano < b.ano) { 
                        return -1; 
                    } 
                    // a must be equal to b 
                    return 0; 
                }
            )
            return jsonArray;
        }

        d3.csv(files_list, function(data){
            data.forEach(element => {
                if(element.course == course && element.year >= min_year && element.year <= max_year){
                    incTotalFiles()
                }
            })
        });
        d3.csv(files_list, function(data){
            data.forEach(element => {
                if(element.course == course && element.year >= min_year && element.year <= max_year){
                    d3.text(element.filename, function(error, raw){
                        var dsv = d3.dsvFormat(';')
                        var data_file = dsv.parse(raw)
                        var countOpts = {opt1:0, opt2:0, opt3:0, opt4:0, opt5:0, opt6:0}
                        data_file.forEach(data => {
                            if(data.Opcao1CursoCodigo == element.cod_course && data.Opcao1InstituicaoCodigo == element.cod_institution){
                                countOpts.opt1 += 1;
                            } else if(data.Opcao2CursoCodigo == element.cod_course && data.Opcao2InstituicaoCodigo == element.cod_institution){
                                countOpts.opt2 += 1;
                            } else if(data.Opcao3CursoCodigo == element.cod_course && data.Opcao3InstituicaoCodigo == element.cod_institution){
                                countOpts.opt3 += 1;
                            } else if(data.Opcao4CursoCodigo == element.cod_course && data.Opcao4InstituicaoCodigo == element.cod_institution){
                                countOpts.opt4 += 1;
                            } else if(data.Opcao5CursoCodigo == element.cod_course && data.Opcao5InstituicaoCodigo == element.cod_institution){
                                countOpts.opt5 += 1;
                            } else if(data.Opcao6CursoCodigo == element.cod_course && data.Opcao6InstituicaoCodigo == element.cod_institution){
                                countOpts.opt6 += 1;
                            }
                        });
                        append_data(element, countOpts, count)
                        incCount()
                    })
                }
            });
        })
    }

}

export default PercentagemPosicaoCurso;