import config from './config.js';

const MY_API_KEY = config.apiKey;

function createWeatherURL(location) {
    const baseURL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/';
    return `${baseURL}${location}?key=${MY_API_KEY}`;
}

function processWeatherData(data) {
    return {
        location: data.resolvedAddress,
        forecast: data.days.slice(0, 7).map((day) => ({
            date: day.datetime,
            description: day.conditions,
            highTemp: day.tempmax,
            lowTemp: day.tempmin,
            precipitationProbability: day.precipprob,
            icon: day.icon
        })),
    };
}

async function displayWeather(weather) {
    const weatherInfo = document.getElementById('weatherInfo');
    weatherInfo.innerHTML = `
        <h2>10-Day Weather Forecast for ${weather.location}</h2>
    `;

    const cardsContainer = document.createElement('div');
    cardsContainer.classList.add('cards');

    for (const day of weather.forecast) {
        const card = document.createElement('div');
        card.classList.add('card');

        const iconDiv = document.createElement('div');
        iconDiv.classList.add('icon-container');

        try {
            const iconUrl = `https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/SVG/2nd%20Set%20-%20Color/${day.icon}.svg`;
            
            const response = await fetch(iconUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch SVG: ${response.status}`);
            }
            const svgData = await response.text();
            iconDiv.innerHTML = svgData; 
        } catch (error) {
            console.error(`Error fetching SVG for ${day.icon}:`, error);
            iconDiv.innerHTML = `<p>Icon unavailable</p>`; 
        }

        card.innerHTML = `
            <h3>${day.date}</h3>
            <p><strong>${day.description}</strong></p>
            <p>High: ${day.highTemp}°F</p>
            <p>Low: ${day.lowTemp}°F</p>
            <p>Precipitation: ${day.precipitationProbability || 0}%</p>
        `;

        card.prepend(iconDiv);

        cardsContainer.appendChild(card);
    }

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

// Placeholder forecast
fetchWeather("Milwaukee")