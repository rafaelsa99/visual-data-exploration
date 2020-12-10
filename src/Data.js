class Data{

    notas_ultimos_colocados(files_list, min_year, max_year, plot){
        var grades_courses = new Map()
        let years = new Map()
        let listCourses = new Set()
        let count = 1;
        let totalFiles = 0;

        const append_data = (obj, min_grade, pos) => {
            append_course(obj.course)
            var i;
            if(years.has(obj.year)){
                i = years.get(obj.year);
            } else {
                i = grades_courses.size
                var year = new Map()
                year.set("year",obj.year)
                grades_courses.set(i, year);
                append_years(obj.year, i)
            }
            grades_courses.get(i).set(obj.course, String(min_grade));
            if (pos == totalFiles) {
                plot(get_JSON_Format(grades_courses), Array.from(listCourses),['year'],[100,200])
            }  
        }

        const get_JSON_Format = (map) => {
            var jsonArray = []
            for(var j of map.values()){
                jsonArray.push(Object.fromEntries(j));
            }
            jsonArray.sort(
                function (a, b) {
                    if (a.year > b.year) {
                        return 1; 
                    }
                    if (a.year < b.year) { 
                        return -1; 
                    } 
                    // a must be equal to b 
                    return 0; 
                }
            )
            return jsonArray;
        }

        const append_course = (value) => {
            listCourses.add(value)
        }

        const append_years = (value, index) => {
            years.set(value, index)
        }

        const incCount = () =>{
            count += 1;
        }

        const incTotalFiles = () =>{
            totalFiles += 1;
        }

        d3.csv(files_list, function(data){
            data.forEach(element => {
                if(element.year >= min_year && element.year <= max_year){
                    incTotalFiles()
                }
            })
        });
        d3.csv(files_list, function(data){
            data.forEach(element => {
                if(element.year >= min_year && element.year <= max_year){
                    d3.text(element.filename, function(error, raw){
                        var dsv = d3.dsvFormat(';')
                        var data_file = dsv.parse(raw)
                        var min_grade = 200
                        data_file.forEach(data => {
                            var grade = parseFloat(data.NotaCandidaturaCurso.replace(",", "."))
                            if(data.ColocCursoCodigo == element.cod_course && data.ColocInstituicaoCodigo == element.cod_institution && grade < min_grade){
                                min_grade = grade; 
                            }
                            });
                        append_data(element, min_grade, count)
                        incCount()
                    })
                }
            });
        })
    }

    percentagem_posicao_curso(files_list, course, min_year, max_year, plot){
        
        var countOptions = new Map()
        let totalFiles = 0;
        let count = 1;

        const append_data = (obj, options, pos) => {
            var i = countOptions.size
            var year = new Map()
            year.set("year",obj.year)
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
            if (pos == totalFiles) {
                plot(get_JSON_Format(countOptions), ['Opção1', 'Opção2', 'Opção3', 'Opção4', 'Opção5', 'Opção6'],['year'],[0,40])
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
                    if (a.year > b.year) {
                        return 1; 
                    }
                    if (a.year < b.year) { 
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

    notas_colocados(files_list, course, min_year, max_year, plot){

        var grades = new Map()
        var grade = new Map()
        let totalFiles = 0;
        let count = 1;

        const append_data = (obj, count_grades, pos) => {
            for (const [key, value] of count_grades.entries()) {
                var i;
                if(grade.has(key)){
                    i = grade.get(key);
                } else {
                    i = grades.size
                    var nota = new Map()
                    nota.set("grade",String(key))
                    grades.set(i, nota);
                    append_grade(key, i)
                }
                grades.get(i).set(String("Ano" + obj.year), String(value));
            }
            if (pos == totalFiles) {
                plot(get_JSON_Format(grades),['grade'])
            }
        }

        const incCount = () =>{
            count += 1;
        }

        const append_grade = (value, index) => {
            grade.set(value, index)
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
                    if (a.grade > b.grade) {
                        return 1; 
                    }
                    if (a.grade < b.grade) { 
                        return -1; 
                    } 
                    // a must be equal to b 
                    return 0; 
                }
            )
            var columns = ["grade"];
            for (var year = min_year; year <= max_year; year++) {
                columns.push("Ano" + year)
            }
            jsonArray.columns =  columns;
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
                        var countGrades = new Map()
                        data_file.forEach(data => {
                            if(data.ColocCursoCodigo == element.cod_course && data.ColocInstituicaoCodigo == element.cod_institution){
                                var grade = Math.round(parseFloat(data.NotaCandidaturaCurso.replace(",", ".")) / 10)
                                if(countGrades.has(grade)){
                                    countGrades.set(grade, countGrades.get(grade) + 1)
                                } else {
                                    countGrades.set(grade, 1)
                                }
                            }
                        });
                        append_data(element, countGrades, count)
                        incCount()
                    })
                }
            });
        })

    }

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
                plot.create_plot(get_Format(candidaturas_alunos), columns_courses, plotColors)
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

    preferencias_opcoes(files_list, year, plot, plotOptions){
        var optionsCourse = new Map()
        let listCourses = new Map()
        let count = 1;
        let totalFiles = 0;

        const append_data = (obj, options, pos) => {
            var i = optionsCourse.size
            var course = new Map()
            course.set("course",obj.course)
            optionsCourse.set(i, course);
            for (const [key, value] of options.entries()) {
                optionsCourse.get(i).set(key, value);
            }
            if (pos == totalFiles) {
                plot.create_plot(get_JSON_Format(optionsCourse), plotOptions)
            }  
        }

        const get_JSON_Format = (map) => {
            var jsonArray = []
            for(var j of map.values()){
                var axes = []
                var obj = new Object()
                for(var k of j){
                    if(k[0] == "course"){
                        obj["name"] = k[1];
                    } else {
                        var axesObj = new Object()
                        axesObj["axis"] = k[0]
                        axesObj["value"] = k[1];
                        axes.push(axesObj)
                    }
                }
                obj["axes"] = axes;
                jsonArray.push(obj);
            }
            for(var j of jsonArray){
                j.axes.sort(
                    function (a, b) {
                        if (a.axis > b.axis) {
                            return 1; 
                        }
                        if (a.axis < b.axis) { 
                            return -1; 
                        } 
                        // a must be equal to b 
                        return 0; 
                    }
                )
            }
            jsonArray.sort(
                function (a, b) {
                    if (a.name > b.name) {
                        return 1; 
                    }
                    if (a.name < b.name) { 
                        return -1; 
                    } 
                    // a must be equal to b 
                    return 0; 
                }
            )
            return jsonArray;
        }

        const incCount = () =>{
            count += 1;
        }

        const incTotalFiles = () =>{
            totalFiles += 1;
        }

        const append_course = (name, codes) => {
            listCourses.set(name, codes);
        }

        const is_relevant_course = (cod_c, cod_i) => {
            for(var j of listCourses.values()){
                if(j.cod_inst == cod_i && j.cod_course == cod_c){
                    return true;
                }
            }
            return false;
        }

        const is_same_course = (cod_c_1, cod_i_1, cod_c_2, cod_i_2) => {
            return (cod_c_1 == cod_c_2 && cod_i_1 == cod_i_2);
        }

        d3.csv(files_list, function(data){
            data.forEach(element => {
                if(element.year == year){
                    incTotalFiles()
                    append_course(element.course, {cod_inst:element.cod_institution, cod_course:element.cod_course});
                }
            })
        });
        d3.csv(files_list, function(data){
            data.forEach(element => {
                if(element.year == year){
                    d3.text(element.filename, function(error, raw){
                        var dsv = d3.dsvFormat(';')
                        var data_file = dsv.parse(raw)
                        var opcoes = new Map()
                        var option;
                        data_file.forEach(data => {
                            if(is_relevant_course(data.Opcao1CursoCodigo,data.Opcao1InstituicaoCodigo) && is_same_course(data.Opcao1CursoCodigo,data.Opcao1InstituicaoCodigo,element.cod_course, element.cod_institution)){
                                option = "Opção1";
                                if(opcoes.has(option)){
                                    opcoes.set(option, opcoes.get(option) + 1)
                                } else {
                                    opcoes.set(option, 1)
                                }
                            }
                            if(is_relevant_course(data.Opcao2CursoCodigo,data.Opcao2InstituicaoCodigo) && is_same_course(data.Opcao2CursoCodigo,data.Opcao2InstituicaoCodigo,element.cod_course, element.cod_institution)){
                                option = "Opção2";
                                if(opcoes.has(option)){
                                    opcoes.set(option, opcoes.get(option) + 1)
                                } else {
                                    opcoes.set(option, 1)
                                }
                            }
                            if(is_relevant_course(data.Opcao3CursoCodigo,data.Opcao3InstituicaoCodigo) && is_same_course(data.Opcao3CursoCodigo,data.Opcao3InstituicaoCodigo,element.cod_course, element.cod_institution)){
                                option = "Opção3";
                                if(opcoes.has(option)){
                                    opcoes.set(option, opcoes.get(option) + 1)
                                } else {
                                    opcoes.set(option, 1)
                                }
                            }
                            if(is_relevant_course(data.Opcao4CursoCodigo,data.Opcao4InstituicaoCodigo) && is_same_course(data.Opcao4CursoCodigo,data.Opcao4InstituicaoCodigo,element.cod_course, element.cod_institution)){
                                option = "Opção4";
                                if(opcoes.has(option)){
                                    opcoes.set(option, opcoes.get(option) + 1)
                                } else {
                                    opcoes.set(option, 1)
                                }
                            }
                            if(is_relevant_course(data.Opcao5CursoCodigo,data.Opcao5InstituicaoCodigo) && is_same_course(data.Opcao5CursoCodigo,data.Opcao5InstituicaoCodigo,element.cod_course, element.cod_institution)){
                                option = "Opção5";
                                if(opcoes.has(option)){
                                    opcoes.set(option, opcoes.get(option) + 1)
                                } else {
                                    opcoes.set(option, 1)
                                }
                            }
                            if(is_relevant_course(data.Opcao6CursoCodigo,data.Opcao6InstituicaoCodigo) && is_same_course(data.Opcao6CursoCodigo,data.Opcao6InstituicaoCodigo,element.cod_course, element.cod_institution)){
                                option = "Opção6";
                                if(opcoes.has(option)){
                                    opcoes.set(option, opcoes.get(option) + 1)
                                } else {
                                    opcoes.set(option, 1)
                                }
                            }
                        });
                        append_data(element, opcoes, count)
                        incCount()
                    })
                }
            });
            
        })
    }

    get_range_years(files_list, sliderFunction, course = "all"){
        var min_year, max_year, isFirst = true, count = 0;
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
            //sliderFunction(min_year, max_year);
        });
    }

}

export default Data;