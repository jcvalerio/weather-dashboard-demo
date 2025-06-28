'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { WeatherIcon } from '@/components/weather/weather-icon';
import { 
  Wind, 
  Droplets, 
  Gauge, 
  Eye,
  MapPin,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useWeather, useRefreshWeather } from '@/lib/hooks/use-weather';
import { useLocationStore } from '@/lib/store/location-store';
import { formatTemperature, formatSpeed, formatPressure, formatPercentage } from '@/lib/utils/format';
import { getWindDirection } from '@/lib/utils/weather';
import { WEATHER_CONDITIONS } from '@/lib/constants/weather';
import { cn } from '@/lib/utils';


export function CurrentWeatherCard() {
  const { coordinates } = useLocationStore();
  const { data: weather, error, isLoading, refetch } = useWeather(coordinates);
  const refreshWeather = useRefreshWeather();

  const handleRefresh = () => {
    if (coordinates) {
      refreshWeather.mutate(coordinates);
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6 h-full">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
        <div className="text-center mb-6">
          <Skeleton className="h-20 w-20 rounded-full mx-auto mb-4" />
          <Skeleton className="h-10 w-24 mx-auto mb-2" />
          <Skeleton className="h-4 w-32 mx-auto mb-2" />
          <Skeleton className="h-4 w-40 mx-auto" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <div className="flex-1">
                <Skeleton className="h-4 w-12 mb-1" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Skeleton className="h-16 w-full rounded-lg" />
        </div>
      </Card>
    );
  }

  if (error || !weather || !weather.current || !weather.location) {
    return (
      <Card className="p-6 h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">
              Weather Data
            </span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-8 h-8"
            onClick={() => refetch()}
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-3" />
            <p className="text-sm font-medium mb-2">
              {error ? 'Failed to load weather data' : 'No location selected'}
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              {error ? 'Check your connection and try again' : 'Please select a location'}
            </p>
            <Button onClick={() => refetch()} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  const conditionStyle = WEATHER_CONDITIONS[weather.current.condition];

  return (
    <Card className="p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">
            {weather.location.city}, {weather.location.country}
          </span>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="w-8 h-8"
          onClick={handleRefresh}
          disabled={refreshWeather.isPending}
        >
          <RefreshCw className={cn("w-4 h-4", refreshWeather.isPending && "animate-spin")} />
        </Button>
      </div>

      {/* Main Temperature Display */}
      <div className="text-center mb-6">
        <div className={cn("inline-flex p-4 rounded-full mb-4", conditionStyle.bgColor)}>
          <div className={conditionStyle.color}>
            <WeatherIcon condition={weather.current.condition} size={48} />
          </div>
        </div>
        
        <div className="text-4xl font-bold mb-2">
          {formatTemperature(weather.current.temperature)}
        </div>
        
        <div className="text-muted-foreground mb-2">
          Feels like {formatTemperature(weather.current.feelsLike)}
        </div>
        
        <div className="text-sm font-medium capitalize">
          {weather.current.description}
        </div>
      </div>

      {/* Weather Details Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Wind className="w-4 h-4 text-muted-foreground" />
          <div className="text-sm">
            <div className="font-medium">
              {formatSpeed(weather.current.windSpeed)}
            </div>
            <div className="text-muted-foreground text-xs">
              {getWindDirection(weather.current.windDirection)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Droplets className="w-4 h-4 text-muted-foreground" />
          <div className="text-sm">
            <div className="font-medium">
              {formatPercentage(weather.current.humidity)}
            </div>
            <div className="text-muted-foreground text-xs">Humidity</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-muted-foreground" />
          <div className="text-sm">
            <div className="font-medium">
              {formatPressure(weather.current.pressure)}
            </div>
            <div className="text-muted-foreground text-xs">Pressure</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-muted-foreground" />
          <div className="text-sm">
            <div className="font-medium">{weather.current.visibility} km</div>
            <div className="text-muted-foreground text-xs">Visibility</div>
          </div>
        </div>
      </div>

      {/* UV Index */}
      <div className="mt-4 p-3 rounded-lg bg-muted/50">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">UV Index</span>
          <span className="text-sm font-bold">{weather.current.uvIndex}</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2 mt-2">
          <div 
            className="bg-gradient-to-r from-green-400 via-yellow-400 via-orange-400 to-red-500 h-2 rounded-full transition-all"
            style={{ width: `${Math.min(weather.current.uvIndex * 10, 100)}%` }}
          />
        </div>
      </div>
    </Card>
  );
}