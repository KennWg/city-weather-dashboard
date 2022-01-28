var displayEl = document.getElementById("display-area"),
    searchInput = document.getElementById("city-search"),
    searchForm = document.getElementById("search-form"),
    DateTime = luxon.DateTime,
    savedCities = [],
    historyList = document.getElementById("history-list");

//search form handler
var searchHandler = function(event){
    event.preventDefault();
    var city = searchInput.value.trim();
    if(city){
        getCoordinates(city);
    } else {
        displayEl.textContent = "Please enter a city."
    }
};

//function to get lat and long
var getCoordinates = function(city){
    var apiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=5&appid=dummyid";

    fetch(apiUrl).then(function(response){
        response.json().then(function(data){
            if(data.length>0){
                console.log(data);
                displayCities(data);
            } else {
                displayEl.textContent = "No results found.";
            }
        });
    }).catch(function(error){
        displayEl.textContent = "Error in connecting to weather data";
    });
}

//function to display city options
var displayCities = function(data){
    //clear old content
    displayEl.textContent = "";
    var titleEl = document.createElement("span");
    titleEl.textContent = "Please select the city below:";
    displayEl.appendChild(titleEl);

    //loop over the data array to display
    for (let i=0; i< data.length; i++){
        
        //display content
        var cityContainer = document.createElement("div");
        cityContainer.classList = "card city-option-card my-2";
        cityContainer.dataset.lat = data[i].lat;
        cityContainer.dataset.lon = data[i].lon;
        cityContainer.dataset.name = data[i].name;
        cityContainer.dataset.country = data[i].country;
        var cityText = document.createElement("p");
        cityText.classList = "card-text px-2";
        cityContainer.appendChild(cityText);

        if(data[i].state){
            cityText.textContent = data[i].name + " - " + data[i].state + ", " + data[i].country;
        } else {
            cityText.textContent = data[i].name + " - " + data[i].country;
        }

        displayEl.appendChild(cityContainer);
    }
}

//click handler for cards
var clickHandler = function(event) {
    if($(event.target).parent().hasClass("city-option-card")){
        let lat = $(event.target).parent().attr("data-lat"),
            lon = $(event.target).parent().attr("data-lon"),
            name = $(event.target).parent().attr("data-name");

        getWeather(lat,lon,name);
        saveHistory(lat,lon,name);
    } else if($(event.target).hasClass("city-button")){
        let lat = $(event.target).attr("data-lat"),
            lon = $(event.target).attr("data-lon"),
            name = $(event.target).attr("data-name");

        getWeather(lat,lon,name);
    }
};

//weather api call function
var getWeather = function(lat,lon,name){
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=metric&appid=dummyid";

    fetch(apiUrl).then(function(response){
        response.json().then(function(data){
            console.log(data);
            displayWeather(data,name);
        });
    }).catch(function(error){
        displayEl.textContent = "Error in connecting to weather data";
    });
};

