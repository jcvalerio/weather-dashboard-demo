import type { WeatherData, Coordinates } from '@/types/weather';
import { mockCurrentWeather } from '@/lib/mocks/weather-data';
import { WEATHER_API_KEY, WEATHER_API_URL } from '@/lib/constants/api';

// Using OpenWeatherMap API structure
interface OpenWeatherResponse {
  coord: { lon: number; lat: number };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type?: number;
    id?: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

interface ForecastResponse {
  cod: string;
  message: number;
  cnt: number;
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      sea_level: number;
      grnd_level: number;
      humidity: number;
      temp_kf: number;
    };
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    clouds: {
      all: number;
    };
    wind: {
      speed: number;
      deg: number;
      gust: number;
    };
    visibility: number;
    pop: number;
    rain?: {
      '3h': number;
    };
    snow?: {
      '3h': number;
    };
    sys: {
      pod: string;
    };
    dt_txt: string;
  }>;
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

function mapWeatherCondition(iconCode: string): 'clear-day' | 'clear-night' | 'partly-cloudy' | 'cloudy' | 'rainy' | 'stormy' | 'snowy' | 'windy' | 'foggy' {
  const iconMap: Record<string, 'clear-day' | 'clear-night' | 'partly-cloudy' | 'cloudy' | 'rainy' | 'stormy' | 'snowy' | 'windy' | 'foggy'> = {
    '01d': 'clear-day',
    '01n': 'clear-night',
    '02d': 'partly-cloudy',
    '02n': 'partly-cloudy',
    '03d': 'cloudy',
    '03n': 'cloudy',
    '04d': 'cloudy',
    '04n': 'cloudy',
    '09d': 'rainy',
    '09n': 'rainy',
    '10d': 'rainy',
    '10n': 'rainy',
    '11d': 'stormy',
    '11n': 'stormy',
    '13d': 'snowy',
    '13n': 'snowy',
    '50d': 'foggy',
    '50n': 'foggy',
  };
  
  return iconMap[iconCode] || 'partly-cloudy';
}

class WeatherService {
  private baseURL = WEATHER_API_URL;
  private apiKey = WEATHER_API_KEY;

  async getCurrentWeather(coords: Coordinates, options?: { returnRawFormat?: boolean }): Promise<WeatherData | OpenWeatherResponse> {
    // Always return mock data for now to ensure functionality
    console.log('Weather service called with coords:', coords);
    console.log('API key:', this.apiKey ? 'Present' : 'Missing');
    
    // Return mock data when API key is not available
    if (!this.apiKey || this.apiKey === '') {
      console.log('Using mock weather data');
      
      // If raw format is requested (for API route compatibility), return OpenWeatherMap format
      if (options?.returnRawFormat) {
        return this.getMockRawWeatherData(coords);
      }
      
      return mockCurrentWeather;
    }

    try {
      // If raw format is requested, only fetch current weather
      if (options?.returnRawFormat) {
        const currentResponse = await fetch(
          `${this.baseURL}/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${this.apiKey}&units=metric`
        );

        if (!currentResponse.ok) {
          throw new Error('Failed to fetch weather data');
        }

        const currentData: OpenWeatherResponse = await currentResponse.json();
        return currentData;
      }

      // For transformed data, fetch both current and forecast
      const [currentResponse, forecastResponse] = await Promise.all([
        fetch(
          `${this.baseURL}/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${this.apiKey}&units=metric`
        ),
        fetch(
          `${this.baseURL}/forecast?lat=${coords.lat}&lon=${coords.lon}&appid=${this.apiKey}&units=metric`
        ),
      ]);

      if (!currentResponse.ok || !forecastResponse.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const currentData: OpenWeatherResponse = await currentResponse.json();
      const forecastData: ForecastResponse = await forecastResponse.json();

      return this.transformWeatherData(currentData, forecastData);
    } catch (error) {
      console.error('Weather API error:', error);
      // For API routes, throw the error to be handled by the route
      // For client-side usage, return fallback data
      if (options?.returnRawFormat) {
        throw error;
      }
      return mockCurrentWeather;
    }
  }

  async searchLocations(query: string): Promise<Array<{ name: string; country: string; lat: number; lon: number }>> {
    if (!this.apiKey || this.apiKey === '') {
      // Return mock search results
      return [
        { name: 'San Francisco', country: 'US', lat: 37.7749, lon: -122.4194 },
        { name: 'New York', country: 'US', lat: 40.7128, lon: -74.0060 },
        { name: 'London', country: 'GB', lat: 51.5074, lon: -0.1278 },
      ].filter(location => 
        location.name.toLowerCase().includes(query.toLowerCase()) ||
        location.country.toLowerCase().includes(query.toLowerCase())
      );
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error('Failed to search locations');
      }

      const data = await response.json();
      return data.map((item: { name: string; country: string; lat: number; lon: number }) => ({
        name: item.name,
        country: item.country,
        lat: item.lat,
        lon: item.lon,
      }));
    } catch (error) {
      console.error('Location search error:', error);
      return [];
    }
  }

