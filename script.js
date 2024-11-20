const MY_API_KEY = 'HX59HUJYEUNCGSB8MNPQMSKSN';
const https = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/53211?key=${MY_API_KEY}`

console.log(https)


function createWeatherURL(location) {
    const baseURL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/';
    return `${baseURL}${location}?key=${MY_API_KEY}`;
}

async function fetchWeather(location) {
    const url = createWeatherURL(location);
    try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`Error fetching weather data: ${response.status}`);
        }
        const weatherData = await response.json();
        console.log(`Weather data for ${location}:`, weatherData);
    } catch (error) {
        console.error('Failed to fetch weather data:', error)
    }
}

const myLocation = 'Milwaukee,WI'