class AlternativasCandidatos{
    
    alternativas_candidatos(files_list, year, plot, plotColors, opcao = 0){
        var candidaturas_alunos = new Map()
        let listCourses = new Map()
        var columns_courses = []
        let count = 1;
        let totalFiles = 0;
        let totalSum = 0;

        const append_data = (obj, candidaturas, pos) => {
            var i = candidaturas_alunos.size
            var course = new Map()
            course.set("course",obj.course)
            candidaturas_alunos.set(i, course);
            for (const [key, value] of candidaturas.entries()) {
                candidaturas_alunos.get(i).set(key, value);
            }
            if (pos == totalFiles) {
                plot.cleanPlot();
                plot.create_plot(get_Format(candidaturas_alunos), columns_courses, plotColors);
            }  
        }

        const get_Format = (map) => {
            var matrix = []
            for(var i of columns_courses){
                for(var j of map.values()){
                    if(j.get("course") == i){
                        var course = []
                        for(var c of columns_courses){
                            if(j.get(c) == undefined){
                                course.push(0);
                            } else {
                                course.push((j.get(c) / totalSum) * 100);
                            }
                        }
                        matrix.push(course);
                    }
                }
            }
            return matrix;
        }

        const incCount = () =>{
            count += 1;
        }

        const incTotalFiles = () =>{
            totalFiles += 1;
        }

        const incTotalSum = () =>{
            totalSum += 1;
        }

        const append_course = (name, codes) => {
            listCourses.set(name, codes);
        }

        const append_column_course = (name) => {
            columns_courses.push(name);
        }

        const is_relevant_course = (cod_c, cod_i) => {
            for(var j of listCourses.values()){
                if(j.cod_inst == cod_i && j.cod_course == cod_c){
                    return true;
                }
            }
            return false;
        }

        const is_different_course = (cod_c_1, cod_i_1, cod_c_2, cod_i_2) => {
            return !(cod_c_1 == cod_c_2 && cod_i_1 == cod_i_2);
        }

        const get_course_name = (cod_c, cod_i) => {
            for (const [key, value] of listCourses.entries()) {
                if(value.cod_inst == cod_i && value.cod_course == cod_c){
                    return key;
                }
            }
        }

        d3.csv(files_list, function(data){
            data.forEach(element => {
                if(element.year == year){
                    incTotalFiles()
                    append_course(element.course, {cod_inst:element.cod_institution, cod_course:element.cod_course});
                    append_column_course(element.course);
                }
            })
        });
        d3.csv(files_list, function(data){
            data.forEach(element => {
                if(element.year == year){
                    d3.text(element.filename, function(error, raw){
                        var dsv = d3.dsvFormat(';')
                        var data_file = dsv.parse(raw)
                        var candidaturas = new Map()
                        var course_name;
                        data_file.forEach(data => {
                            switch(opcao){
                                case 0: //All options
                                    if(!is_different_course(data.ColocCursoCodigo,data.ColocInstituicaoCodigo,element.cod_course, element.cod_institution)){ //Curso colocado
                                        course_name = get_course_name(data.ColocCursoCodigo,data.ColocInstituicaoCodigo)
                                        if(candidaturas.has(course_name)){
                                            candidaturas.set(course_name, candidaturas.get(course_name) + 1)
                                        } else {
                                            candidaturas.set(course_name, 1)
                                        }
                                        incTotalSum();
                                    }
                                    //Alternativas
                                    if(is_relevant_course(data.Opcao1CursoCodigo,data.Opcao1InstituicaoCodigo) && is_different_course(data.Opcao1CursoCodigo,data.Opcao1InstituicaoCodigo,element.cod_course, element.cod_institution)){
                                        course_name = get_course_name(data.Opcao1CursoCodigo,data.Opcao1InstituicaoCodigo)
                                        if(candidaturas.has(course_name)){
                                            candidaturas.set(course_name, candidaturas.get(course_name) + 1)
                                        } else {
                                            candidaturas.set(course_name, 1)
                                        }
                                        incTotalSum();
                                    }
                                    if(is_relevant_course(data.Opcao2CursoCodigo,data.Opcao2InstituicaoCodigo) && is_different_course(data.Opcao2CursoCodigo,data.Opcao2InstituicaoCodigo,element.cod_course, element.cod_institution)){
                                        course_name = get_course_name(data.Opcao2CursoCodigo,data.Opcao2InstituicaoCodigo)
                                        if(candidaturas.has(course_name)){
                                            candidaturas.set(course_name, candidaturas.get(course_name) + 1)
                                        } else {
                                            candidaturas.set(course_name, 1)
                                        }
                                        incTotalSum();
                                    }
                                    if(is_relevant_course(data.Opcao3CursoCodigo,data.Opcao3InstituicaoCodigo) && is_different_course(data.Opcao3CursoCodigo,data.Opcao3InstituicaoCodigo,element.cod_course, element.cod_institution)){
                                        course_name = get_course_name(data.Opcao3CursoCodigo,data.Opcao3InstituicaoCodigo)
                                        if(candidaturas.has(course_name)){
                                            candidaturas.set(course_name, candidaturas.get(course_name) + 1)
                                        } else {
                                            candidaturas.set(course_name, 1)
                                        }
                                        incTotalSum();
                                    }
                                    if(is_relevant_course(data.Opcao4CursoCodigo,data.Opcao4InstituicaoCodigo) && is_different_course(data.Opcao4CursoCodigo,data.Opcao4InstituicaoCodigo,element.cod_course, element.cod_institution)){
                                        course_name = get_course_name(data.Opcao4CursoCodigo,data.Opcao4InstituicaoCodigo)
                                        if(candidaturas.has(course_name)){
                                            candidaturas.set(course_name, candidaturas.get(course_name) + 1)
                                        } else {
                                            candidaturas.set(course_name, 1)
                                        }
                                        incTotalSum();
                                    }
                                    if(is_relevant_course(data.Opcao5CursoCodigo,data.Opcao5InstituicaoCodigo) && is_different_course(data.Opcao5CursoCodigo,data.Opcao5InstituicaoCodigo,element.cod_course, element.cod_institution)){
                                        course_name = get_course_name(data.Opcao5CursoCodigo,data.Opcao5InstituicaoCodigo)
                                        if(candidaturas.has(course_name)){
                                            candidaturas.set(course_name, candidaturas.get(course_name) + 1)
                                        } else {
                                            candidaturas.set(course_name, 1)
                                        }
                                        incTotalSum();
                                    }
                                    if(is_relevant_course(data.Opcao6CursoCodigo,data.Opcao6InstituicaoCodigo) && is_different_course(data.Opcao6CursoCodigo,data.Opcao6InstituicaoCodigo,element.cod_course, element.cod_institution)){
                                        course_name = get_course_name(data.Opcao6CursoCodigo,data.Opcao6InstituicaoCodigo)
                                        if(candidaturas.has(course_name)){
                                            candidaturas.set(course_name, candidaturas.get(course_name) + 1)
                                        } else {
                                            candidaturas.set(course_name, 1)
                                        }
                                        incTotalSum();
                                    }
                                    break;
                                case 1:
                                    if(!is_different_course(data.ColocCursoCodigo,data.ColocInstituicaoCodigo,element.cod_course, element.cod_institution) && !is_different_course(data.ColocCursoCodigo,data.ColocInstituicaoCodigo,data.Opcao1CursoCodigo,data.Opcao1InstituicaoCodigo)){ //Curso colocado
                                        course_name = get_course_name(data.ColocCursoCodigo,data.ColocInstituicaoCodigo)
                                        if(candidaturas.has(course_name)){
                                            candidaturas.set(course_name, candidaturas.get(course_name) + 1)
                                        } else {
                                            candidaturas.set(course_name, 1)
                                        }
                                        incTotalSum();
                                    }
                                    //Alternativa
                                    if(is_relevant_course(data.Opcao1CursoCodigo,data.Opcao1InstituicaoCodigo) && is_different_course(data.Opcao1CursoCodigo,data.Opcao1InstituicaoCodigo,element.cod_course, element.cod_institution)){
                                        course_name = get_course_name(data.Opcao1CursoCodigo,data.Opcao1InstituicaoCodigo)
                                        if(candidaturas.has(course_name)){
                                            candidaturas.set(course_name, candidaturas.get(course_name) + 1)
                                        } else {
                                            candidaturas.set(course_name, 1)
                                        }
                                        incTotalSum();
                                    }
                                    break;
                                case 2:
                                    if(!is_different_course(data.ColocCursoCodigo,data.ColocInstituicaoCodigo,element.cod_course, element.cod_institution) && !is_different_course(data.ColocCursoCodigo,data.ColocInstituicaoCodigo,data.Opcao2CursoCodigo,data.Opcao2InstituicaoCodigo)){ //Curso colocado
                                        course_name = get_course_name(data.ColocCursoCodigo,data.ColocInstituicaoCodigo)
                                        if(candidaturas.has(course_name)){
                                            candidaturas.set(course_name, candidaturas.get(course_name) + 1)
                                        } else {
                                            candidaturas.set(course_name, 1)
                                        }
                                        incTotalSum();
                                    }
                                    //Alternativa
                                    if(is_relevant_course(data.Opcao2CursoCodigo,data.Opcao2InstituicaoCodigo) && is_different_course(data.Opcao2CursoCodigo,data.Opcao2InstituicaoCodigo,element.cod_course, element.cod_institution)){
                                        course_name = get_course_name(data.Opcao2CursoCodigo,data.Opcao2InstituicaoCodigo)
                                        if(candidaturas.has(course_name)){
                                            candidaturas.set(course_name, candidaturas.get(course_name) + 1)
                                        } else {
                                            candidaturas.set(course_name, 1)
                                        }
                                        incTotalSum();
                                    }
                                    break;
                                case 3:
                                    if(!is_different_course(data.ColocCursoCodigo,data.ColocInstituicaoCodigo,element.cod_course, element.cod_institution) && !is_different_course(data.ColocCursoCodigo,data.ColocInstituicaoCodigo,data.Opcao3CursoCodigo,data.Opcao3InstituicaoCodigo)){ //Curso colocado
                                        course_name = get_course_name(data.ColocCursoCodigo,data.ColocInstituicaoCodigo)
                                        if(candidaturas.has(course_name)){
                                            candidaturas.set(course_name, candidaturas.get(course_name) + 1)
                                        } else {
                                            candidaturas.set(course_name, 1)
                                        }
                                        incTotalSum();
                                    }
                                    //Alternativa
                                    if(is_relevant_course(data.Opcao3CursoCodigo,data.Opcao3InstituicaoCodigo) && is_different_course(data.Opcao3CursoCodigo,data.Opcao3InstituicaoCodigo,element.cod_course, element.cod_institution)){
                                        course_name = get_course_name(data.Opcao3CursoCodigo,data.Opcao3InstituicaoCodigo)
                                        if(candidaturas.has(course_name)){
                                            candidaturas.set(course_name, candidaturas.get(course_name) + 1)
                                        } else {
                                            candidaturas.set(course_name, 1)
                                        }
                                        incTotalSum();
                                    }
                                    break;
                                case 4:
                                    if(!is_different_course(data.ColocCursoCodigo,data.ColocInstituicaoCodigo,element.cod_course, element.cod_institution) && !is_different_course(data.ColocCursoCodigo,data.ColocInstituicaoCodigo,data.Opcao4CursoCodigo,data.Opcao4InstituicaoCodigo)){ //Curso colocado
                                        course_name = get_course_name(data.ColocCursoCodigo,data.ColocInstituicaoCodigo)
                                        if(candidaturas.has(course_name)){
                                            candidaturas.set(course_name, candidaturas.get(course_name) + 1)
                                        } else {
                                            candidaturas.set(course_name, 1)
                                        }
                                        incTotalSum();
                                    }
                                    //Alternativa
                                    if(is_relevant_course(data.Opcao4CursoCodigo,data.Opcao4InstituicaoCodigo) && is_different_course(data.Opcao4CursoCodigo,data.Opcao4InstituicaoCodigo,element.cod_course, element.cod_institution)){
                                        course_name = get_course_name(data.Opcao4CursoCodigo,data.Opcao4InstituicaoCodigo)
                                        if(candidaturas.has(course_name)){
                                            candidaturas.set(course_name, candidaturas.get(course_name) + 1)
                                        } else {
                                            candidaturas.set(course_name, 1)
                                        }
                                        incTotalSum();
                                    }
                                    break;
                                case 5:
                                    if(!is_different_course(data.ColocCursoCodigo,data.ColocInstituicaoCodigo,element.cod_course, element.cod_institution) && !is_different_course(data.ColocCursoCodigo,data.ColocInstituicaoCodigo,data.Opcao5CursoCodigo,data.Opcao5InstituicaoCodigo)){ //Curso colocado
                                        course_name = get_course_name(data.ColocCursoCodigo,data.ColocInstituicaoCodigo)
                                        if(candidaturas.has(course_name)){
                                            candidaturas.set(course_name, candidaturas.get(course_name) + 1)
                                        } else {
                                            candidaturas.set(course_name, 1)
                                        }
                                        incTotalSum();
                                    }
                                    //Alternativa
                                    if(is_relevant_course(data.Opcao5CursoCodigo,data.Opcao5InstituicaoCodigo) && is_different_course(data.Opcao5CursoCodigo,data.Opcao5InstituicaoCodigo,element.cod_course, element.cod_institution)){
                                        course_name = get_course_name(data.Opcao5CursoCodigo,data.Opcao5InstituicaoCodigo)
                                        if(candidaturas.has(course_name)){
                                            candidaturas.set(course_name, candidaturas.get(course_name) + 1)
                                        } else {
                                            candidaturas.set(course_name, 1)
                                        }
                                        incTotalSum();
                                    }
                                    break;
                                case 6:
                                    if(!is_different_course(data.ColocCursoCodigo,data.ColocInstituicaoCodigo,element.cod_course, element.cod_institution) && !is_different_course(data.ColocCursoCodigo,data.ColocInstituicaoCodigo,data.Opcao6CursoCodigo,data.Opcao6InstituicaoCodigo)){ //Curso colocado
                                        course_name = get_course_name(data.ColocCursoCodigo,data.ColocInstituicaoCodigo)
                                        if(candidaturas.has(course_name)){
                                            candidaturas.set(course_name, candidaturas.get(course_name) + 1)
                                        } else {
                                            candidaturas.set(course_name, 1)
                                        }
                                        incTotalSum();
                                    }
                                    //Alternativa
                                    if(is_relevant_course(data.Opcao6CursoCodigo,data.Opcao6InstituicaoCodigo) && is_different_course(data.Opcao6CursoCodigo,data.Opcao6InstituicaoCodigo,element.cod_course, element.cod_institution)){
                                        course_name = get_course_name(data.Opcao6CursoCodigo,data.Opcao6InstituicaoCodigo)
                                        if(candidaturas.has(course_name)){
                                            candidaturas.set(course_name, candidaturas.get(course_name) + 1)
                                        } else {
                                            candidaturas.set(course_name, 1)
                                        }
                                        incTotalSum();
                                    }
                                    break;
                            }
                        });
                        append_data(element, candidaturas, count)
                        incCount()
                    })
                }
            });
            
        })
    }
}

export default AlternativasCandidatos;