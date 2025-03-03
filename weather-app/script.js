const apiKey = '003d89210840581a4a63e4a206d95791';
const weatherInfo = document.getElementById('weather-info');
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const loadingSpinner = document.querySelector('.loading');

// Function to show/hide loading spinner
function toggleLoading(show) {
    loadingSpinner.style.display = show ? 'block' : 'none';
    weatherInfo.style.opacity = show ? '0.5' : '1';
}


function capitalizeWords(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}

// Function to fetch weather data
async function fetchWeather(city) {
    toggleLoading(true);
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
    
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (response.ok) {
            displayWeather(data);
        } else {
            throw new Error(data.message || 'City not found');
        }
    } catch (error) {
        console.error('Error:', error);
        alert(`Error: ${error.message}`);
    } finally {
        toggleLoading(false);
    }
}

// Function to display weather data
function displayWeather(data) {
    const location = data.name;
    const temperature = Math.round(data.main.temp);
    const conditions = data.weather[0].description;
    const icon = data.weather[0].icon;
    const humidity = data.main.humidity;
    const windSpeed = Math.round(data.wind.speed * 3.6); // Convert m/s to km/h

    document.getElementById('location').textContent = location;
    document.getElementById('temperature').textContent = `${temperature}°C`;
    document.getElementById('conditions').textContent = capitalizeWords(conditions);
    document.getElementById('humidity').textContent = `Humidity: ${humidity}%`;
    document.getElementById('wind-speed').textContent = `Wind Speed: ${windSpeed} km/h`;
    document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
}

// Function to handle search
function handleSearch() {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeather(city);
        cityInput.value = ''; // Clear input after search
    } else {
        alert('Please enter a city name.');
    }
}

// Event listeners
searchBtn.addEventListener('click', handleSearch);

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

// Function to fetch weather by coordinates
async function fetchWeatherByCoords(lat, lon) {
    toggleLoading(true);
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (response.ok) {
            displayWeather(data);
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert(`Error: ${error.message}`);
    } finally {
        toggleLoading(false);
    }
}

// Get user's location on page load
window.addEventListener('load', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                fetchWeatherByCoords(lat, lon);
            },
            (error) => {
                console.error('Geolocation error:', error);
                // Don't show alert, just let user search manually
            }
        );
    }
});