import AlternativasCandidatos from "./AlternativasCandidatos.js";
import NotasColocados from "./NotasColocados.js";
import NotasUltimosColocados from "./NotasUltimosColocados.js";
import PercentagemPosicaoCurso from "./PercentagemPosicaoCurso.js";
import PreferenciasOpcaoCurso from "./PreferenciasOpcaoCurso.js";

class Data{

    plot_alternativas_candidatos(files_list, chart, chartOptions, plot, course = "all"){
        var min_year, max_year, isFirst = true;
        var dataClass = new AlternativasCandidatos();
        d3.csv(files_list, function(data){
            data.forEach(element => {
                if(course == "all" || element.course == course){
                    if(isFirst){
                        min_year = element.year;
                        max_year = element.year;
                        isFirst = false;
                    } else{
                        if(element.year > max_year){
                            max_year = element.year;
                        }
                        if(element.year < min_year){
                            min_year = element.year;
                        }
                    }
                }
            })
            plot.plot_alternativas_candidatos(files_list, dataClass, chart, chartOptions, min_year, max_year)
        });
    }

    plot_preferencias_opcoes(files_list, chart, chartOptions, plot, course = "all"){
        var min_year, max_year, isFirst = true;
        var dataClass = new PreferenciasOpcaoCurso();
        d3.csv(files_list, function(data){
            data.forEach(element => {
                if(course == "all" || element.course == course){
                    if(isFirst){
                        min_year = element.year;
                        max_year = element.year;
                        isFirst = false;
                    } else{
                        if(element.year > max_year){
                            max_year = element.year;
                        }
                        if(element.year < min_year){
                            min_year = element.year;
                        }
                    }
                }
            })
            plot.plot_preferencias_opcoes(files_list, dataClass, chart, chartOptions, min_year, max_year, course)
        });
    }

    set_course_selection(files_list, select_id){
        d3.csv(files_list, function(data){
            var courses = new Set();
            data.forEach(element => {
                courses.add(element.course);
            })
            for(var c of courses){
                d3.select(select_id).append("option")
                    .text(c)
                    .attr('value',c);
            }
        });
    }

    plot_notas_colocados(files_list, chart, plot, course){
        var yearsSet = new Set();
        var dataClass = new NotasColocados();
        d3.csv(files_list, function(data){
            data.forEach(element => {
                if(element.course == course){
                    yearsSet.add(element.year);
                }
            })
            var years = []
            for(var y of yearsSet){
                years.push(parseInt(y));
            }
            plot.plot_notas_colocados(files_list, dataClass, chart, years, course);
        });
    }

    plot_notas_ultimos_colocados(files_list, chart, plot){
        var yearsSet = new Set();
        var dataClass = new NotasUltimosColocados();
        d3.csv(files_list, function(data){
            data.forEach(element => {
                yearsSet.add(element.year);
            })
            var years = []
            for(var y of yearsSet){
                years.push(parseInt(y));
            }
            plot.plot_notas_ultimos_colocados(files_list, dataClass, chart, years);
        });
    }

    plot_evolucao(files_list, buttonID, plot, chart, chartOptions){
        var yearsSet = new Set();
        var dataClass = new PreferenciasOpcaoCurso();
        d3.csv(files_list, function(data){
            data.forEach(element => {
                yearsSet.add(element.year);
            })
            var years = []
            for(var y of yearsSet){
                years.push(parseInt(y));
            }
            plot.plot_evolucao(files_list, dataClass, buttonID, years, chart, chartOptions);
        });
    }

    plot_percentagem_posicao_curso(files_list, chart, plot, course = "all"){
        var yearsSet = new Set();
        var dataClass = new PercentagemPosicaoCurso();
        d3.csv(files_list, function(data){
            data.forEach(element => {
                if(course == "all" || element.course == course){
                    yearsSet.add(element.year);
                }
            })
            var years = []
            for(var y of yearsSet){
                years.push(parseInt(y));
            }
            plot.plot_percentagem_posicao_curso(files_list, dataClass, chart, years, course);
        });
    }
}

export default Data;