'use client';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ComposedChart, Bar, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Zap, TrendingUp, Battery, AlertCircle } from 'lucide-react';
import { useEnergyData } from '@/lib/hooks/use-energy';
import { formatNumber } from '@/lib/utils/format';

export function EnergyDemandChart() {
  const { data: energyData, error, isLoading } = useEnergyData();

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
        <Skeleton className="h-64 w-full mb-4" />
        <div className="border-t pt-4">
          <Skeleton className="h-4 w-32 mb-3" />
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (error || !energyData) {
    return (
      <Card className="p-6 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            {error ? 'Failed to load energy data' : 'No energy data available'}
          </p>
        </div>
      </Card>
    );
  }
  
  const chartData = energyData.forecastDemand.map(item => ({
    time: new Date(item.timestamp).toLocaleTimeString('en-US', { 
      hour: 'numeric',
      hour12: true 
    }),
    actual: Math.round(item.demand),
    forecast: Math.round(item.forecast),
    timestamp: item.timestamp,
  }));

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          <h3 className="text-lg font-semibold">Energy Demand Forecast</h3>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <TrendingUp className="w-4 h-4" />
          <span>MW</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 rounded-lg bg-muted/50">
          <div className="text-2xl font-bold text-blue-600">
            {formatNumber(energyData.currentDemand)}
          </div>
          <div className="text-sm text-muted-foreground">Current Demand</div>
          <div className="text-xs text-muted-foreground">MW</div>
        </div>
        
        <div className="text-center p-3 rounded-lg bg-muted/50">
          <div className="text-2xl font-bold text-red-600">
            {formatNumber(energyData.peakDemand)}
          </div>
          <div className="text-sm text-muted-foreground">Peak Demand</div>
          <div className="text-xs text-muted-foreground">MW</div>
        </div>
        
        <div className="text-center p-3 rounded-lg bg-muted/50">
          <div className="text-2xl font-bold text-green-600">
            {energyData.renewable.percentage}%
          </div>
          <div className="text-sm text-muted-foreground">Renewable</div>
          <div className="text-xs text-muted-foreground">
            {formatNumber(energyData.renewable.total)} MW
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData}>
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
            />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-popover p-3 rounded-lg border shadow-lg">
                      <p className="text-sm font-medium mb-2">{label}</p>
                      {payload.map((entry, index) => (
                        <p key={index} className="text-sm" style={{ color: entry.color }}>
                          {entry.name}: {formatNumber(entry.value as number)} MW
                        </p>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Bar 
              dataKey="actual" 
              name="Actual Demand"
              fill="hsl(var(--primary))"
              fillOpacity={0.6}
              radius={[2, 2, 0, 0]}
            />
            <Line 
              type="monotone" 
              dataKey="forecast" 
              name="Forecast"
              stroke="hsl(var(--destructive))"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Renewable Energy Breakdown */}
      <div className="border-t pt-4">
        <div className="flex items-center gap-2 mb-3">
          <Battery className="w-4 h-4 text-green-500" />
          <h4 className="font-medium">Renewable Sources</h4>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-yellow-600">
              {formatNumber(energyData.renewable.solar)}
            </div>
            <div className="text-xs text-muted-foreground">Solar MW</div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-600">
              {formatNumber(energyData.renewable.wind)}
            </div>
            <div className="text-xs text-muted-foreground">Wind MW</div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-semibold text-cyan-600">
              {formatNumber(energyData.renewable.hydro)}
            </div>
            <div className="text-xs text-muted-foreground">Hydro MW</div>
          </div>
        </div>
      </div>
    </Card>
  );
}