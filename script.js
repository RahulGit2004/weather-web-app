const inputBox = document.querySelector(".input-box");
const searchBtn = document.getElementById("search");
const weather_img = document.querySelector(".weather-img");
const temperature = document.querySelector(".temperature");
const description = document.querySelector(".description");
const humidity = document.getElementById("humidity");
const wind_speed = document.getElementById("wind_speed");

const not_found = document.querySelector(".page-not-found");
const data_container = document.getElementById("data-container");

// Default value
let isCelsius = true; // Track current unit

const weatherImages = {
    "Clouds": "./assets/sun_cloud.png",
    "Clear": "./assets/sun.jpg",
    "Rain": "./assets/light_rainy.webp",
    "Mist": "./assets/mist.png",
    "Snow": "./assets/snow2.avif",
    "Haze": "./assets/haze.png"
};

// Function to get weather
async function findWeather(city) {
    const api_key = "2ed8d89977e8abd3121a17e9cce7afe1";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const weatherData = await response.json();

        if (weatherData.cod == "404") {
            not_found.style.display = "flex";
            data_container.style.display = "none";
            return;
        }

        data_container.style.display = "flex";
        not_found.style.display = "none";

        let tempK = weatherData.main.temp;

        // Update Temperature with Toggle
        temperature.innerHTML = `
            <span id="temp-value">${Math.round(tempK - 273.15)}</span> 
            <sub id="temp-unit">°C</sub> | 
            <span id="toggle-unit" style="cursor: pointer; text-decoration: underline;">F</span>`;

        // Humidity
        humidity.innerHTML = `${weatherData.main.humidity}%`;

        // Wind speed
        wind_speed.innerHTML = `${weatherData.wind.speed} km/h`;

        // Image icon change
        const weatherCondition = weatherData.weather[0].main;
        weather_img.src = weatherImages[weatherCondition] || "./assets/default.avif";

        // Attach event listener AFTER updating the temperature element
        document.getElementById("toggle-unit").addEventListener("click", function () {
            const tempValue = document.getElementById("temp-value");
            const tempUnit = document.getElementById("temp-unit");
        
            let currentTemp = parseFloat(tempValue.innerText);
        
            if (isCelsius) {
                // Convert °C to °F and round
                tempValue.innerText = Math.round((currentTemp * 9/5) + 32);
                tempUnit.innerText = "°F";
                this.innerText = "C"; // Change clickable unit to C
            } else {
                // Convert °F to °C and round
                tempValue.innerText = Math.round((currentTemp - 32) * 5/9);
                tempUnit.innerText = "°C";
                this.innerText = "F"; // Change clickable unit to F
            }
        
            isCelsius = !isCelsius; // Toggle the unit
        });
        

    } catch (error) {
        console.error("Error fetching weather data:", error);
        not_found.style.display = "flex";
        data_container.style.display = "none";
    }
}

// Activate when user clicks search button
searchBtn.addEventListener("click", () => {
    findWeather(inputBox.value);
});

// Activate when user presses enter
inputBox.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        searchBtn.click();
    }
});
