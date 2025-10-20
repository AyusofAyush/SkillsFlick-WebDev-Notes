import React, { useState, useEffect } from 'react';
import '../styles/WeatherDashboard.css';

function WeatherDashboard() {
  const [city, setCity] = useState('London');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Using OpenMeteo API (no API key required)
        // First, get coordinates for the city
        const geoResponse = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`
        );
        
        if (!geoResponse.ok) {
          throw new Error('Failed to fetch city coordinates');
        }
        
        const geoData = await geoResponse.json();
        
        if (!geoData.results || geoData.results.length === 0) {
          throw new Error('City not found');
        }
        
        const { latitude, longitude, name, country } = geoData.results[0];
        
        // Then, get weather data
        const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`
        );
        
        if (!weatherResponse.ok) {
          throw new Error('Failed to fetch weather data');
        }
        
        const weatherData = await weatherResponse.json();
        
        setWeather({
          city: name,
          country: country,
          temperature: weatherData.current_weather.temperature,
          windSpeed: weatherData.current_weather.windspeed,
          weatherCode: weatherData.current_weather.weathercode,
          time: new Date(weatherData.current_weather.time)
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

  const getWeatherIcon = (code) => {
    if (code === 0) return '☀️';
    if (code >= 1 && code <= 3) return '⛅';
    if (code >= 45 && code <= 48) return '🌫️';
    if (code >= 51 && code <= 67) return '🌧️';
    if (code >= 71 && code <= 77) return '❄️';
    if (code >= 80 && code <= 82) return '🌦️';
    if (code >= 85 && code <= 86) return '🌨️';
    if (code >= 95 && code <= 99) return '⛈️';
    return '🌡️';
  };

  const cities = ['London', 'New York', 'Tokyo', 'Paris', 'Sydney', 'Mumbai', 'Dubai', 'Berlin'];

  return (
    <div className="weather-dashboard">
      <h2>🌤️ Weather Dashboard</h2>
      <p className="description">
        Fetch weather data using async/await with useEffect
      </p>

      <div className="city-selector">
        {cities.map((cityName) => (
          <button
            key={cityName}
            onClick={() => setCity(cityName)}
            className={city === cityName ? 'active' : ''}
          >
            {cityName}
          </button>
        ))}
      </div>

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Fetching weather data...</p>
        </div>
      )}

      {error && (
        <div className="error">
          <p>❌ Error: {error}</p>
        </div>
      )}

      {weather && !loading && (
        <div className="weather-card">
          <div className="weather-header">
            <h3>{weather.city}, {weather.country}</h3>
            <p className="weather-time">
              {weather.time.toLocaleDateString()} {weather.time.toLocaleTimeString()}
            </p>
          </div>

          <div className="weather-main">
            <div className="weather-icon">
              {getWeatherIcon(weather.weatherCode)}
            </div>
            <div className="weather-temp">
              <span className="temp-value">{Math.round(weather.temperature)}</span>
              <span className="temp-unit">°C</span>
            </div>
          </div>

          <div className="weather-details">
            <div className="weather-detail">
              <span className="detail-icon">💨</span>
              <div>
                <strong>Wind Speed</strong>
                <p>{weather.windSpeed} km/h</p>
              </div>
            </div>
            <div className="weather-detail">
              <span className="detail-icon">🌡️</span>
              <div>
                <strong>Temperature</strong>
                <p>{weather.temperature}°C / {Math.round(weather.temperature * 9/5 + 32)}°F</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="explanation">
        <h3>💡 Key Concepts</h3>
        <ul>
          <li><strong>Async/Await:</strong> Clean syntax for handling promises</li>
          <li><strong>Try/Catch:</strong> Error handling for async operations</li>
          <li><strong>Sequential API Calls:</strong> First fetch coordinates, then weather</li>
          <li><strong>State Management:</strong> Separate states for data, loading, error</li>
          <li><strong>Dependency Array:</strong> Effect runs when city changes</li>
        </ul>
      </div>
    </div>
  );
}

export default WeatherDashboard;
