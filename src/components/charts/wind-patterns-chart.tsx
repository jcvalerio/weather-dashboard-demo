'use client';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, PolarGrid, PolarAngleAxis, RadarChart, PolarRadiusAxis, Radar } from 'recharts';
import { Wind, Navigation, AlertCircle } from 'lucide-react';
import { useWeather } from '@/lib/hooks/use-weather';
import { useLocationStore } from '@/lib/store/location-store';
import { formatHour, formatSpeed } from '@/lib/utils/format';
import { getWindDirection } from '@/lib/utils/weather';

export function WindPatternsChart() {
  const { coordinates } = useLocationStore();
  const { data: weather, error, isLoading } = useWeather(coordinates);

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-12 w-full" />
      </Card>
    );
  }

  if (error || !weather) {
    return (
      <Card className="p-6 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            No wind data available
          </p>
        </div>
      </Card>
    );
  }

  // Current wind data
  const currentWind = weather.current;
  
  // Simulate wind speed data for the next 12 hours
  const windSpeedData = weather.forecast.hourly.slice(0, 12).map((hour, index) => ({
    time: formatHour(hour.time),
    speed: currentWind.windSpeed + (Math.sin(index / 2) * 2) + (Math.random() - 0.5) * 3,
    direction: currentWind.windDirection + (Math.sin(index / 3) * 30) + (Math.random() - 0.5) * 20,
  }));

  // Wind direction distribution for radar chart
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const windDirectionData = directions.map(direction => ({
    direction,
    frequency: Math.random() * 15 + 5, // Simulate frequency data
  }));

  const maxWindSpeed = Math.max(...windSpeedData.map(item => item.speed));
  const avgWindSpeed = windSpeedData.reduce((sum, item) => sum + item.speed, 0) / windSpeedData.length;

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Wind className="w-5 h-5 text-cyan-500" />
        <h3 className="text-lg font-semibold">Wind Patterns</h3>
      </div>

      {/* Current Wind Display */}
      <div className="flex items-center justify-center mb-6 p-4 rounded-lg bg-muted/50">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Navigation 
              className="w-6 h-6 text-cyan-500" 
              style={{ transform: `rotate(${currentWind.windDirection}deg)` }}
            />
            <span className="text-2xl font-bold">
              {formatSpeed(currentWind.windSpeed)}
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            {getWindDirection(currentWind.windDirection)} Wind
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Wind Speed Timeline */}
        <div>
          <h4 className="text-sm font-medium mb-2">Speed Timeline</h4>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={windSpeedData}>
                <XAxis 
                  dataKey="time" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  domain={[0, 'dataMax + 2']}
                />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-popover p-2 rounded-lg border shadow-lg">
                          <p className="text-xs font-medium">{label}</p>
                          <p className="text-xs text-cyan-500">
                            Speed: {formatSpeed(payload[0].value as number)}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="speed" 
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Wind Direction Distribution */}
        <div>
          <h4 className="text-sm font-medium mb-2">Direction Distribution</h4>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={windDirectionData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="direction" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis
                  angle={0}
                  domain={[0, 20]}
                  tick={{ fontSize: 8 }}
                  tickCount={3}
                />
                <Radar
                  name="Frequency"
                  dataKey="frequency"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Wind Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 rounded-lg bg-muted/50">
          <div className="text-lg font-semibold text-cyan-600">
            {formatSpeed(maxWindSpeed)}
          </div>
          <div className="text-xs text-muted-foreground">Peak Gust</div>
        </div>
        
        <div className="text-center p-3 rounded-lg bg-muted/50">
          <div className="text-lg font-semibold text-cyan-600">
            {formatSpeed(avgWindSpeed)}
          </div>
          <div className="text-xs text-muted-foreground">Average</div>
        </div>
      </div>

      {/* Wind Warning */}
      {maxWindSpeed > 10 && (
        <div className="mt-4 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-yellow-600" />
            <span className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
              Strong winds expected - secure loose objects
            </span>
          </div>
        </div>
      )}
    </Card>
  );
}