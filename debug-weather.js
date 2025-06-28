// Simple debug script to test weather API
const fetch = require('node-fetch');

async function testWeatherAPI() {
  try {
    console.log('Testing weather API at http://localhost:3001...');
    
    // Test weather API with San Francisco coordinates
    const weatherResponse = await fetch('http://localhost:3001/api/weather?lat=37.7749&lon=-122.4194');
    
    if (!weatherResponse.ok) {
      console.error('Weather API failed:', weatherResponse.status, weatherResponse.statusText);
      return;
    }
    
    const weatherData = await weatherResponse.json();
    console.log('Weather API Success! Data structure:');
    console.log({
      location: weatherData.location,
      current: {
        temperature: weatherData.current.temperature,
        condition: weatherData.current.condition,
        windSpeed: weatherData.current.windSpeed,
      },
      forecastCount: weatherData.forecast.hourly.length,
    });
    
    // Test energy API
    const energyResponse = await fetch('http://localhost:3001/api/energy');
    
    if (!energyResponse.ok) {
      console.error('Energy API failed:', energyResponse.status, energyResponse.statusText);
      return;
    }
    
    const energyData = await energyResponse.json();
    console.log('Energy API Success! Renewable percentage:', energyData.renewable.percentage);
    
  } catch (error) {
    console.error('API test failed:', error.message);
  }
}

testWeatherAPI();