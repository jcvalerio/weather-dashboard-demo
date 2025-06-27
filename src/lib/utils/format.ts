import { format, formatDistanceToNow, parseISO } from 'date-fns';

export function formatTemperature(temp: number, unit: 'C' | 'F' = 'C'): string {
  const rounded = Math.round(temp);
  return `${rounded}°${unit}`;
}

export function formatSpeed(speed: number, unit: 'ms' | 'kmh' | 'mph' = 'kmh'): string {
  let converted = speed;
  
  switch (unit) {
    case 'kmh':
      converted = speed * 3.6;
      break;
    case 'mph':
      converted = speed * 2.237;
      break;
  }
  
  return `${Math.round(converted)} ${unit === 'ms' ? 'm/s' : unit}`;
}

export function formatPressure(pressure: number, unit: 'hpa' | 'inhg' = 'hpa'): string {
  let converted = pressure;
  
  if (unit === 'inhg') {
    converted = pressure * 0.02953;
  }
  
  return `${unit === 'hpa' ? Math.round(converted) : converted.toFixed(2)} ${unit === 'hpa' ? 'hPa' : 'inHg'}`;
}

export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

export function formatDistance(distance: number, unit: 'km' | 'mi' = 'km'): string {
  let converted = distance;
  
  if (unit === 'mi') {
    converted = distance * 0.621371;
  }
  
  return `${converted.toFixed(1)} ${unit}`;
}

export function formatDateTime(date: string | Date, formatStr: string = 'PPpp'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
}

export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
}

export function formatHour(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'h a');
}

export function formatDayOfWeek(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'EEEE');
}

export function formatShortDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM d');
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(num: number, decimals: number = 0): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}