// API Key for OpenWeather
const apiKey = 'b7b1f0ad70509ca23301b5728eb11e20';

// Search button event listener
$( '#search-button' ).click(searchButton);
// Function for city input field and search button
function searchButton() {
    let citySearch = $('#city-search');
    let cityChoice = citySearch.val();
    citySearch.val('');
    cityWeatherInfo(cityChoice);
}
// AJAX call
function cityWeatherInfo(cityChoice) {
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityChoice}&appid=${apiKey}&units=imperial`;
    $.ajax ({
        url: queryURL,
        method: 'GET'
    }).then(displayWeather)
}
// Function to display weather data
function displayWeather(data) {
    var temp = data.main.temp;
    var city = data.name;
    var humid = data.main.humidity;
    var wind = data.wind.speed;
    var displayInfo = `
            <h2>${city}</h2>
            <p>temp: ${temp}&deg;F</p>
            <p>humidity: ${humid}%</p>
            <p>wind speed: ${wind}mph</p>
        `;
    $("#temp-display").html(displayInfo);
}


