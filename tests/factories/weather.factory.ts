import { WeatherData, WeatherCondition, DailyForecast, HourlyForecast, Location, CurrentWeather, WeatherForecast } from '@/types/weather'

export const createMockWeatherData = (overrides?: Partial<WeatherData>): WeatherData => ({
  location: {
    city: 'San Francisco',
    country: 'United States',
    coordinates: {
      lat: 37.7749,
      lon: -122.4194,
    },
  },
  current: {
    temperature: 72,
    feelsLike: 68,
    humidity: 65,
    pressure: 1013,
    windSpeed: 12,
    windDirection: 270,
    visibility: 10,
    uvIndex: 6,
    condition: 'clear-day' as WeatherCondition,
    icon: '01d',
    description: 'Clear sky',
  },
  forecast: {
    hourly: createMockHourlyForecast(),
    daily: createMockDailyForecast(),
  },
  lastUpdated: new Date().toISOString(),
  ...overrides,
})

export const createMockHourlyForecast = (): HourlyForecast[] => 
  Array.from({ length: 24 }, (_, i) => ({
    time: new Date(Date.now() + i * 3600000).toISOString(),
    temperature: 70 + Math.random() * 10,
    precipitation: Math.random() * 20,
    condition: 'clear-day' as WeatherCondition,
    icon: i < 6 || i > 18 ? '01n' : '01d',
  }))

export const createMockDailyForecast = (): DailyForecast[] =>
  Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() + i * 86400000).toISOString(),
    tempMin: 60 + Math.random() * 10,
    tempMax: 75 + Math.random() * 15,
    precipitation: Math.random() * 30,
    humidity: 50 + Math.random() * 30,
    windSpeed: 5 + Math.random() * 15,
    condition: 'clear-day' as WeatherCondition,
    icon: '01d',
    description: 'Clear sky',
  }))