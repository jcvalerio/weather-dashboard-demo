import {
  Cloud,
  CloudDrizzle,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Sun,
  Moon,
  Wind,
  Snowflake,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { WeatherCondition } from '@/types/weather'

export interface WeatherIconProps {
  /** Weather condition or icon code */
  condition?: WeatherCondition
  /** OpenWeatherMap icon code (e.g., '01d', '02n') */
  icon?: string
  /** Icon size */
  size?: number
  /** Additional CSS classes */
  className?: string
}

/**
 * WeatherIcon component that displays appropriate weather icons
 * based on either weather conditions or OpenWeatherMap icon codes
 */
export function WeatherIcon({ 
  condition, 
  icon, 
  size = 24, 
  className 
}: WeatherIconProps) {
  const iconProps = { 
    size, 
    className: cn('text-current', className),
    'data-testid': 'weather-icon'
  }

  // If icon code is provided, use that for mapping
  if (icon) {
    return getIconFromCode(icon, iconProps)
  }

  // Otherwise use weather condition
  return getIconFromCondition(condition || 'clear-day', iconProps)
}

interface IconProps {
  size: number;
  className: string;
  'data-testid': string;
}

/**
 * Maps OpenWeatherMap icon codes to Lucide icons
 */
function getIconFromCode(iconCode: string, iconProps: IconProps) {
  const code = iconCode.toLowerCase()
  
  switch (code) {
    case '01d': // clear sky day
      return <Sun {...iconProps} />
    case '01n': // clear sky night
      return <Moon {...iconProps} />
    case '02d': // few clouds day
    case '03d': // scattered clouds day
      return <Cloud {...iconProps} />
    case '02n': // few clouds night
    case '03n': // scattered clouds night
      return <Cloud {...iconProps} />
    case '04d': // broken clouds day
    case '04n': // broken clouds night
      return <Cloud {...iconProps} />
    case '09d': // shower rain day
    case '09n': // shower rain night
      return <CloudDrizzle {...iconProps} />
    case '10d': // rain day
    case '10n': // rain night
      return <CloudRain {...iconProps} />
    case '11d': // thunderstorm day
    case '11n': // thunderstorm night
      return <CloudLightning {...iconProps} />
    case '13d': // snow day
    case '13n': // snow night
      return <CloudSnow {...iconProps} />
    case '50d': // mist day
    case '50n': // mist night
      return <Wind {...iconProps} />
    default:
      return <Sun {...iconProps} />
  }
}

/**
 * Maps weather conditions to Lucide icons
 */
function getIconFromCondition(condition: WeatherCondition, iconProps: IconProps) {
  switch (condition) {
    case 'clear-day':
      return <Sun {...iconProps} />
    case 'clear-night':
      return <Moon {...iconProps} />
    case 'partly-cloudy':
      return <Cloud {...iconProps} />
    case 'cloudy':
      return <Cloud {...iconProps} />
    case 'rainy':
      return <CloudRain {...iconProps} />
    case 'stormy':
      return <CloudLightning {...iconProps} />
    case 'snowy':
      return <Snowflake {...iconProps} />
    case 'windy':
      return <Wind {...iconProps} />
    case 'foggy':
      return <Wind {...iconProps} />
    default:
      return <Sun {...iconProps} />
  }
}