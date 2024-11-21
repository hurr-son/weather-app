import config from './config.js';

const MY_API_KEY = config.apiKey;

function createWeatherURL(location) {
    const baseURL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/';
    return `${baseURL}${location}?key=${MY_API_KEY}`;
}


function processWeatherData(data) {
    return {
        location: data.resolvedAddress,
        forecast: data.days.slice(0, 10).map((day) => ({
            date: day.datetime,
            description: day.conditions,
            icon: day.icon,
            highTemp: day.tempmax,
            lowTemp: day.tempmin,
            precipitationProbability: day.precipprob,
        })),
    };
}

function displayWeather(weather) {
    const weatherInfo = document.getElementById('weatherInfo');
    weatherInfo.innerHTML = `
        <h2>10-Day Weather Forecast for ${weather.location}</h2>
    `;

  
    const cardsContainer = document.createElement('div');
    cardsContainer.classList.add('cards');

    weather.forecast.forEach((day) => {
        const card = document.createElement('div');
        card.classList.add('card');
        const iconPath
        card.innerHTML = `
            <h3>${day.date}</h3>

            <p><strong>${day.description}</strong></p>
            <p>High: ${day.highTemp}°F</p>
            <p>Low: ${day.lowTemp}°F</p>
            <p>Precipitation: ${day.precipitationProbability || 0}%</p>
        `;

        cardsContainer.appendChild(card);
    });

    weatherInfo.appendChild(cardsContainer);
}

async function fetchWeather(location) {
    const url = createWeatherURL(location);
    const loading = document.getElementById('loading');
    const errorDiv = document.getElementById('error');

    try {
        errorDiv.textContent = '';
        loading.style.display = 'block';
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching weather data: ${response.status}`);
        }
        const weatherData = await response.json();
        const weather = processWeatherData(weatherData);
        displayWeather(weather);
        console.log(weather)
    } catch (error) {
        errorDiv.textContent = `Failed to fetch weather data: ${error.message}`;
        console.error(error);
    } finally {
        loading.style.display = 'none';
    }
}

document.getElementById('locationForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const locationInput = document.getElementById('locationInput').value.trim();
    if (locationInput) {
        fetchWeather(locationInput);
    } else {
        alert('Please enter a valid location.');
    }
});