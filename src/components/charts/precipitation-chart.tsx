'use client';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { CloudRain, Droplets, AlertCircle } from 'lucide-react';
import { useWeather } from '@/lib/hooks/use-weather';
import { useLocationStore } from '@/lib/store/location-store';
import { formatHour } from '@/lib/utils/format';

export function PrecipitationChart() {
  const { coordinates } = useLocationStore();
  const { data: weather, error, isLoading } = useWeather(coordinates);

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-48 w-full mb-4" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </Card>
    );
  }

  if (error || !weather || !weather.forecast) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <CloudRain className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold">Precipitation Forecast</h3>
        </div>
        
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No precipitation data available
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const precipitationData = weather.forecast.hourly.slice(0, 12).map(hour => ({
    time: formatHour(hour.time),
    precipitation: hour.precipitation,
    timestamp: hour.time,
  }));

  const maxPrecipitation = Math.max(...precipitationData.map(item => item.precipitation));
  const rainHours = precipitationData.filter(item => item.precipitation > 0).length;

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <CloudRain className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-semibold">Precipitation Forecast</h3>
      </div>

      {/* Chart */}
      <div className="h-48 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={precipitationData}>
            <defs>
              <linearGradient id="precipitationGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
              </linearGradient>
            </defs>
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
              domain={[0, 'dataMax + 10']}
            />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-popover p-3 rounded-lg border shadow-lg">
                      <p className="text-sm font-medium">{label}</p>
                      <p className="text-sm text-blue-500">
                        Precipitation: {Math.round(payload[0].value as number)}%
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area 
              type="monotone" 
              dataKey="precipitation" 
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#precipitationGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 rounded-lg bg-muted/50">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Droplets className="w-4 h-4 text-blue-500" />
            <span className="text-lg font-semibold text-blue-600">
              {Math.round(maxPrecipitation)}%
            </span>
          </div>
          <div className="text-xs text-muted-foreground">Peak Chance</div>
        </div>
        
        <div className="text-center p-3 rounded-lg bg-muted/50">
          <div className="flex items-center justify-center gap-1 mb-1">
            <CloudRain className="w-4 h-4 text-blue-500" />
            <span className="text-lg font-semibold text-blue-600">
              {rainHours}h
            </span>
          </div>
          <div className="text-xs text-muted-foreground">Rain Hours</div>
        </div>
      </div>

      {/* Rain Probability Message */}
      {maxPrecipitation > 50 && (
        <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2">
            <CloudRain className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-800 dark:text-blue-200 font-medium">
              High chance of rain - consider bringing an umbrella!
            </span>
          </div>
        </div>
      )}
    </Card>
  );
}