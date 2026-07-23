// =============================
// WEATHER DASHBOARD - script.js
// Part 1
// =============================

// DOM Elements
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const themeBtn = document.getElementById("themeBtn");
const unitToggle = document.getElementById("unitToggle");

const loader = document.getElementById("loader");
const errorMessage = document.getElementById("errorMessage");

const cityName = document.getElementById("cityName");
const temp = document.getElementById("temp");
const description = document.getElementById("description");
const weatherIcon = document.getElementById("weatherIcon");

const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const pressure = document.getElementById("pressure");
const visibility = document.getElementById("visibility");

const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");
const dateTime = document.getElementById("dateTime");

const forecastCards = document.getElementById("forecastCards");
const recentList = document.getElementById("recentList");

// Global Variables
let currentWeather = null;
let isCelsius = true;

// Event Listeners
searchBtn.addEventListener("click", searchWeather);

cityInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        searchWeather();
    }
});

locationBtn.addEventListener("click", getCurrentLocation);

themeBtn.addEventListener("click", toggleTheme);

unitToggle.addEventListener("click", toggleTemperature);

// =============================
// Search Weather
// =============================

function searchWeather() {

    const city = cityInput.value.trim();

    if (city === "") {
        showError("Please enter a city name.");
        return;
    }

    getWeather(city);

}

// =============================
// Current Weather API
// =============================

async function getWeather(city) {

    showLoader();

    try {

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
        );

        if (!response.ok) {
            throw new Error("City not found.");
        }

        const data = await response.json();

        currentWeather = data;

        displayWeather(data);

        saveRecentSearch(data.name);

        getForecast(data.name);

    }

    catch (error) {

        showError(error.message);

    }

    finally {

        hideLoader();

    }

}

// =============================
// Display Weather
// =============================

function displayWeather(data) {

    cityName.textContent =
        `${data.name}, ${data.sys.country}`;

    temp.textContent =
        `${Math.round(data.main.temp)}°C`;

    description.textContent =
        capitalize(data.weather[0].description);

    feelsLike.textContent =
        `${Math.round(data.main.feels_like)}°C`;

    humidity.textContent =
        `${data.main.humidity}%`;

    wind.textContent =
        `${data.wind.speed} m/s`;

    pressure.textContent =
        `${data.main.pressure} hPa`;

    visibility.textContent =
        `${(data.visibility / 1000).toFixed(1)} km`;

    sunrise.textContent =
        new Date(data.sys.sunrise * 1000).toLocaleTimeString();

    sunset.textContent =
        new Date(data.sys.sunset * 1000).toLocaleTimeString();

    dateTime.textContent =
        new Date().toLocaleString();

    weatherIcon.src =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    weatherIcon.alt =
        data.weather[0].description;

    updateBackground(data.weather[0].main);

}

// =============================
// Loader
// =============================

function showLoader() {

    loader.classList.remove("hidden");

    errorMessage.classList.add("hidden");

}

function hideLoader() {

    loader.classList.add("hidden");

}

// =============================
// Error Message
// =============================

function showError(message) {

    errorMessage.textContent = message;

    errorMessage.classList.remove("hidden");

}

// =============================
// Helper
// =============================

function capitalize(text) {

    return text.charAt(0).toUpperCase() +
           text.slice(1);

}

// =============================
// CURRENT LOCATION
// =============================

function getCurrentLocation() {

    if (!navigator.geolocation) {
        showError("Geolocation is not supported by your browser.");
        return;
    }

    showLoader();

    navigator.geolocation.getCurrentPosition(

        async (position) => {

            try {

                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
                );

                if (!response.ok) {
                    throw new Error("Unable to fetch current location.");
                }

                const data = await response.json();

                currentWeather = data;

                displayWeather(data);

                saveRecentSearch(data.name);

                getForecast(data.name);

            }

            catch (error) {

                showError(error.message);

            }

            finally {

                hideLoader();

            }

        },

        () => {

            hideLoader();

            showError("Location permission denied.");

        }

    );

}

// =============================
// 5 DAY FORECAST
// =============================

async function getForecast(city) {

    try {

        const response = await fetch(

            `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`

        );

        const data = await response.json();

        forecastCards.innerHTML = "";

        const dailyForecast = data.list.filter(item =>
            item.dt_txt.includes("12:00:00")
        );

        dailyForecast.forEach(day => {

            const card = document.createElement("div");

            card.className = "forecast-card";

            card.innerHTML = `

                <h3>${new Date(day.dt_txt).toLocaleDateString(
                    "en-US",
                    { weekday: "short" }
                )}</h3>

                <img
                    src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png"
                    alt=""
                >

                <p>${Math.round(day.main.temp)}°C</p>

                <p>${day.weather[0].main}</p>

            `;

            forecastCards.appendChild(card);

        });

    }

    catch (error) {

        console.log(error);

    }

}

// =============================
// RECENT SEARCHES
// =============================

