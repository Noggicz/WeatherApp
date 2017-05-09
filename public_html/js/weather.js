/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var urlOnce = 'http://api.openweathermap.org/data/2.5/weather?q=Ostrava&units=metric&lang=en&appid=abcb921ca7be6867b0b964ece67ac025';
var forecastDaily = 'http://api.openweathermap.org/data/2.5/forecast/daily?q=Ostrava&units=metric&lang=en&cnt=7&appid=abcb921ca7be6867b0b964ece67ac025';

$(document).on("pagecreate", "#page1", function (event) {
 
    if (navigator.onLine) {
        getForeCast(forecastDaily);
        getWeatherToday(urlOnce);
        searchName();
    } else {
        getWeatherFromMem();
    }
});

function Empty() {
    $('.location').empty();
    $('.today').empty();
    $('#svg').empty();
    $('.temperature').empty();
    $('.weather-max-temperature').empty();
    $('.desc').empty();
    $('.weather-humidity').empty();
    $('.weather-wind-speed').empty();
    $('.weather-sunrise').empty();
    $('.weather-sunset').empty();
    

}

/*Online*/
function getWeatherToday(urlOnce) {
    Empty();
    $.ajax({
        dataType: "json",
        url: urlOnce,
        success: function (data) {
            var index = localStorage.length;

            var SunriseSec = data["sys"].sunrise;
            var SunriseDate = new Date(SunriseSec * 1000);
            var SunriseTimestr = SunriseDate.toLocaleTimeString();

            var SunsetSec = data["sys"].sunset;
            var SunsetDate = new Date(SunsetSec * 1000);
            var SunsetTimestr = SunsetDate.toLocaleTimeString();

             
            $('.location').append(data["name"]);
            $('.temperature').append(Math.round(data["main"].temp)+"°");
            $('.weather-max-temperature').append(data["main"].temp_max + "°C");
            $('.desc').append(data["weather"][0].description);
            $('.weather-humidity').append(data["main"].humidity + "%");
            $('.weather-wind-speed').append(data["wind"].speed + " m/s");
            $('.weather-sunrise').append(SunriseTimestr);
            $('.weather-sunset').append(SunsetTimestr);

            localStorage[data["name"]] = data["name"] +";"+ data["main"].temp +";"+ data["main"].temp_max +";"+ data["weather"][0].description +";"+ data["main"].humidity +";"+ data["wind"].speed +";"+data["weather"][0].id+";"+ SunriseTimestr +";"+ SunsetTimestr;
            index++;
            getSVG(data["weather"][0].id, SunsetTimestr, SunriseTimestr);
        }
    });
    var today = new Date();
    $('.today').append(today.toDateString());

}


