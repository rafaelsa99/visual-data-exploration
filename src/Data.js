class Data{

    notas_ultimos_colocados(files_list, plot){
        var grades_courses = new Map()
        let years = new Map()
        let listCourses = new Set()
        let count = 1;
    

        const append_data = (obj, min_grade, pos) => {
            d3.csv(files_list, function(courses){
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
                if (pos == courses.length) {
                    plot(get_JSON_Format(grades_courses), Array.from(listCourses),['year'])
                }  
            })
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
                    append_data(element, min_grade, count)
                    incCount()
                })
            });
        })
    }

}

export default Data;