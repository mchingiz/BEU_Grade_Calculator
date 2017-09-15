var request = require("request");
var processHTML = require('./processHTML')

module.exports = {
    login: function(data){
        var options = {
            method: 'POST',
            url: 'https://my.qu.edu.az/loginAuth.php',
            jar:data.cookieJar,
            // headers: {
            //     // 'postman-token': 'e14d2590-baa9-2057-aa27-bc2da52b9bba',
            //     // 'user-agent':'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
            //     // 'cache-control': 'no-cache',
            //     'content-type': 'application/x-www-form-urlencoded'
            // },
            form:{
                username: data.username,
                password: data.password,
                LogIn: ' Daxil ol '
            },
            followAllRedirects: true
        };

        return new Promise(function(resolve,reject){
            request(options, function (error, response, body) {
                if (error){
                    reject({
                        statusCode: 500,
                        html: data.html,
                        messages: {
                            az: "Xəta baş verdi",
                            en_US: "Something went wrong"
                        }
                    })
                }else if(processHTML.credentialsAreWrong(body)){
                    reject({
                        statusCode: 400,
                        html: data.html,
                        messages: {
                            az: "Tələbə nömrəsi və ya parol doğru deyil",
                            en_US: "Credentials are wrong"
                        }
                    })
                }else{

                    data.html.homepage = body;

                    resolve(data);
                }
            });
        })
    },
    getGrades: function(data){
        var options = {
            method: 'POST',
            url: 'https://my.qu.edu.az/index.php',
            jar:data.cookieJar,
            headers: {
                'cache-control': 'no-cache',
                'content-type': 'application/x-www-form-urlencoded'
            },
            form: {
                ajx: '1',
                mod: 'grades',
                action: 'GetGrades',
                yt: '2016#2'
            }
        };

        return new Promise(function(resolve,reject){
            request(options,function(error,response,body){
                if (error){
                    // throw new Error(error);
                    reject({
                        statusCode: 500,
                        html: data.html,
                        messages: {
                            az: "Xəta baş verdi",
                            en_US: "Something went wrong"
                        }
                    })
                }else{
                    eval("var res = " + body);

                    data.html.gradesTable = res.DATA;

                    resolve(data);
                }
            })
        })
    },
    getCourses: function(data){
        var options = {
            method: 'POST',
            url: 'https://my.qu.edu.az/index.php',
            jar:data.cookieJar,
            headers: {
                'cache-control': 'no-cache',
                'content-type': 'application/x-www-form-urlencoded'
            },
            form: {
                ajx: '1',
                mod: 'ejurnal',
                action: 'getCourses',
                ysem: '2016#2'
            }
        };

        return new Promise(function(resolve,reject){
            request(options,function(error,response,body){
                if (error){
                    // throw new Error(error);
                    reject({
                        statusCode: 500,
                        html: data.html,
                        messages: {
                            az: "Xəta baş verdi",
                            en_US: "Something went wrong"
                        }
                    })
                }else{
                    data.html.coursesTable = body;
                    resolve(data);
                }
            })
        })
    },
    getAbsences: function(data){
        var options = {
            method: 'POST',
            url: 'https://my.qu.edu.az/index.php',
            jar:data.cookieJar,
            headers: {
                'cache-control': 'no-cache',
                'content-type': 'application/x-www-form-urlencoded'
            },
            form: {
                ajx: '1',
                mod: 'ejurnal',
                action: 'viewCourse',
                derst: data.courseId
            }
        };

        return new Promise(function(resolve,reject){
            request(options,function(error,response,body){
                eval("var res = " + body);
                if (error || res.CODE == "-1"){
                    // throw new Error(error);


                    reject({
                        statusCode: 500,
                        html: data.html,
                        messages: {
                            az: "Xəta baş verdi",
                            en_US: "Something went wrong"
                        }
                    })
                }else{

                    data.html.absencesTable = res.DATA;

                    resolve(data);
                }
            })
        })
    }
}

var toType = function(obj) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}