function getForeCast(forecastDaily) {
  Empty();
 $.ajax({
    dataType: "json",
    url: forecastDaily, 
    success: function (data) {
        var pom = [];
        var date= new Date();
        var pomDate =[];
        var countPolozek;
         var weekday = new Array(7);
            weekday[0] = "Sunday";
            weekday[1] = "Monday";
            weekday[2] = "Tuesday";
            weekday[3] = "Wednesday";
            weekday[4] = "Thursday";
            weekday[5] = "Friday";
            weekday[6] = "Saturday";
         var teplota= new Array(7);
         var id = new Array(7);
         $.each(data['list'], function (i, field) {
            pom[i]= field.dt;
            teplota[i]=field.temp.day;
            id[i]=field.weather[0]['id'];
           
         });
         /*Prevod datumu*/
         var mon = new Date(pomDate[6]);
         var day = new Array(7);
         for(var i=0;i<=pom.length;i++){
             date = new Date(pom[i]*1000);
             pomDate[i]=date;
             pomDate[i]=pomDate[i].toLocaleDateString();
             day[i]= date.getDay();
         }
           console.log(weekday[day[0]]); 
          var today = new Date();
          var actual;
         for(var i=0;i<7;i++){
             if(pomDate[i]===today.toLocaleDateString())
             {
                 $('#made').append("\
                <li id="+i+" class=\""+getClimacon(id[i])+" active\">\n\
                  <div class=\"inner\">\n\
                      <h5 class=\"week-day\">"+weekday[day[i]]+"</h5>\n\
                      <i class=\"climacon "+getClimacon(id[i])+"\"></i>\n\
                      <p class=\"week-day-temperature\">"+Math.round(teplota[i])+"°</p>\n\
                       <p>"+pomDate[i]+"</p>\n\
                  </div>\n\
                </li> ");   
             }else  $('#made').append("\
                <li id="+i+" class=\""+getClimacon(id[i])+"\">\n\
                  <div class=\"inner\">\n\
                      <h5 class=\"week-day\">"+weekday[day[i]]+"</h5>\n\
                      <i class=\"climacon "+getClimacon(id[i])+"\"></i>\n\
                      <p class=\"week-day-temperature\">"+Math.round(teplota[i])+"°</p>\n\
                       <p>"+pomDate[i]+"</p>\n\
                  </div>\n\
                </li> "); 
         } 
    }
 });
}
function getClimacon(id){
   if (id >= 200 && id <= 232) {
          return 'lighting';
        } else if (id >= 300 && id <= 321) {
           return 'drizzle'; 
        } else if (id >= 500 && id <= 531) {
           return 'rain';
        } else if (id >= 600 && id <= 622) {
           return 'snow';
        } else if (id >= 701 && id <= 781) {
           return 'fog';
        } else if (id === 800) {
           return 'sun';
        } else if (id >= 801 && id <= 804) {
            return 'cloud';
        }
        else if (id >= 901 && id <= 806) {
            return 'tornado';
        }
    
}
function searchName() {
    var pom = "";
    $.getJSON('city/cities.json', function (data) {
        $('#MySelect').empty();
        $.each(data['data'], function (i, field) {
            pom += '<a href="" id="' + i + '" class="a ui-btn ui-corner-all ui-shadow ui-shadow ui-screen-hidden">' + field.name + ", " + field.cc + '</a>';
        });
        $('#MySelect').html(pom);
        $('.a').click(function () {
            var id;
            id = $(this).attr('id');
            getWeatherToday("http://api.openweathermap.org/data/2.5/weather?q=" + data['data'][id]['name'] + "&units=metric&lang=en&appid=abcb921ca7be6867b0b964ece67ac025");
        });
    });
}
/*Ofline*/
function getWeatherFromMem(){
    Empty();
    index = localStorage.length;
    var obj;
    obj = localStorage.getItem("Ostrava");
    var pom = obj.split(";");
    $('.location').append(pom[0]);
    $('.temperature').append(pom[1]);
    $('.weather-max-temperature').append(pom[2]+"°C");
    $('.desc').append(pom[3]);
    $('.weather-humidity').append(pom[4]+ "%");
    $('.weather-wind-speed').append(pom[5] + " m/s");
    $('.weather-sunrise').append(pom[7]);
    $('.weather-sunset').append(pom[8]);   
    getSVG(pom[6], pom[8], pom[7]);
}
function searchWeathFromMem(){
    
    
}
/*Media*/
function getSVG(id, SunSet, SunRise) {  
    var time = new Date();
    /*noc*/
    if (time.toLocaleTimeString() < SunSet && SunRise>time.toLocaleTimeString()) {
        if (id >= 200 && id <= 232) {
            $('#svg').append(
                    "<object data=\"svgs/cloudLightningMoon.svg\" type=\"image/svg+xml\">\n\
                <img src=\"svgs/cloudLightningMoon.svg\" />\n\
               </object> ");
        } else if (id >= 300 && id <= 321) {
            $('#svg').append(
                    "<object data=\"svgs/cloudDrizzleMoon.svg\" type=\"image/svg+xml\">\n\
                <img src=\"svgs/cloudDrizzleMoon.svg\" />\n\
               </object> ");
        } else if (id >= 500 && id <= 531) {
            $('#svg').append(
                    "<object data=\"svgs/cloudRainMoon.svg\" type=\"image/svg+xml\">\n\
                <img src=\"svgs/cloudRainMoon.svg\" />\n\
               </object> ");
        } else if (id >= 600 && id <= 622) {
            $('#svg').append(
                    "<object data=\"svgs/cloudSnowMoon.svg\" type=\"image/svg+xml\">\n\
                <img src=\"svgs/cloudSnowMoon.svg\" />\n\
               </object> ");
        } else if (id >= 701 && id <= 781) {
            $('#svg').append(
                    "<object data=\"svgs/cloudFogMoon.svg\" type=\"image/svg+xml\">\n\
                <img src=\"svgs/cloudFogMoon.svg\" />\n\
               </object> ");
        } else if (id === 800) {
            $('#svg').append(
                    "<object data=\"svgs/moon.svg\" type=\"image/svg+xml\">\n\
                <img src=\"svgs/moon.svg\" />\n\
               </object> ");
        } else if (id >= 801 && id <= 804) {
            $('#svg').append(
                    "<object data=\"svgs/cloudMoon.svg\" type=\"image/svg+xml\">\n\
                <img src=\"svgs/cloudMoon.svg\" />\n\
               </object> ");
        }
    }
    /*Den*/
    else if (time.toLocaleTimeString() >SunSet && SunRise<time.toLocaleTimeString()) {
        if (id >= 200 && id <= 232) {
            $('#svg').append(
                    "<object data=\"svgs/cloudLightningSun.svg\" type=\"image/svg+xml\">\n\
                <img src=\"svgs/cloudLightningSun.svg\" />\n\
               </object> ");
        } else if (id >= 300 && id <= 321) {
            $('#svg').append(
                    "<object data=\"svgs/cloudDrizzleSun.svg\" type=\"image/svg+xml\">\n\
                <img src=\"svgs/cloudDrizzleSun.svg\" />\n\
               </object> ");
        } else if (id >= 500 && id <= 531) {
            $('#svg').append(
                    "<object data=\"svgs/cloudRainSun.svg\" type=\"image/svg+xml\">\n\
                <img src=\"svgs/cloudRainSun.svg\" />\n\
               </object> ");
        } else if (id >= 600 && id <= 622) {
            $('#svg').append(
                    "<object data=\"svgs/cloudSnowSun.svg\" type=\"image/svg+xml\">\n\
                <img src=\"svgs/cloudSnowSun.svg\" />\n\
               </object> ");
        } else if (id >= 701 && id <= 781) {
            $('#svg').append(
                    "<object data=\"svgs/cloudFogSun.svg\" type=\"image/svg+xml\">\n\
                <img src=\"svgs/cloudFogSun.svg\" />\n\
               </object> ");
        } else if (id === 800) {
            $('#svg').append(
                    "<object data=\"svgs/sun.svg\" type=\"image/svg+xml\">\n\
                <img src=\"svgs/sun.svg\" />\n\
               </object> ");
        } else if (id >= 801 && id <= 804) {
            $('#svg').append(
                    "<object data=\"svgs/cloudSun.svg\" type=\"image/svg+xml\">\n\
                <img src=\"svgs/cloudSun.svg\" />\n\
               </object> ");
        }

    }
}

