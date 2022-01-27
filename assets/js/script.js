var displayEl = document.getElementById("display-area"),
    searchInput = document.getElementById("city-search"),
    searchForm = document.getElementById("search-form");

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
    var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=5&appid=7110ef94f529d64b1f6c23466f380a00";

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
    }
};

//weather api call function
var getWeather = function(lat,lon,name){
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=7110ef94f529d64b1f6c23466f380a00";

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

};

//save history function
var saveHistory = function(lat,lon,name){

};

//display history function
var displayHistory = function(lat,lon,name){

};

//load history function
var loadHistory = function(){

};

// event listeners
searchForm.addEventListener("submit", searchHandler);
displayEl.addEventListener("click",clickHandler);

//initial load
loadHistory();