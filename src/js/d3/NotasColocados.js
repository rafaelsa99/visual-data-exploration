class NotasColocados{

    notas_colocados(files_list, course, min_year, max_year, plot){

        var grades = new Map()
        var grade = new Map()
        let totalFiles = 0;
        let count = 1;
        var axis_max = 0;
        const append_data = (obj, count_grades, pos) => {
            for (const [key, value] of count_grades.entries()) {
                var i;
                if(grade.has(key)){
                    i = grade.get(key);
                } else {
                    i = grades.size
                    var nota = new Map()
                    nota.set("nota",String(key))
                    grades.set(i, nota);
                    append_grade(key, i)
                }
                grades.get(i).set(String("Ano" + obj.year), String(value));
                if(value > axis_max){
                    axis_max = value;
                }
            }
            if (pos == totalFiles) {
                plot.clean_plot()
                plot.create_plot(get_JSON_Format(grades),['nota'],[0, axis_max],"Número de Colocados")
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
                    if (a.nota > b.nota) {
                        return 1; 
                    }
                    if (a.nota < b.nota) { 
                        return -1; 
                    } 
                    // a must be equal to b 
                    return 0; 
                }
            )
            var columns = ["nota"];
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
}

export default NotasColocados;