function saveRecentSearch(city) {

    let cities = JSON.parse(

        localStorage.getItem("weatherCities")

    ) || [];

    cities = cities.filter(item => item !== city);

    cities.unshift(city);

    if (cities.length > 5) {

        cities.pop();

    }

    localStorage.setItem(

        "weatherCities",

        JSON.stringify(cities)

    );

    loadRecentSearches();

}

function loadRecentSearches() {

    recentList.innerHTML = "";

    const cities = JSON.parse(

        localStorage.getItem("weatherCities")

    ) || [];

    cities.forEach(city => {

        const li = document.createElement("li");

        li.textContent = city;

        li.addEventListener("click", () => {

            cityInput.value = city;

            getWeather(city);

        });

        recentList.appendChild(li);

    });

}

// =============================
// TEMPERATURE TOGGLE
// =============================

function toggleTemperature() {

    if (!currentWeather) return;

    let value;

    if (isCelsius) {

        value = (currentWeather.main.temp * 9 / 5) + 32;

        temp.textContent = `${Math.round(value)}°F`;

        feelsLike.textContent =
            `${Math.round((currentWeather.main.feels_like * 9 / 5) + 32)}°F`;

    }

    else {

        temp.textContent =
            `${Math.round(currentWeather.main.temp)}°C`;

        feelsLike.textContent =
            `${Math.round(currentWeather.main.feels_like)}°C`;

    }

    isCelsius = !isCelsius;

}

// =============================
// DARK MODE
// =============================

function toggleTheme() {

    document.body.classList.toggle("dark");

}

// =============================
// DYNAMIC BACKGROUND
// =============================

function updateBackground(weather) {

    weather = weather.toLowerCase();

    if (weather.includes("clear")) {

        document.body.style.background =
            "linear-gradient(135deg,#4facfe,#00f2fe)";

    }

    else if (weather.includes("cloud")) {

        document.body.style.background =
            "linear-gradient(135deg,#bdc3c7,#2c3e50)";

    }

    else if (weather.includes("rain")) {

        document.body.style.background =
            "linear-gradient(135deg,#4b79a1,#283e51)";

    }

    else if (weather.includes("snow")) {

        document.body.style.background =
            "linear-gradient(135deg,#E6DADA,#274046)";

    }

    else if (weather.includes("thunder")) {

        document.body.style.background =
            "linear-gradient(135deg,#232526,#414345)";

    }

    else {

        document.body.style.background =
            "linear-gradient(135deg,#4facfe,#00f2fe)";

    }

}

// =============================
// INITIALIZATION
// =============================

function initializeApp() {

    loadRecentSearches();

    const lastCities = JSON.parse(
        localStorage.getItem("weatherCities")
    ) || [];

    if (lastCities.length > 0) {

        cityInput.value = lastCities[0];

        getWeather(lastCities[0]);

    } else {

        cityInput.value = "Chennai";

        getWeather("Chennai");

    }

}

// =============================
// REFRESH WEATHER
// =============================

function refreshWeather() {

    if (currentWeather) {

        getWeather(currentWeather.name);

    }

}

// =============================
// KEYBOARD SHORTCUTS
// =============================

document.addEventListener("keydown", function(e) {

    if (e.ctrlKey && e.key.toLowerCase() === "r") {

        e.preventDefault();

        refreshWeather();

    }

});

// =============================
// AUTO UPDATE DATE & TIME
// =============================

setInterval(() => {

    dateTime.textContent = new Date().toLocaleString();

}, 1000);

// =============================
// CONNECTION STATUS
// =============================

window.addEventListener("offline", () => {

    showError("No Internet Connection");

});

window.addEventListener("online", () => {

    if (currentWeather) {

        refreshWeather();

    }

});

// =============================
// CLEAR SEARCH
// =============================

cityInput.addEventListener("input", () => {

    if (cityInput.value.trim() === "") {

        errorMessage.classList.add("hidden");

    }

});

// =============================
// WEATHER TIPS
// =============================

function showWeatherTip(weather) {

    weather = weather.toLowerCase();

    let tip = "";

    if (weather.includes("rain")) {

        tip = "🌧 Carry an umbrella.";

    }

    else if (weather.includes("clear")) {

        tip = "☀ Wear sunglasses and stay hydrated.";

    }

    else if (weather.includes("cloud")) {

        tip = "☁ Pleasant weather today.";

    }

    else if (weather.includes("snow")) {

        tip = "❄ Wear warm clothes.";

    }

    else if (weather.includes("thunder")) {

        tip = "⚡ Stay indoors during thunderstorms.";

    }

    else {

        tip = "🌍 Have a great day!";

    }

    console.log(tip);

}

// =============================
// UPDATE DISPLAY
// =============================

const oldDisplayWeather = displayWeather;

displayWeather = function(data){

    oldDisplayWeather(data);

    showWeatherTip(data.weather[0].main);

};

// =============================
// APP START
// =============================

initializeApp();