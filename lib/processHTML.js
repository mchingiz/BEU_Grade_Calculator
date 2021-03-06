var cheerio = require('cheerio');

module.exports = {

    getGrades: function(html){
        try{
            var $ = cheerio.load(html);
            var subjectCount = $('table tbody tr').length;
            console.log("subjectCount: "+subjectCount)

            var subjects = [];

            for(var i=2;i<=subjectCount-1;i++){
                var subject = {};

                subject.code = $('table tbody tr:nth-child('+i+') td:nth-child(1)').text();
                subject.name = $('table tbody tr:nth-child('+i+') td:nth-child(5)').text();
                console.log(subject.name);
                subject.ects = $('table tbody tr:nth-child('+i+') td:nth-child(6)').text().trim();
                subject.abs = $('table tbody tr:nth-child('+i+') td:nth-child(7)').text().trim();
                subject.sdf1 = $('table tbody tr:nth-child('+i+') td:nth-child(8)').text().trim();
                subject.sdf2 = $('table tbody tr:nth-child('+i+') td:nth-child(9)').text().trim();
                subject.sdf3 = $('table tbody tr:nth-child('+i+') td:nth-child(10)').text().trim();
                subject.ff = $('table tbody tr:nth-child('+i+') td:nth-child(11)').text().trim();
                subject.dvm = $('table tbody tr:nth-child('+i+') td:nth-child(12)').text().trim();
                subject.fnl = $('table tbody tr:nth-child('+i+') td:nth-child(13)').text().trim();
                subject.extraExam = $('table tbody tr:nth-child('+i+') td:nth-child(14)').text().trim();
                subject.retakeExam = $('table tbody tr:nth-child('+i+') td:nth-child(15)').text().trim();
                subject.avg = $('table tbody tr:nth-child('+i+') td:nth-child(16)').text().trim().replace("&nbsp;","");

                for(var key in subject){
                    if(subject[key] == "BORC"){
                        subject[key] = 0;
                    }
                }

                subjects.push(subject);
            }

            return subjects;
        }catch(err){
            return {
                error: true,
                statusCode: 500,
                html: html,
                messages: {
                    az: "Xəta baş verdi",
                    en_US: "Something went wrong"
                }
            }
        }
    },

    getSemesterAverage: function(html){
        var $ = cheerio.load(html);
        return $('table tbody tr:last-child td:last-child').text().replace(/<\/?[^>]+(>|$)/g, "").trim();
    },

    getCourses: function(html){
        try{
            var $ = cheerio.load(html);
            var courseCount = $('table tbody tr').length;

            var courses = [];

            console.log('processing courses');

            for(var i=2;i<=courseCount;i++){
                var course = {};

                course.id = $('table tbody tr:nth-child('+i+') td:nth-child(2) a').attr("onclick").substr(11,5);
                course.code = $('table tbody tr:nth-child('+i+') td:nth-child(2) a').text().trim();
                course.name = $('table tbody tr:nth-child('+i+') td:nth-child(3)').text().trim();
                course.teacher = $('table tbody tr:nth-child('+i+') td:nth-child(4)').text().trim();
                course.credit = $('table tbody tr:nth-child('+i+') td:nth-child(5)').text().trim();
                course.hour = $('table tbody tr:nth-child('+i+') td:nth-child(6)').text().trim();
                course.limit = $('table tbody tr:nth-child('+i+') td:nth-child(7)').text().trim();
                course.attended = $('table tbody tr:nth-child('+i+') td:nth-child(8)').text().trim();
                course.notAttended = $('table tbody tr:nth-child('+i+') td:nth-child(9)').text().trim();
                course.percent = $('table tbody tr:nth-child('+i+') td:nth-child(10)').text().trim();

                courses.push(course);
            }

            return courses;
        }catch(err){
            return {
                error: true,
                statusCode: 500,
                html: html,
                messages: {
                    az: "Xəta baş verdi",
                    en_US: "Something went wrong"
                }
            }
        }
    },

    getAbsences: function(html){
        try{
            var $ = cheerio.load(html);
            var lessonCount = $('table tbody tr').length;

            lessons = [];

            console.log('processing absences');

            for(var i=3;i<=lessonCount-2;i++){
                lesson = {};

                lesson.date = $('table tbody tr:nth-child('+i+') td:nth-child(2)').text();
                lesson.hour = $('table tbody tr:nth-child('+i+') td:nth-child(3)').text();
                lesson.absence = $('table tbody tr:nth-child('+i+') td:nth-child(4)').text();
                lesson.place = $('table tbody tr:nth-child('+i+') td:nth-child(5)').text();

                lessons.push(lesson);
            }

            return lessons;
        }catch(err){
            return {
                error: true,
                statusCode: 500,
                html: html,
                messages: {
                    az: "Xəta baş verdi",
                    en_US: "Something went wrong"
                }
            }
        }
    },

    credentialsAreWrong: function(html){
        var $ = cheerio.load(html);

        if($("input[name=username]").length == 0){
            return false;
        }else{
            return true;
        }
    },

    isThereAnnouncement: function(html){
        console.log("checking for announcement");

        var $ = cheerio.load(html);

        if($("form[name=stud_announce]").length == 0){
            console.log("no announcement");
            return false;
        }else{
            console.log("there is announcement");
            return true;
        }
    },

    getStudentFullname: function(html){
        var $ = cheerio.load(html);

        var fullname = $(".navbar .user span").text().replace(/<\/?[^>]+(>|$)/g, "").trim();

        return fullname;
    }
};


var toType = function(obj) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}
