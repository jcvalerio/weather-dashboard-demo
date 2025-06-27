export const TEMPERATURE_UNITS = {
  celsius: '°C',
  fahrenheit: '°F',
  kelvin: 'K',
} as const;

export const WIND_UNITS = {
  ms: 'm/s',
  kmh: 'km/h',
  mph: 'mph',
  knots: 'knots',
} as const;

export const PRESSURE_UNITS = {
  hpa: 'hPa',
  mb: 'mb',
  inhg: 'inHg',
  mmhg: 'mmHg',
} as const;

export const WEATHER_CONDITIONS = {
  'clear-day': {
    label: 'Clear',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50',
  },
  'clear-night': {
    label: 'Clear',
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-50',
  },
  'partly-cloudy': {
    label: 'Partly Cloudy',
    color: 'text-gray-500',
    bgColor: 'bg-gray-50',
  },
  'cloudy': {
    label: 'Cloudy',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
  },
  'rainy': {
    label: 'Rainy',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
  },
  'stormy': {
    label: 'Stormy',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  'snowy': {
    label: 'Snowy',
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-50',
  },
  'windy': {
    label: 'Windy',
    color: 'text-teal-500',
    bgColor: 'bg-teal-50',
  },
  'foggy': {
    label: 'Foggy',
    color: 'text-gray-400',
    bgColor: 'bg-gray-50',
  },
} as const;

export const UV_INDEX_LEVELS = [
  { min: 0, max: 2, label: 'Low', color: 'text-green-500' },
  { min: 3, max: 5, label: 'Moderate', color: 'text-yellow-500' },
  { min: 6, max: 7, label: 'High', color: 'text-orange-500' },
  { min: 8, max: 10, label: 'Very High', color: 'text-red-500' },
  { min: 11, max: Infinity, label: 'Extreme', color: 'text-purple-600' },
] as const;

export const WIND_DIRECTION_LABELS = [
  { min: 0, max: 22.5, label: 'N' },
  { min: 22.5, max: 67.5, label: 'NE' },
  { min: 67.5, max: 112.5, label: 'E' },
  { min: 112.5, max: 157.5, label: 'SE' },
  { min: 157.5, max: 202.5, label: 'S' },
  { min: 202.5, max: 247.5, label: 'SW' },
  { min: 247.5, max: 292.5, label: 'W' },
  { min: 292.5, max: 337.5, label: 'NW' },
  { min: 337.5, max: 360, label: 'N' },
] as const;