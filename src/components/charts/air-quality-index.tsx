'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Leaf, AlertTriangle, Shield, Wind } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AirQualityData {
  aqi: number;
  level: 'Good' | 'Moderate' | 'Unhealthy for Sensitive Groups' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';
  pm25: number;
  pm10: number;
  o3: number;
  no2: number;
  so2: number;
  co: number;
}

// Mock air quality data - in real app this would come from an API
const mockAirQuality: AirQualityData = {
  aqi: 42,
  level: 'Good',
  pm25: 12.5,
  pm10: 18.2,
  o3: 65.1,
  no2: 28.7,
  so2: 5.2,
  co: 0.8,
};

const getAQIColor = (aqi: number): string => {
  if (aqi <= 50) return 'text-green-600';
  if (aqi <= 100) return 'text-yellow-600';
  if (aqi <= 150) return 'text-orange-600';
  if (aqi <= 200) return 'text-red-600';
  if (aqi <= 300) return 'text-purple-600';
  return 'text-red-800';
};

const getAQIBgColor = (aqi: number): string => {
  if (aqi <= 50) return 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800';
  if (aqi <= 100) return 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800';
  if (aqi <= 150) return 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800';
  if (aqi <= 200) return 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800';
  if (aqi <= 300) return 'bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800';
  return 'bg-red-100 dark:bg-red-950/30 border-red-300 dark:border-red-700';
};

const getAQIIcon = (aqi: number) => {
  if (aqi <= 50) return <Leaf className="w-5 h-5 text-green-600" />;
  if (aqi <= 100) return <Shield className="w-5 h-5 text-yellow-600" />;
  if (aqi <= 150) return <Wind className="w-5 h-5 text-orange-600" />;
  return <AlertTriangle className="w-5 h-5 text-red-600" />;
};

const getHealthRecommendation = (level: AirQualityData['level']): string => {
  const recommendations = {
    'Good': 'Air quality is satisfactory and poses little or no risk.',
    'Moderate': 'Air quality is acceptable for most people.',
    'Unhealthy for Sensitive Groups': 'Sensitive individuals may experience symptoms.',
    'Unhealthy': 'Everyone may experience symptoms; sensitive groups more serious.',
    'Very Unhealthy': 'Health alert; everyone may experience serious effects.',
    'Hazardous': 'Health warning; emergency conditions for entire population.',
  };
  return recommendations[level];
};

export function AirQualityIndex() {
  const data = mockAirQuality;

  const pollutants = [
    { name: 'PM2.5', value: data.pm25, unit: 'μg/m³', max: 35 },
    { name: 'PM10', value: data.pm10, unit: 'μg/m³', max: 150 },
    { name: 'O₃', value: data.o3, unit: 'μg/m³', max: 120 },
    { name: 'NO₂', value: data.no2, unit: 'μg/m³', max: 100 },
    { name: 'SO₂', value: data.so2, unit: 'μg/m³', max: 20 },
    { name: 'CO', value: data.co, unit: 'mg/m³', max: 10 },
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        {getAQIIcon(data.aqi)}
        <h3 className="text-lg font-semibold">Air Quality Index</h3>
      </div>

      {/* Main AQI Display */}
      <div className={cn("p-4 rounded-lg border mb-4", getAQIBgColor(data.aqi))}>
        <div className="text-center">
          <div className={cn("text-3xl font-bold mb-1", getAQIColor(data.aqi))}>
            {data.aqi}
          </div>
          <Badge variant="secondary" className="mb-2">
            {data.level}
          </Badge>
          <div className="text-sm text-muted-foreground">
            {getHealthRecommendation(data.level)}
          </div>
        </div>
      </div>

      {/* AQI Scale */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Good</span>
          <span>Hazardous</span>
        </div>
        <div className="relative h-2 rounded-full overflow-hidden bg-gradient-to-r from-green-400 via-yellow-400 via-orange-400 via-red-400 via-purple-400 to-red-800">
          <div 
            className="absolute top-0 w-1 h-full bg-white border border-gray-400"
            style={{ left: `${Math.min((data.aqi / 300) * 100, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>0</span>
          <span>50</span>
          <span>100</span>
          <span>150</span>
          <span>200</span>
          <span>300</span>
        </div>
      </div>

      {/* Pollutant Details */}
      <div>
        <h4 className="text-sm font-medium mb-3">Pollutant Levels</h4>
        <div className="grid grid-cols-2 gap-3">
          {pollutants.map((pollutant) => (
            <div key={pollutant.name} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium">{pollutant.name}</span>
                <span className="text-muted-foreground">
                  {pollutant.value.toFixed(1)} {pollutant.unit}
                </span>
              </div>
              <Progress 
                value={(pollutant.value / pollutant.max) * 100} 
                className="h-1"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Health Tips */}
      {data.aqi > 100 && (
        <div className="mt-4 p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5" />
            <div className="text-sm">
              <div className="font-medium text-orange-800 dark:text-orange-200 mb-1">
                Health Recommendations
              </div>
              <ul className="text-orange-700 dark:text-orange-300 space-y-1 text-xs">
                <li>• Limit outdoor activities</li>
                <li>• Keep windows closed</li>
                <li>• Consider using air purifiers</li>
                <li>• Wear a mask if going outside</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}