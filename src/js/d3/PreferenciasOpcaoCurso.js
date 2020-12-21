class PreferenciasOpcaoCurso{

    preferencias_opcoes(files_list, year, plot, plotOptions, courseChoose){
        var optionsCourse = new Map()
        let listCourses = new Map()
        let count = 1;
        let totalFiles = 0;
        let max = 0;

        const append_data = (obj, options, pos) => {
            var i = optionsCourse.size
            var course = new Map()
            course.set("course",obj.course)
            optionsCourse.set(i, course);
            for (const [key, value] of options.entries()) {
                if(value > max){
                    max = value;
                }
                optionsCourse.get(i).set(key, value);
            }
            if (pos == totalFiles) {
                plot.cleanPlotWithoutSmoothness();
                plotOptions.maxValue = max;
                plot.create_plot(get_JSON_Format(optionsCourse).filter(val => val.name == courseChoose), plotOptions)
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

    preferencias_opcoesM(files_list, year, plot, plotOptions){
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
                plot.cleanPlotWithoutSmoothness();
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

}

export default PreferenciasOpcaoCurso;