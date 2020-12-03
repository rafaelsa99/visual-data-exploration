class Data{

    notas_ultimos_colocados(files_list, plot){
        var grades_courses = []
        let count = 1;

        const append_data = (obj, pos) => {
            d3.csv(files_list, function(courses){
                if (pos == courses.length) {
                    grades_courses.push(obj)
                    console.log(grades_courses)
                    plot(grades_courses, ["valueA", "valueB"],['time'])
                } else {
                    grades_courses.push(obj)
                }   
            })
        }

        const incCount = () =>{
            count += 1;
        }
        d3.csv(files_list, function(data){
            data.forEach(element => {
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
                    append_data({"course": element.course, "year": parseInt(element.year), "minGrade": min_grade}, count)
                    incCount()
                })
            });
        })
    }

}

export default Data;