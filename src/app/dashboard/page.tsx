import { Suspense } from 'react';
import { CurrentWeatherCard } from '@/components/weather/current-weather-card';
import { WeatherForecastCard } from '@/components/weather/weather-forecast-card';
import { EnergyDemandChart } from '@/components/charts/energy-demand-chart';
import { WeatherAlertsCard } from '@/components/weather/weather-alerts-card';
import { PrecipitationChart } from '@/components/charts/precipitation-chart';
import { WindPatternsChart } from '@/components/charts/wind-patterns-chart';
import { AirQualityIndex } from '@/components/charts/air-quality-index';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  return (
    <div className="grid gap-6">
      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Weather - Takes 1 column */}
        <div className="lg:col-span-1">
          <Suspense fallback={<Skeleton className="h-96 w-full" />}>
            <CurrentWeatherCard />
          </Suspense>
        </div>

        {/* 24-Hour Forecast - Takes 2 columns */}
        <div className="lg:col-span-2">
          <Suspense fallback={<Skeleton className="h-96 w-full" />}>
            <WeatherForecastCard />
          </Suspense>
        </div>
      </div>

      {/* Secondary Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Energy Demand Chart */}
        <Suspense fallback={<Skeleton className="h-80 w-full" />}>
          <EnergyDemandChart />
        </Suspense>

        {/* Weather Alerts */}
        <Suspense fallback={<Skeleton className="h-80 w-full" />}>
          <WeatherAlertsCard />
        </Suspense>
      </div>

      {/* Additional Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <Suspense fallback={<Skeleton className="h-64 w-full" />}>
          <WindPatternsChart />
        </Suspense>

        <Suspense fallback={<Skeleton className="h-64 w-full" />}>
          <PrecipitationChart />
        </Suspense>

        <Suspense fallback={<Skeleton className="h-64 w-full" />}>
          <AirQualityIndex />
        </Suspense>
      </div>
    </div>
  );
}