  private getMockRawWeatherData(coords: Coordinates): OpenWeatherResponse {
    return {
      coord: { lon: coords.lon, lat: coords.lat },
      weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
      base: 'mock',
      main: {
        temp: 72,
        feels_like: 68,
        temp_min: 65,
        temp_max: 78,
        pressure: 1013,
        humidity: 65,
      },
      visibility: 10000,
      wind: { speed: 12, deg: 270 },
      clouds: { all: 0 },
      dt: Math.floor(Date.now() / 1000),
      sys: {
        type: 2,
        id: 2012516,
        country: 'US',
        sunrise: Math.floor(Date.now() / 1000) - 3600,
        sunset: Math.floor(Date.now() / 1000) + 3600,
      },
      timezone: -25200,
      id: 5391959,
      name: 'San Francisco',
      cod: 200,
    };
  }

  private transformWeatherData(current: OpenWeatherResponse, forecast: ForecastResponse): WeatherData {
    const hourlyForecast = forecast.list.slice(0, 24).map(item => ({
      time: new Date(item.dt * 1000).toISOString(),
      temperature: item.main.temp,
      precipitation: item.pop * 100,
      condition: mapWeatherCondition(item.weather[0].icon),
      icon: item.weather[0].icon,
    }));

    // Group forecast by day for daily forecast
    const dailyGroups = forecast.list.reduce((acc, item) => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!acc[date]) acc[date] = [];
      acc[date].push(item);
      return acc;
    }, {} as Record<string, typeof forecast.list>);

    const dailyForecast = Object.entries(dailyGroups).slice(0, 7).map(([date, items]) => {
      const temps = items.map(item => item.main.temp);
      const precipitations = items.map(item => item.pop * 100);
      const mostCommonWeather = items[Math.floor(items.length / 2)];

      return {
        date: new Date(date).toISOString(),
        tempMin: Math.min(...temps),
        tempMax: Math.max(...temps),
        precipitation: Math.max(...precipitations),
        humidity: mostCommonWeather.main.humidity,
        windSpeed: mostCommonWeather.wind.speed,
        condition: mapWeatherCondition(mostCommonWeather.weather[0].icon),
        icon: mostCommonWeather.weather[0].icon,
        description: mostCommonWeather.weather[0].description,
      };
    });

    return {
      location: {
        city: current.name,
        country: current.sys.country,
        coordinates: {
          lat: current.coord.lat,
          lon: current.coord.lon,
        },
      },
      current: {
        temperature: current.main.temp,
        feelsLike: current.main.feels_like,
        humidity: current.main.humidity,
        pressure: current.main.pressure,
        windSpeed: current.wind.speed,
        windDirection: current.wind.deg,
        visibility: current.visibility / 1000, // Convert to km
        uvIndex: 6, // OpenWeather UV data requires a separate API call
        condition: mapWeatherCondition(current.weather[0].icon),
        icon: current.weather[0].icon,
        description: current.weather[0].description,
      },
      forecast: {
        hourly: hourlyForecast,
        daily: dailyForecast,
      },
      lastUpdated: new Date().toISOString(),
    };
  }
}

export const weatherService = new WeatherService();