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
    var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=5&appid=04615da553e9e75a8da702267ce00f8b";

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

    //loop over 

    //loop over the data array to display
    for (let i=0; i< data.length; i++){
        
        //display content
        var cityContainer = document.createElement("div");
        cityContainer.classList = "card city-option-card";
        cityContainer.dataset.lat = data[i].lat;
        cityContainer.dataset.lon = data[i].lon;
        cityContainer.dataset.name = data[i].name;
        cityContainer.dataset.country = data[i].country;
        var cityText = document.createElement("p");
        cityText.className = "card-text";
        cityContainer.appendChild(cityText);

        if(data[i].state){
            cityText.textContent = data[i].name + " - " + data[i].state + ", " + data[i].country;
        } else {
            cityText.textContent = data[i].name + " - " + data[i].country;
        }

        displayEl.appendChild(cityContainer);
    }
}

// event listeners
searchForm.addEventListener("submit", searchHandler);