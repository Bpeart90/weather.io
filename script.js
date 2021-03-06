var citiesListEl = $("#city")
var cities = []
var cityName, fiveDayQueryURL, weatherData, currentWeatherIcon, currentWeatherIconEl, weathericon, currentTemp, weatherCard, cityDateEl, tempEl, humidityEl, windspeedEl, fiveDayQueryParams, fiveDayList;
//Function to pull the information from the API
function buildQueryUrl() {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?";
    var queryParams = { "appid": "8560bcb86936cab67ed979c86ef5fd89" };
    queryParams.q = $("#search-term").val().trim();
    queryParams.units = "imperial"
    return queryURL + $.param(queryParams);
}
//function to pull the 5 day forecast API
function buildFiveDayQueryUrl() {
    var fiveDayQueryURL = "https://api.openweathermap.org/data/2.5/forecast?";
    var fiveDayQueryParams = { "appid": "8560bcb86936cab67ed979c86ef5fd89" };
    fiveDayQueryParams.id = data.id;
    fiveDayQueryParams.units = "imperial";
    return fiveDayQueryURL + $.param(fiveDayQueryParams);
}
//function to search the cities
init();
function renderCities() {
    if (cities.length > 5) {
        cities.shift();
    }
    // for formula to style and list cities
    for (var i = 0; i < cities.length; i++) {
        var city = cities[i];
        var li = $("<li>")
        var button = $("<button>");
        button.text(city);
        button.attr("data-index", i);
        button.attr("style", "width: 100%")
        button.addClass("btn shadow-box btn-info hist-button");
        li.append(button);
        $("#city").prepend(li);
        $("#city").prepend("<br>");
    }
}
//function to save the cities.
function init() {
    $("#city").empty();
    var storedCities = JSON.parse(localStorage.getItem("cities"));
    if (storedCities !== null) {
        cities = storedCities;
    }
    renderCities();
}
//function to pull the current and 5 day forecasts
$(".search-button").on("click", function (event) {
    event.preventDefault();
    $("#current-day-forecast").empty();
    $("#five-day-forecast").empty();
    var searchHistory = $("#search-term").val().trim();
    if (searchHistory === "") {
        return;
    };
    cities.push(searchHistory)
    localStorage.setItem("cities", JSON.stringify(cities));
    queryURL = buildQueryUrl();
    var fiveDayQueryURL;
    // current forecast ajax
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (data) {
        function buildCurrentWeatherCard() {
            $(weatherCard).append(cityDateEl);
            $(weatherCard).append(weathericon)
            $(weatherCard).append(tempEl);
            $(weatherCard).append(humidityEl);
            $(weatherCard).append(windspeedEl);
            $("#current-day-forecast").append(weatherCard);
        }
        var date = moment().format("MMM Do YY");
        var weatherData = data;
        var currentWeatherIcon = data.weather[0].icon;
        var currentWeatherIconEl = "https://openweathermap.org/img/wn/" + currentWeatherIcon + "@2x.png";
        var weathericon = $("<img/>", {
            id: "weather-icon",
            src: currentWeatherIconEl,
            width: 75
        });
        var currentTemp = Math.floor(weatherData.main.temp);
        var weatherCard = $("<div>").addClass("card weather-card current-day-weather");
        var cityDateEl = $("<h5>").addClass("card-title").text(weatherData.name + " " + "(" + date + ")");
        var tempEl = $("<p>").addClass("card-text").text("Temp: " + currentTemp + " F");
        var humidityEl = $("<p>").addClass("card-text text-nowrap").text("Humidity: " + weatherData.main.humidity + " %");
        var windspeedEl = $("<p>").addClass("card-text").text("Windspeed: " + weatherData.wind.speed + " mph");
        buildCurrentWeatherCard();
        function buildFiveDayQueryUrl() {
            var fiveDayQueryURL = "https://api.openweathermap.org/data/2.5/forecast?";
            var fiveDayQueryParams = { "appid": "8560bcb86936cab67ed979c86ef5fd89" };
            fiveDayQueryParams.id = data.id;
            fiveDayQueryParams.units = "imperial";
            return fiveDayQueryURL + $.param(fiveDayQueryParams);
        }
        fiveDayQueryURL = buildFiveDayQueryUrl();
        // five day forecast ajax 
        $.ajax({
            url: fiveDayQueryURL,
            method: "GET"
        }).then(function (fiveData) {
            fiveDayList = fiveData.list;
            for (var i = 4; i < fiveDayList.length; i += 8) {
                var day = fiveDayList[i];
                var dayIcon = day.weather[0].icon;
                var dayWeatherIcon = "https://openweathermap.org/img/wn/" + dayIcon + ".png";
                var dayIconEl = $("<img/>", {
                    id: "weather-icon",
                    src: dayWeatherIcon,
                    width: 50
                })
                var dayTempEl = Math.floor(day.main.temp);
                var dayCard = $("<div>").addClass("card weather-card col-lg bg-info text-white mr-md-2 mb-3");
                var dayDate = $("<h5>").attr("style", "font-size:100%").addClass("card-title text-nowrap").text(moment().add(1, 'days').format('L'));
                var dayTemp = $("<p>").addClass("card-text").text("Temp: " + dayTempEl + " F");
                var dayHum = $("<p>").addClass("card-text text-nowrap").text("Humidity: " + day.main.humidity);
                $(dayCard).append(dayDate);
                $(dayCard).append(dayIconEl)
                $(dayCard).append(dayTemp);
                $(dayCard).append(dayHum);
                $("#five-day-forecast").append(dayCard);
            }
        })
        var uvIndexEl;
        var uvQueryURL = "https://api.openweathermap.org/data/2.5/uvi?" + "lat=" + data.coord.lat + "&lon=" + data.coord.lon + "&appid=8560bcb86936cab67ed979c86ef5fd89"
        buildCurrentWeatherCard();
        // uv index ajax call
        $.ajax({
            url: uvQueryURL,
            method: "GET"
        }).then(function (response) {
            uvIndexEl = response.value
            uvIndexTag = $("<p>").text("UV Index: " + uvIndexEl)
            $(".current-day-weather").append(uvIndexTag)
        })
        $("#search-term").val(null)
        init();
    });
});

