var newDate = new Date();
var nowDate = moment().format('MMMM Do YYYY, h:mm:ss a');
var displayDate = document.getElementById('currentDay');
  displayDate.innerHTML = nowDate;
//   Variables for time
var m = moment();
var nowTime = m.format('LTS');
var nowHour = newDate.getHours();

const apiKey = 'b7b1f0ad70509ca23301b5728eb11e20';

$(document).ready(init);
// Event listener for clicking search button
function init () {
    $('nav button').click(searchButton);
    getCityButtons();
}

function searchButton() {
//grab search bar input
var inputCity = $('nav input');
var cityChoice = inputCity.val();
inputCity.val('');
//then call getCityData
cityData(cityChoice); 
}
// First ajax call
function cityData(cityChoice) {
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityChoice}&appid=${apiKey}&units=imperial`;
    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(cityLatLon);
}
// Get location by latitude and longitude
function cityLatLon(data) {
    mainForecastDisplay(data);
    var cityChoice = data.name;
    addCityButton(cityChoice);
    getCityButtons();
    var lat = data.coord.lat;
    var long = data.coord.lon;
    getLatLonForecast(lat,long);
}
// Second ajax call
function getLatLonForecast(lat,long){
    var queryURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&appid=${apiKey}&units=imperial`;
    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(diaplayFiveDay);
}
// UV Color display by severity
function uvIndexDisplay (UV) {
    var uvIndex = 'favorable';
    if(UV > 6) {
        uvIndex = 'severe';  
    } else if (UV>=3) {
        uvIndex = 'moderate';
    }
    $('#UV').addClass(uvIndex).text('UV Index: ' + UV);
}
// 5-day Tiles Display
function diaplayFiveDay (data) {
    console.log(data);
    var UV = data.daily[0].uvi;
    uvIndexDisplay(UV); 
    var html = '<h3>5 Day Forecast:</h3>';
    for (let i = 1; i < 6; i++) {
        var day = data.daily[i];
        var temp = day.temp.day;
        var humidity = day.humidity;
        var icon = day.weather[0].icon;
        var date = (new Date(day.dt*1000)).toDateString();
        html += `
        <div class="col-md-2 boxes">
            <h4>${date}</h4>
            <img src='http://openweathermap.org/img/wn/${icon}@2x.png'>
            <p>Temperature: ${temp}&deg;F</p>
            <p>Humidity: ${humidity}%</p>   
        </div>
        `;
    }
    $('#row-3').html(html);
}
// Main forecast display for current day (includes UV index)
function mainForecastDisplay(data) {
    var temp = data.main.temp;
    var cityChoice = data.name;
    var humid = data.main.humidity;
    var wind = data.wind.speed;
    var date = (new Date(data.dt*1000)).toDateString();
    var icon = data.weather[0].icon;
    var html = `
        <h2>${cityChoice} ${date}</h2> 
        <img src='http://openweathermap.org/img/wn/${icon}@2x.png'>
        <p>Temperature: ${temp}&deg;F</p>
        <p>Humidity: ${humid}%</p>
        <p>Wind Speed: ${wind} mph</p>
        <p id='UV'></p>
    `;
    $("#main .card-body").html(html);
 }

function getStoredCities () {
    var cities = localStorage.getItem('cities');
    if(cities){
        return JSON.parse(cities);
    } 
    return [];
}

function addCityButton(cityChoice) {
    var cities = getStoredCities();
    if(!cities.includes(cityChoice)) {
        cities.unshift(cityChoice);
        localStorage.setItem('cities', JSON.stringify(cities));
    }
}

function getCityButtons () {
    var cities = getStoredCities();
    var html='';
    for(let cityChoice of cities){
        html+=`<button type='button' class='list-group-item list-group-item-action'>${cityChoice}</button>`;
    }
    $('#city-buttons').html(html);
    $('#city-buttons button').click(clickSavedCityButtons)
}

function clickSavedCityButtons () {
    var cityChoice = $(this).text();
    cityData(cityChoice);
}