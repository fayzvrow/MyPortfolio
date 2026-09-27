const cityInput = document.getElementById("city-input");
const searchButton = document.getElementById("search-button");
const cityDropdown = document.getElementById("city-dropdown");

const cityNameElement = document.getElementById("city-name");
const temperatureElement = document.getElementById("temperature");
const feelsLikeElement = document.getElementById("feels-like");
const humidityElement = document.getElementById("humidity");
const windSpeedElement = document.getElementById("wind-speed");
const highLowElement = document.getElementById("high-low");
const weatherInfoElement = document.getElementById("weather-info");

const weatherApp = document.querySelector(".weather-app");

const currentTimeElement = document.getElementById("current-time");
const currentDateElement = document.getElementById("current-date");

let currentTimezone = null;
let clockInterval = null;

const defaultLocation = {
    name: "Atlanta",
    admin1: "Georgia",
    latitude: 33.7490,
    longitude: -84.3880,
    timezone: "America/New_York"
};

searchButton.addEventListener("click", getWeather);
cityInput.addEventListener("input", showCitySuggestions);

cityInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        getWeather();
    }
});

document.addEventListener("click", (event) => {
    if (!event.target.closest(".search-wrap")) {
        cityDropdown.innerHTML = "";
    }
});

async function showCitySuggestions() {
    const searchText = cityInput.value.trim();

    if (searchText === "") {
        cityDropdown.innerHTML = "";
        return;
    }

    const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${searchText}&count=10&language=en&format=json`
    );

    const data = await response.json();
    cityDropdown.innerHTML = "";

    const cities = data.results?.filter(city =>
        city.feature_code === "PPL" ||
        city.feature_code === "PPLA" ||
        city.feature_code === "PPLA2" ||
        city.feature_code === "PPLA3" ||
        city.feature_code === "PPLC"
    );

    cities?.slice(0, 5).forEach(city => {
        const cityOption = document.createElement("div");
        cityOption.textContent = `${city.name}, ${city.admin1 || ""}`;
        cityOption.addEventListener("click", () => {
            cityInput.value = `${city.name}, ${city.admin1 || ""}`;
            cityDropdown.innerHTML = "";
            getWeather(city);
        });
        cityDropdown.appendChild(cityOption);
    });
}

function resetWeather() {
    cityNameElement.textContent = "";
    temperatureElement.textContent = "--";
    feelsLikeElement.textContent = "--°F";
    humidityElement.textContent = "--%";
    windSpeedElement.textContent = "-- mph";
    highLowElement.textContent = "--° / --°";
    weatherInfoElement.textContent = "";
}

function updateClock() {
    if (!currentTimezone) {
        return;
    }

    const now = new Date();

    const timeFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone: currentTimezone,
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
    });

    const dateFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone: currentTimezone,
        weekday: "long",
        month: "short",
        day: "numeric"
    });

    currentTimeElement.textContent = timeFormatter.format(now);
    currentDateElement.textContent = dateFormatter.format(now);
}

function startClock() {
    clearInterval(clockInterval);
    updateClock();

    currentTimeElement.classList.remove("fade-in");
    currentDateElement.classList.remove("fade-in");

    void currentTimeElement.offsetWidth;

    currentTimeElement.classList.add("fade-in");
    currentDateElement.classList.add("fade-in");

    clockInterval = setInterval(updateClock, 1000);
}

function playFadeIn() {
    const weatherCards = document.querySelectorAll(".weather-card");

    const elements = [
        cityNameElement,
        temperatureElement.parentElement,
        weatherInfoElement,
        ...weatherCards,
        currentTimeElement,
        currentDateElement
    ];

    elements.forEach(element => {
        element.classList.remove("fade-in");
        void element.offsetWidth;
        element.classList.add("fade-in");
    });
}

async function displayWeather(location) {

    const latitude = location.latitude;
    const longitude = location.longitude;

    currentTimezone = location.timezone;
    startClock();

    const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto`
    );

    const weatherData = await weatherResponse.json();

    const temperature = weatherData.current.temperature_2m;
    const feelsLike = weatherData.current.apparent_temperature;
    const humidity = weatherData.current.relative_humidity_2m;
    const windSpeed = weatherData.current.wind_speed_10m;
    const weatherCode = weatherData.current.weather_code;
    let weatherInfo;

    if (weatherCode === 0) {
        weatherInfo = "Clear sky";
    } else if (weatherCode === 1) {
        weatherInfo = "Mainly clear";
    } else if (weatherCode === 2) {
        weatherInfo = "Partly cloudy";
    } else if (weatherCode === 3) {
        weatherInfo = "Overcast";
    } else if (weatherCode >= 45 && weatherCode <= 48) {
        weatherInfo = "Fog";
    } else if (weatherCode >= 51 && weatherCode <= 57) {
        weatherInfo = "Drizzle";
    } else if (weatherCode >= 61 && weatherCode <= 67) {
        weatherInfo = "Rain";
    } else if (weatherCode >= 71 && weatherCode <= 77) {
        weatherInfo = "Snow";
    } else if (weatherCode >= 80 && weatherCode <= 82) {
        weatherInfo = "Rain showers";
    } else if (weatherCode >= 85 && weatherCode <= 86) {
        weatherInfo = "Snow showers";
    } else if (weatherCode >= 95 && weatherCode <= 99) {
        weatherInfo = "Thunderstorm";
    } else {
        weatherInfo = "Unknown";
    }

    const high = weatherData.daily.temperature_2m_max[0];
    const low = weatherData.daily.temperature_2m_min[0];

    cityNameElement.textContent = `${location.name}, ${location.admin1 || ""}`;
    temperatureElement.textContent = temperature;
    feelsLikeElement.textContent = `${feelsLike}°F`;
    humidityElement.textContent = `${humidity}%`;
    windSpeedElement.textContent = `${windSpeed} mph`;
    highLowElement.textContent = `${high}° / ${low}°`;
    weatherInfoElement.textContent = weatherInfo;

    playFadeIn();
}

async function getWeather(selectedCity = null) {
    const city = cityInput.value.trim();

    cityDropdown.innerHTML = "";
    
    if (selectedCity) {
        await displayWeather(selectedCity);
        return;
    }

    if (city === "") {
        resetWeather();
        cityInput.classList.remove("invalid");
        return;
    }

    searchButton.textContent = "Loading...";
    searchButton.disabled = true;

    console.log("Searching for:", city);

    try {
        const locationResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=10&language=en&format=json`
        );

        const locationData = await locationResponse.json();
        const result = locationData.results?.find(city =>
            city.feature_code === "PPL" ||
            city.feature_code === "PPLA" ||
            city.feature_code === "PPLA2" ||
            city.feature_code === "PPLC"
        );

        if (!result) {
            cityInput.classList.remove("invalid");
            void cityInput.offsetWidth;
            cityInput.classList.add("invalid");

            return;
        }

        cityInput.classList.remove("invalid");
        
        console.log("Location Data", locationData);

        await displayWeather(result);
    }
    catch (error) {
        console.error("Error:", error);
    }
    finally {
        searchButton.textContent = "Search";
        searchButton.disabled = false;
    }
}

displayWeather(defaultLocation);