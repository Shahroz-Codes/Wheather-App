//Javascript

const cityinput = document.querySelector('.cityname');
const SearchBtn = document.querySelector('.SearchButton');
const LocationBtn = document.querySelector('.UseLocationbtn');
const weathercardsDiv = document.querySelector('.weathercards');
const CurrentweatherDiv = document.querySelector('.CurrentWeather');
const API_KEY = '6cd53af18b0f3805e2675a96d7631e9b'

// functions ${weatheritem}
const createWeatherCard = (cityname, weatheritem, index) => {
    if (index === 0) {//html for current weather
        return ` <div class="data">
                    <h2>${cityname} (${weatheritem.dt_txt.split(" ")[0]})</h2>
                    <h4 class="temperature1">Temp : ${(weatheritem.main.temp - 273.15).toFixed(2)} &degC</h4>
                    <h4 class="wind1">Wind :  ${weatheritem.wind.speed} M/S</h4>
                    <h4 class="humidity1">Humidity : ${weatheritem.main.humidity}%</h4>
                </div>
                <div class="currentdataimg">
                    <img src="assets/images/${weatheritem.weather[0].main}.png" alt="p">
                    <h4>${weatheritem.weather[0].description}</h4>
                </div>`
    } else {//html for 5-day forecasts

        return `<li class="card">
                    <h3>${weatheritem.dt_txt.split(" ")[0]}</h3>
                    <img src="assets/images/${weatheritem.weather[0].main}.png" alt="p">
                    <h4 class="temperature1">Temp : ${(weatheritem.main.temp - 273.15).toFixed(2)} &degC</h4>
                    <h4 class="wind1">Wind :  ${weatheritem.wind.speed} M/S</h4>
                    <h4 class="humidity1">Humidity : ${weatheritem.main.humidity}%</h4>
                </li>`
    }
}
const Get_Weather_Details = (cityname, lat, lon) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    fetch(WEATHER_API_URL)
        .then(Response => {
            return Response.json();
        })
        .then(data => {
            //filtering five unique days forecast
            const uniqueforecastDays = [];
            const fiveDaysForecast = data.list.filter(forecast => {
                const forecastDate = new Date(forecast.dt_txt).getDate();
                if (!uniqueforecastDays.includes(forecastDate)) {
                    return uniqueforecastDays.push(forecastDate);
                }
            })
            //clearing previous data
            cityinput.value = " ";
            CurrentweatherDiv.innerHTML = " ";
            weathercardsDiv.innerHTML = " ";

            fiveDaysForecast.forEach((weatheritem, index) => {
                console.log(weatheritem);
                if (index === 0) {
                    CurrentweatherDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityname, weatheritem, index));

                } else {

                    weathercardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityname, weatheritem, index));
                }
            });
        })
        .catch(() => {
            alert('An error has occurred while fetching the weather forecast!')
        })
}

const Get_City_Coordinates = () => {
    const cityname = cityinput.value.trim();
    if (!cityname) {
        return;
    }
    const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityname}&limit=1&appid=${API_KEY}`
    fetch(GEOCODING_API_URL)
        .then(Response => {
            return Response.json();
        })
        .then(data => {
            if (!data.length) {
                alert(`NO coordinats were found for ${cityname}`)
            }
            const { name, lat, lon } = data[0];
            Get_Weather_Details(name, lat, lon);
        })
        .catch(function () {
            alert('An error has occurred while fetching the coordinates!')
        })

}
const Get_User_Coordinates = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords;
            const REVERSE_GEOCODING_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;

            fetch(REVERSE_GEOCODING_URL)
                .then(Response => {
                    return Response.json();
                })
                .then(data => {
                    if (!data.length) {
                        alert(`NO coordinats were found for ${cityname}`)
                    }
                    const { name } = data[0];
                    Get_Weather_Details(name, latitude, longitude);
                })
                .catch(function () {
                    alert('An error has occurred while fetching the coordinates!')
                })
        },
        error => {
            if (error.code === error.PERMISSION_DENIED) {
                alert("Geolocation Reques Denied. Please reset location permission to grant access again.")
            }
        }
    );

}

//event listners
SearchBtn.addEventListener('click', Get_City_Coordinates);
LocationBtn.addEventListener('click', Get_User_Coordinates);
cityinput.addEventListener("keyup", e => e.key === "Enter" && Get_City_Coordinates());