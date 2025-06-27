export const APP_CONFIG = {
  name: 'Weather Intelligence Dashboard',
  description: 'Real-time weather monitoring and energy demand forecasting',
  version: '1.0.0',
} as const;

export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
  weatherApiKey: process.env.NEXT_PUBLIC_WEATHER_API_KEY || '',
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
} as const;

export const CACHE_CONFIG = {
  weatherTTL: 5 * 60 * 1000, // 5 minutes
  energyTTL: 10 * 60 * 1000, // 10 minutes
  locationTTL: 60 * 60 * 1000, // 1 hour
} as const;

export const UPDATE_INTERVALS = {
  weather: 5 * 60 * 1000, // 5 minutes
  energy: 10 * 60 * 1000, // 10 minutes
  alerts: 2 * 60 * 1000, // 2 minutes
} as const;

export const BREAKPOINTS = {
  mobile: 640,
  tablet: 768,
  desktop: 1024,
  wide: 1280,
} as const;

export const WEATHER_ICONS = {
  'clear-day': 'sun',
  'clear-night': 'moon',
  'partly-cloudy': 'cloud-sun',
  'cloudy': 'cloud',
  'rainy': 'cloud-rain',
  'stormy': 'cloud-lightning',
  'snowy': 'cloud-snow',
  'windy': 'wind',
  'foggy': 'cloud-fog',
} as const;