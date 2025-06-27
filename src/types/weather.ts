export interface Coordinates {
  lat: number;
  lon: number;
}

export interface Location {
  city: string;
  country: string;
  coordinates: Coordinates;
}

export type WeatherCondition = 
  | 'clear-day'
  | 'clear-night'
  | 'partly-cloudy'
  | 'cloudy'
  | 'rainy'
  | 'stormy'
  | 'snowy'
  | 'windy'
  | 'foggy';

export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  visibility: number;
  uvIndex: number;
  condition: WeatherCondition;
  icon: string;
  description: string;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  precipitation: number;
  condition: WeatherCondition;
  icon: string;
}

export interface DailyForecast {
  date: string;
  tempMin: number;
  tempMax: number;
  precipitation: number;
  humidity: number;
  windSpeed: number;
  condition: WeatherCondition;
  icon: string;
  description: string;
}

export interface WeatherForecast {
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}

export interface WeatherData {
  location: Location;
  current: CurrentWeather;
  forecast: WeatherForecast;
  lastUpdated: string;
}

export interface WeatherAlert {
  id: string;
  type: 'warning' | 'watch' | 'advisory';
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  severity: 'low' | 'medium' | 'high' | 'extreme';
}