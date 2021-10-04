//elements
let activeCityName = $('h3');
let citySearchList = $('#cityOptions')
let citySearch = $('#citySearchInput');
let searchSubmit = $('#citySubmit');
let cardSection = $('.weekForecast');
let todaySection = $('#todayForecast')
let todayTitle = $('#todayTitle');
let showHidden = $('.noDisplayOnLoad')
//weather api
let weathCurrentAPI = 'https://api.openweathermap.org/data/2.5/weather?q=';
let weathForecastAPI = 'https://api.openweathermap.org/data/2.5/onecall?';
let imageURL = 'http://openweathermap.org/img/wn/';
let key = 'feaacbe35612b5e8da86660bd2717f54';

function buttonFromStorage() {
    let cityObject = JSON.parse(localStorage.getItem("history"));
    if (cityObject == null) {
        return;
    } else {
        for (var i = 0; i < cityObject.length; i++) {
            let stndCity = cityObject[i].city;
            createCityButton(stndCity)
        }
    }
}

function showCurrentWeather(city, date, icon, temp, wind, humid, uvi) {
    todaySection.addClass('border - dark');
    //insert city, date and icon
    let weathImage = "http://openweathermap.org/img/wn/" + icon + ".png";
    todayTitle.text(city+ " ("+ date+")");
    todayTitle.append('<img src=' + weathImage + '>');
    //create ul for details
    todaySection.append('<ul id=todayDetails>');
    $('#todayDetails').empty();
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
    $('#5DayTitle').text("5-Day Forecast:");
    showHidden.removeClass('noDisplayOnLoad');
    for (var i = 0; i < 6; i++) {
        let idCardName = "#dayPlus" + i;
        let cardTitle = $(idCardName);
        let cardDetail = $(idCardName + "Details");
        let weathCardImage = "http://openweathermap.org/img/wn/" + addWeatherInfo[i].weather[0].icon + ".png";
        let uvi = addWeatherInfo[i].uvi;
        fullDate = new Date(addWeatherInfo[i].dt * 1000).toLocaleString();
        let date = fullDate.split(',')[0];
        cardTitle.text(date);
        cardTitle.append('<img src=' + weathCardImage + '>');
        //clears all the child elements of the targeted element
        cardDetail.empty();
        cardDetail.append('<li>Temp: ' + addWeatherInfo[i].temp.day + '</li>');
        cardDetail.append('<li>Wind: ' + addWeatherInfo[i].wind_speed + '</li>');
        cardDetail.append('<li>Humidity: ' + addWeatherInfo[i].humidity + '</li>');
        cardDetail.append('<li id="UVIndex' + i + '">UV Index : ' + uvi + '</li>');
        if (uvi <= 3) {
            $('#UVIndex' + i).addClass('badge bg-success text-light')
        } else if (uvi > 3 && uvi <= 6) {
            $('#UVIndex' + i).addClass('badge bg-warning text-dark')
        } else {
            $('#UVIndex' + i).addClass('badge bg-danger text-light')
        }
    }
}

//funciton for city button creation
function createCityButton(stndCity) {
    citySearchList.prepend('<button type="button" id="' + stndCity + '" class="cityButton btn btn-block btn-secondary">' + stndCity + '</button>')
    let cityButtons = $('.cityButton');
    cityButtons.click(function (event) {
        event.preventDefault();
        console.log('this name clicked ' + this.id);
        let city = this.id;
        displayCityWeather(city, key);
    });

}

function clearInfo() {
    cardDetail.remove("li");
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
async function displayCityWeather(searchCity, key) {
    //current fetch
    const weatherInfo = await getWeather(searchCity, key);
    const addWeatherInfo = await getOneCall(weatherInfo.coord.lat, weatherInfo.coord.lon, key);
    //actually do things: date, city, icon for current and forecast

    let stndCity = weatherInfo.name
    let fullDate = new Date(weatherInfo.dt * 1000).toLocaleString();
    let date = fullDate.split(',')[0];
    showCurrentWeather(stndCity, date, weatherInfo.weather[0].icon, weatherInfo.main.temp, weatherInfo.wind.speed, weatherInfo.main.humidity, addWeatherInfo.current.uvi);
    showForecastDetails(addWeatherInfo.daily);
    let historyObject = JSON.parse(localStorage.getItem("history"));
    console.log("standard city " + stndCity)
    let searchCityInfo = [{
        'city': stndCity,
        'lat': weatherInfo.coord.lat,
        'lon': weatherInfo.coord.lon
    }];
    if (historyObject == null) {
        historyObject = [];
        localStorage.setItem('history', JSON.stringify(searchCityInfo));
        createCityButton(stndCity);
    } else {
        let addAButton = true;
        //parameter in a for each is just like a for loop but for that specified object
        historyObject.forEach(function (historyCity) {
            if (searchCityInfo[0].city === historyCity.city) {
                addAButton = false;
            }
        });
        if (addAButton) {
            let searchHistoryObject = historyObject.concat(searchCityInfo);
            localStorage.setItem('history', JSON.stringify(searchHistoryObject));
            createCityButton(stndCity);
        }
    }
};

buttonFromStorage();
//for search click event
searchSubmit.submit(function (event) {
    event.preventDefault();
    //get city cleaned up
    let city = citySearch.val();
    city = encodeURIComponent(city);
    displayCityWeather(city, key);
    console.log('submitted');
});