//display weather function
var displayWeather = function(data,name){
    displayEl.textContent = "";

    //get local date of location
    var UtcDate = DateTime.fromSeconds(data.current.dt,{zone:"utc"});
    var localDate = UtcDate.setZone(data.timezone);

    //create containers
    var currentWeatherContainer = document.createElement("div");
    currentWeatherContainer.classList = ("border border-secondary p-2 m-2")
    var forecastContainer = document.createElement("div");
    forecastContainer.classList = ("w-100 p2 m-2");
    displayEl.appendChild(currentWeatherContainer);
    displayEl.appendChild(forecastContainer);

    //populate current weather area

    //populate header
    var currentWeatherHeader = document.createElement("div");
    currentWeatherHeader.classList = "row pl-3 align-items-center"
    currentWeatherContainer.appendChild(currentWeatherHeader);
    var currentWeatherTitle = document.createElement("h2");
    currentWeatherTitle.textContent = name + " (" + localDate.toLocaleString(localDate.DATE_SHORT) + ")";
    currentWeatherHeader.appendChild(currentWeatherTitle);
    var currentWeatherIcon = document.createElement("img");
    currentWeatherIcon.setAttribute("src","http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png");
    currentWeatherIcon.setAttribute("alt",data.current.weather[0].description);
    currentWeatherIcon.setAttribute("width",50);
    currentWeatherIcon.setAttribute("height",50);
    currentWeatherHeader.appendChild(currentWeatherIcon);

    //populate details
    var currentWeatherDetails = document.createElement("p");
    currentWeatherContainer.appendChild(currentWeatherDetails);
    currentWeatherDetails.innerHTML = 
        "Temp:  " + data.current.temp + " ℃ <br/>" +
        "Wind:  " + data.current.wind_speed + " MPH <br/>" +
        "Humidity:  " + data.current.humidity + " % <br/>" +
        "UV Index:  " + "<span class='uv-index px-2 rounded'>" + data.current.uvi + "</span>";
    if (parseInt($(".uv-index").text()) >= 11) {
        $(".uv-index").css("backgroundColor", "purple");
    } else if (parseInt($(".uv-index").text()) >= 8) {
        $(".uv-index").css("backgroundColor", "red");
    } else if (parseInt($(".uv-index").text()) >= 6) {
        $(".uv-index").css("backgroundColor", "orange");
        (".uv-index").css("color", "black");
    } else if (parseInt($(".uv-index").text()) >= 3) {
        $(".uv-index").css("backgroundColor", "yellow");
        $(".uv-index").css("color", "black");
    } else {
        $(".uv-index").css("backgroundColor", "green");
    }

    //populate 5 day forecast area
    var forecastTitle = document.createElement("h2");
    forecastTitle.textContent = ("5-Day Forecast:");
    forecastContainer.appendChild(forecastTitle);
    var forecastCardsContainer = document.createElement("div");
    forecastCardsContainer.classList = "row m-2";
    forecastContainer.appendChild(forecastCardsContainer);

    //populate forecast cards via loop
    for(let i=1; i<6; i++){

        //get forecast date
        let forecastUtc = DateTime.fromSeconds(data.daily[i].dt,{zone:"utc"});
        let forecastDate = forecastUtc.setZone(data.timezone);

        //populate date
        var forecastCard = document.createElement("div");
        forecastCard.classList = "card col-12 col-md-2 mr-4 p-1 forecast-card";
        forecastCardsContainer.appendChild(forecastCard);
        var cardDate = document.createElement("h3");
        cardDate.className = "card-title";
        cardDate.textContent = forecastDate.toLocaleString(forecastDate.DATE_SHORT);
        forecastCard.appendChild(cardDate);

        //populate icon
        var forecastIcon = document.createElement("img");
        forecastIcon.setAttribute("src","http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png");
        forecastIcon.setAttribute("alt",data.daily[i].weather[0].description);
        forecastIcon.setAttribute("width",50);
        forecastIcon.setAttribute("height",50);
        forecastCard.appendChild(forecastIcon);

        //populate other information
        var forecastDetails = document.createElement("p");
        forecastCard.appendChild(forecastDetails);
        forecastDetails.innerHTML =
            "Temp Min:  " + data.daily[i].temp.min + " ℃ <br/>" + 
            "Temp Max:  " + data.daily[i].temp.max + " ℃ <br/>" +
            "Wind:  " + data.daily[i].wind_speed + " MPH <br/>" +
            "Humidity:  " + data.daily[i].humidity + " %";
    }

};

//save history function
var saveHistory = function(lat,lon,name){
    //cycle through array and check if duplicate
    for(let i=0; i<savedCities.length; i++){
        console.log(name);
        console.log(savedCities[i].name);
        if(name===savedCities[i].name){
            return;
        }
    }
    
    //check length of array, remove last one if length 10
    if(savedCities.length > 9){
        savedCities.pop();
    }

    //add the new city to the front of the array
    savedCities.unshift({
        name: name,
        lat: lat,
        lon: lon
    });

    //save array in local storage
    localStorage.setItem("cities",JSON.stringify(savedCities));

    //call function to display updated array
    displayHistory();
};

//display history function
var displayHistory = function(){
    historyList.textContent = "";
    //cycle through saved cities
    for(let i=0; i < savedCities.length; i++){

        //create list item
        let historyLi = document.createElement("button");
        historyLi.classList = "list-group-item list-group-item-action list-group-item-secondary my-2 city-button text-center"
        historyLi.setAttribute("type","button");
        historyLi.textContent = savedCities[i].name;
        historyLi.dataset.lat = savedCities[i].lat;
        historyLi.dataset.lon = savedCities[i].lon;
        historyLi.dataset.name = savedCities[i].name;
        historyList.appendChild(historyLi);
    }
};

//load history function
var loadHistory = function(){
    var loadedCities = localStorage.getItem("cities");

    if(!loadedCities){
        return false;
    }

    savedCities = JSON.parse(loadedCities);

    displayHistory();
};

// event listeners
searchForm.addEventListener("submit", searchHandler);
displayEl.addEventListener("click",clickHandler);
historyList.addEventListener("click",clickHandler);

//initial load
loadHistory();