//elements
let activeCityName = $('h3');
let cityButtons = $('.cityButton');
let citySearch = $('#citySearchInput');
let searchSubmit = $('#citySubmit');
let cardSection = $('.weekForecast');
let todaySection = $('#todayForecast')
let todayTitle = $('#todayTitle');
//weather api
let weathCurrentAPI = 'https://api.openweathermap.org/data/2.5/weather?q=';
let weathForecastAPI = 'https://api.openweathermap.org/data/2.5/onecall?'; //lat={lat}&lon={lon}&exclude={part}&appid={API key}
let imageURL = 'http://openweathermap.org/img/wn/';
let key = 'feaacbe35612b5e8da86660bd2717f54';

function showCurrentWeather(city, date, icon, temp, wind, humid, uvi) {
    todaySection.addClass('border - dark');
    //insert city, date and icon
    let weathImage = "http://openweathermap.org/img/wn/" + icon + ".png";
    todayTitle.text(city + date);
    todayTitle.append('<img src=' + weathImage + '>');
    //create ul for details
    todaySection.append('<ul id=todayDetails>');
    //insert lis for<li>Temp:</li><li>Wind:</li><li>Humidity:</li>UV Index
    $('#todayDetails').append('<li>Temp: ' + temp + '</li>');
    $('#todayDetails').append('<li>Wind: ' + wind + '</li>');
    $('#todayDetails').append('<li>Humidity: ' + humid + '</li>');
    $('#todayDetails').append('<li class="UVIndex">UV Index : ' + uvi + '</li>');
    if (uvi < 3) {
        $('.UVIndex').addClass('badge bg-success text-light');
    } else if (uvi >= 3 && uvi < 6) {
        $('.UVIndex').addClass('badge bg-warning text-dark');
    } else {
        $('.UVIndex').addClass('badge bg-danger text-light');
    }
}

function showForecastDetails(addWeatherInfo) {
    for (var i = 0; i < 6; i++) {
        let idCardName = "#dayPlus"+i;
        let cardTitle = $(idCardName);
        let cardDetail = $(idCardName+"Details");
        let weathCardImage = "http://openweathermap.org/img/wn/" + addWeatherInfo[i].weather[0].icon + ".png";
        let uvi = addWeatherInfo[i].uvi;
        fullDate = new Date(addWeatherInfo[i].dt * 1000).toLocaleString();
        let date = fullDate.split(',')[0];
        cardTitle.text(date);
        cardTitle.append('<img src=' + weathCardImage + '>');
        cardDetail.append('<li>Temp: ' + addWeatherInfo[i].temp.day + '</li>');
        cardDetail.append('<li>Wind: ' + addWeatherInfo[i].wind_speed + '</li>');
        cardDetail.append('<li>Humidity: ' + addWeatherInfo[i].humidity + '</li>');
        cardDetail.append('<li class="UVIndex">UV Index : ' + uvi + '</li>');
            if (uvi < 3) {
                $('.UVIndex').addClass('badge bg-success text-light');
            } else if (uvi >= 3 && uvi < 6) {
                $('.UVIndex').addClass('badge bg-warning text-dark');
            } else {
                $('.UVIndex').addClass('badge bg-danger text-light');
            }
    }

}

//funciton for city button creation
function createCityButton() {

}

async function getWeather(city, key) {
    //let the function know about the promise so it can wait for it, then when the promise is fulfilled, return the response object
    return fetch(weathCurrentAPI + city + '&appid=' + key + '&units=imperial')
        .then(function (response) {
            return response.json();
        })
}

async function getOneCall(lat, lon, key) {
    //let the function know about the promise so it can wait for it, then when the promise is fulfilled, return the response object
    return fetch(weathForecastAPI + 'lat=' + lat + '&lon=' + lon + '&exclude=minutely,hourly' + '&appid=' + key + '&units=imperial')
        .then(function (response) {
            return response.json();
        })
}

//function to create endpoint to call and get response
async function displayCityWeather(city, key) {
    //current fetch
    const weatherInfo = await getWeather(city, key);
    const addWeatherInfo = await getOneCall(weatherInfo.coord.lat, weatherInfo.coord.lon, key);
    //actually do things: date, city, icon for current and forecast
    let fullDate = new Date(weatherInfo.dt * 1000).toLocaleString();
    let date = fullDate.split(',')[0];
    showCurrentWeather(weatherInfo.name, date, weatherInfo.weather[0].icon, weatherInfo.main.temp, weatherInfo.wind.speed, weatherInfo.main.humidity, addWeatherInfo.current.uvi);
    showForecastDetails(addWeatherInfo.daily);
    let searchCityInfo = {
        'city': city,
        'lat' : weatherInfo.coord.lat,
        'lon' : weatherInfo.coord.lon
    }
    localStorage.setItem('city '+ city, JSON.stringify(searchCityInfo));
};



//for search click event
searchSubmit.submit(function (event) {
    event.preventDefault();
    //get city cleaned up
    let city = citySearch.val();
    city = city.replace(/\s/g, '');
    displayCityWeather(city, key);
    console.log('submitted');
    createCityButton();
});


//for history click event
$('.cityButton').on('click', function () {
    console.log('this name clicked ' + this.name);
    city = this.name;
    displayCityWeather(city, key);
});