function buildQueryUrlHist() {
    var queryURLHist = "https://api.openweathermap.org/data/2.5/weather?";
    var queryParamsHist = { "appid": "8560bcb86936cab67ed979c86ef5fd89" };
    queryParamsHist.q = cityName;
    queryParamsHist.units = "imperial"
    return queryURLHist + $.param(queryParamsHist);
};
function buildCurrentWeatherCardHist() {
    $(weatherCard).append(cityDateEl);
    $(weatherCard).append(weathericon)
    $(weatherCard).append(tempEl);
    $(weatherCard).append(humidityEl);
    $(weatherCard).append(windspeedEl);
    $("#current-day-forecast").append(weatherCard);
};


$("#city").on("click", "button", function () {
    // event.preventDefault();
    $("#current-day-forecast").empty();
    $("#five-day-forecast").empty();
    cityName = $(this).text();
    queryURLHist = buildQueryUrlHist();
    $.ajax({
        url: queryURLHist,
        method: "GET"
    }).then(function (data) {
        // Current Day Card 
        weatherData = data;
        // current weather card
        currentWeatherIcon = data.weather[0].icon;
        date = moment().format("MMM Do YY");
        currentWeatherIconEl = "https://openweathermap.org/img/wn/" + currentWeatherIcon + "@2x.png";
        weathericon = $("<img/>", {
            id: "weather-icon",
            src: currentWeatherIconEl,
            width: 75
        });
        currentTemp = Math.floor(weatherData.main.temp);
        weatherCard = $("<div>").addClass("card weather-card current-day-weather");
        cityDateEl = $("<h5>").addClass("card-title").text(weatherData.name + " " + "(" + date + ")");
        tempEl = $("<p>").addClass("card-text").text("Temp: " + currentTemp + " F");
        humidityEl = $("<p>").addClass("card-text text-nowrap").text("Humidity: " + weatherData.main.humidity + " %");
        windspeedEl = $("<p>").addClass("card-text").text("Windspeed: " + weatherData.wind.speed + " mph");
        var uvIndexEl;
        var uvQueryURL = "https://api.openweathermap.org/data/2.5/uvi?" + "lat=" + data.coord.lat + "&lon=" + data.coord.lon + "&appid=8560bcb86936cab67ed979c86ef5fd89"
        buildCurrentWeatherCardHist();
        $.ajax({
            url: uvQueryURL,
            method: "GET"
        }).then(function (response) {
            uvIndexEl = response.value;
            uvIndexTag = $("<p>").text("UV Index: " + uvIndexEl);
            $(".current-day-weather").append(uvIndexTag);
        })
        // Current Day Card  
        // Five Day Forecast 
        function buildFiveDayQueryUrlHist() {
            var fiveDayQueryURL = "https://api.openweathermap.org/data/2.5/forecast?";
            var fiveDayQueryParams = { "appid": "8560bcb86936cab67ed979c86ef5fd89" };
            fiveDayQueryParams.id = data.id;
            fiveDayQueryParams.units = "imperial";
            return fiveDayQueryURL + $.param(fiveDayQueryParams);
        }
        fiveDayQueryURL = buildFiveDayQueryUrlHist();
        $.ajax({
            url: fiveDayQueryURL,
            method: "GET"
        }).then(function (fiveData) {
            fiveDayList = fiveData.list;
            for (var i = 4; i < fiveDayList.length; i += 8) {
                var day = fiveDayList[i];
                var dayIcon = day.weather[0].icon;
                var dayWeatherIcon = "https://openweathermap.org/img/wn/" + dayIcon + ".png";
                var dayIconEl = $("<img/>", {
                    id: "weather-icon",
                    src: dayWeatherIcon,
                    width: 50
                })
                var dayTempEl = Math.floor(day.main.temp);
                var dayCard = $("<div>").addClass("card weather-card col-lg bg-info text-white mr-md-2 mb-3");
                var dayDate = $("<h5>").attr("style", "font-size:100%").addClass("card-title text-nowrap").text(moment().add(1, 'days').format('L'));
                var dayTemp = $("<p>").addClass("card-text").text("Temp: " + dayTempEl + " F");
                var dayHum = $("<p>").addClass("card-text text-nowrap").text("Humidity: " + day.main.humidity);
                $(dayCard).append(dayDate);
                $(dayCard).append(dayIconEl);
                $(dayCard).append(dayTemp);
                $(dayCard).append(dayHum);
                $("#five-day-forecast").append(dayCard);
            }
        })
    })
})