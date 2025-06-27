import type { WeatherData, WeatherAlert } from '@/types/weather';
import { addHours, addDays } from 'date-fns';

const now = new Date();

export const mockCurrentWeather: WeatherData = {
  location: {
    city: 'San Francisco',
    country: 'US',
    coordinates: { lat: 37.7749, lon: -122.4194 },
  },
  current: {
    temperature: 22,
    feelsLike: 20,
    humidity: 65,
    pressure: 1013,
    windSpeed: 4.2,
    windDirection: 270,
    visibility: 10,
    uvIndex: 6,
    condition: 'partly-cloudy',
    icon: '02d',
    description: 'Partly cloudy with mild temperatures',
  },
  forecast: {
    hourly: Array.from({ length: 24 }, (_, i) => ({
      time: addHours(now, i).toISOString(),
      temperature: 22 + Math.sin(i / 4) * 5,
      precipitation: i > 12 && i < 16 ? 20 + Math.random() * 30 : 0,
      condition: i > 12 && i < 16 ? 'rainy' : 'partly-cloudy',
      icon: i > 12 && i < 16 ? '10d' : '02d',
    })),
    daily: Array.from({ length: 7 }, (_, i) => ({
      date: addDays(now, i).toISOString(),
      tempMin: 15 + Math.random() * 3,
      tempMax: 25 + Math.random() * 5,
      precipitation: i === 2 || i === 5 ? 40 + Math.random() * 20 : Math.random() * 10,
      humidity: 60 + Math.random() * 20,
      windSpeed: 3 + Math.random() * 5,
      condition: i === 2 || i === 5 ? 'rainy' : 'partly-cloudy',
      icon: i === 2 || i === 5 ? '10d' : '02d',
      description: i === 2 || i === 5 ? 'Rainy' : 'Partly cloudy',
    })),
  },
  lastUpdated: now.toISOString(),
};

export const mockWeatherAlerts: WeatherAlert[] = [
  {
    id: '1',
    type: 'warning',
    title: 'High Wind Warning',
    description: 'Strong winds expected this afternoon with gusts up to 60 mph',
    startTime: addHours(now, 4).toISOString(),
    endTime: addHours(now, 12).toISOString(),
    severity: 'high',
  },
  {
    id: '2',
    type: 'advisory',
    title: 'Air Quality Advisory',
    description: 'Moderate air quality due to wildfire smoke',
    startTime: now.toISOString(),
    endTime: addDays(now, 2).toISOString(),
    severity: 'medium',
  },
];

export const mockLocations = [
  { city: 'New York', country: 'US', coordinates: { lat: 40.7128, lon: -74.0060 } },
  { city: 'London', country: 'GB', coordinates: { lat: 51.5074, lon: -0.1278 } },
  { city: 'Tokyo', country: 'JP', coordinates: { lat: 35.6762, lon: 139.6503 } },
  { city: 'Sydney', country: 'AU', coordinates: { lat: -33.8688, lon: 151.2093 } },
  { city: 'Paris', country: 'FR', coordinates: { lat: 48.8566, lon: 2.3522 } },
];