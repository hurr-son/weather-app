import config from './config.js';

const MY_API_KEY = config.apiKey;

function createWeatherURL(location) {
    const baseURL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/';
    return `${baseURL}${location}?key=${MY_API_KEY}`;
}

function processWeatherData(data) {
    return {
        location: data.resolvedAddress,
        description: data.description,
        currentTemp: data.days[0].temp,
        conditions: data.days[0].conditions,
        highTemp: data.days[0].tempmax,
        lowTemp: data.days[0].tempmin,
        precipitationProbability: data.days[0].precipprob,
    };
}

function displayWeather(weather) {
    const weatherInfo = document.getElementById('weatherInfo');
    weatherInfo.innerHTML = `
        <h2>Weather in ${weather.location}</h2>
        <p><strong>Description:</strong> ${weather.description}</p>
        <p><strong>Current Temperature:</strong> ${weather.currentTemp}°F</p>
        <p><strong>Conditions:</strong> ${weather.conditions}</p>
        <p><strong>High:</strong> ${weather.highTemp}°F, <strong>Low:</strong> ${weather.lowTemp}°F</p>
        <p><strong>Precipitation Probability:</strong> ${weather.precipitationProbability}%</p>
    `;
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