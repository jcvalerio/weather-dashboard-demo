'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Clock, Calendar, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useWeather } from '@/lib/hooks/use-weather';
import { useLocationStore } from '@/lib/store/location-store';
import { formatHour, formatTemperature } from '@/lib/utils/format';

export function WeatherForecastCard() {
  const { coordinates } = useLocationStore();
  const { data: weather, error, isLoading } = useWeather(coordinates);

  if (isLoading) {
    return (
      <Card className="p-6 h-full">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-6 w-48" />
          <div className="flex gap-1">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
        <div className="mb-6 h-48">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="grid grid-cols-8 gap-2 mb-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
        <div className="border-t pt-4">
          <Skeleton className="h-4 w-32 mb-4" />
          <div className="space-y-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (error || !weather) {
    return (
      <Card className="p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            {error ? 'Failed to load forecast data' : 'No location selected'}
          </p>
        </div>
      </Card>
    );
  }

  const hourlyData = weather.forecast.hourly.slice(0, 24).map(hour => ({
    time: formatHour(hour.time),
    temperature: Math.round(hour.temperature),
    precipitation: hour.precipitation,
    originalTime: hour.time,
  }));

  const dailyData = weather.forecast.daily.slice(0, 7);

  return (
    <Card className="p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          <h3 className="text-lg font-semibold">24-Hour Forecast</h3>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" className="text-xs">
            Hourly
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            Daily
          </Button>
        </div>
      </div>

      {/* Temperature Chart */}
      <div className="mb-6 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={hourlyData}>
            <XAxis 
              dataKey="time" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              domain={['dataMin - 2', 'dataMax + 2']}
            />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-popover p-3 rounded-lg border shadow-lg">
                      <p className="text-sm font-medium">{label}</p>
                      <p className="text-sm text-muted-foreground">
                        Temperature: {formatTemperature(payload[0].value as number)}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line 
              type="monotone" 
              dataKey="temperature" 
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Hourly Details */}
      <div className="grid grid-cols-8 gap-2 mb-6">
        {hourlyData.slice(0, 8).map((hour, index) => (
          <div 
            key={index}
            className="text-center p-2 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="text-xs text-muted-foreground mb-1">
              {hour.time}
            </div>
            <div className="text-sm font-medium mb-1">
              {formatTemperature(hour.temperature)}
            </div>
            {hour.precipitation > 0 && (
              <div className="text-xs text-blue-500">
                {hour.precipitation}%
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 7-Day Forecast */}
      <div className="border-t pt-4">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4" />
          <h4 className="font-medium">7-Day Forecast</h4>
        </div>
        
        <div className="space-y-2">
          {dailyData.map((day, index) => (
            <div 
              key={index}
              className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="text-sm font-medium min-w-[80px]">
                  {index === 0 ? 'Today' : 
                   index === 1 ? 'Tomorrow' : 
                   new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className="text-xs text-muted-foreground capitalize">
                  {day.description}
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {day.precipitation > 0 && (
                  <div className="text-xs text-blue-500">
                    {Math.round(day.precipitation)}%
                  </div>
                )}
                <div className="text-sm font-medium">
                  <span className="text-muted-foreground">
                    {formatTemperature(day.tempMin)}
                  </span>
                  <span className="mx-1">/</span>
                  <span>{formatTemperature(day.tempMax)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}