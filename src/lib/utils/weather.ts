import { WIND_DIRECTION_LABELS, UV_INDEX_LEVELS } from '@/lib/constants/weather';
import type { WeatherCondition } from '@/types/weather';

export function getWindDirection(degrees: number): string {
  const label = WIND_DIRECTION_LABELS.find(
    (dir) => degrees >= dir.min && degrees < dir.max
  );
  return label?.label || 'N';
}

export function getUVIndexLevel(index: number) {
  const level = UV_INDEX_LEVELS.find(
    (level) => index >= level.min && index <= level.max
  );
  return level || UV_INDEX_LEVELS[0];
}

export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

export function fahrenheitToCelsius(fahrenheit: number): number {
  return ((fahrenheit - 32) * 5) / 9;
}

export function getWeatherDescription(condition: WeatherCondition): string {
  const descriptions: Record<WeatherCondition, string> = {
    'clear-day': 'Clear skies with abundant sunshine',
    'clear-night': 'Clear night with visible stars',
    'partly-cloudy': 'Partly cloudy with some sunshine',
    'cloudy': 'Overcast skies throughout the day',
    'rainy': 'Rain expected, carry an umbrella',
    'stormy': 'Thunderstorms likely, stay indoors if possible',
    'snowy': 'Snow falling, drive carefully',
    'windy': 'Strong winds, secure loose objects',
    'foggy': 'Limited visibility due to fog',
  };
  
  return descriptions[condition] || 'Weather conditions variable';
}

export function calculateDewPoint(temp: number, humidity: number): number {
  const a = 17.27;
  const b = 237.7;
  const alpha = ((a * temp) / (b + temp)) + Math.log(humidity / 100);
  return (b * alpha) / (a - alpha);
}

export function calculateHeatIndex(temp: number, humidity: number): number {
  // Simple heat index formula (in Celsius)
  if (temp < 27) return temp;
  
  const tempF = celsiusToFahrenheit(temp);
  const heatIndexF = 
    -42.379 +
    2.04901523 * tempF +
    10.14333127 * humidity -
    0.22475541 * tempF * humidity -
    0.00683783 * tempF * tempF -
    0.05481717 * humidity * humidity +
    0.00122874 * tempF * tempF * humidity +
    0.00085282 * tempF * humidity * humidity -
    0.00000199 * tempF * tempF * humidity * humidity;
    
  return fahrenheitToCelsius(heatIndexF);
}

export function calculateWindChill(temp: number, windSpeed: number): number {
  // Wind chill formula (temp in C, wind in km/h)
  if (temp > 10 || windSpeed < 5) return temp;
  
  const windKmh = windSpeed * 3.6;
  return (
    13.12 +
    0.6215 * temp -
    11.37 * Math.pow(windKmh, 0.16) +
    0.3965 * temp * Math.pow(windKmh, 0.16)
  );
}

export function isNightTime(hour: number): boolean {
  return hour < 6 || hour >= 18;
}

export function getTimeOfDay(hour: number): 'morning' | 'afternoon' | 'evening' | 'night' {
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}