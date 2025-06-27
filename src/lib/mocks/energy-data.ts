import type { EnergyData } from '@/types/energy';
import { addHours, subHours } from 'date-fns';

const now = new Date();

export const mockEnergyData: EnergyData = {
  currentDemand: 4250,
  peakDemand: 5100,
  forecastDemand: Array.from({ length: 24 }, (_, i) => ({
    timestamp: addHours(now, i - 12).toISOString(),
    demand: 4000 + Math.sin(i / 4) * 800 + Math.random() * 200,
    forecast: 4100 + Math.sin(i / 4) * 700 + Math.random() * 150,
    unit: 'MW' as const,
  })),
  pricing: Array.from({ length: 24 }, (_, i) => ({
    timestamp: addHours(now, i - 12).toISOString(),
    price: 35 + Math.sin(i / 3) * 15 + Math.random() * 5,
    currency: 'USD',
    unit: 'MWh' as const,
  })),
  renewable: {
    solar: 1250,
    wind: 890,
    hydro: 450,
    total: 2590,
    percentage: 61,
  },
  lastUpdated: now.toISOString(),
};

export const mockHistoricalEnergy = Array.from({ length: 30 }, (_, i) => ({
  date: subHours(now, (30 - i) * 24).toISOString(),
  avgDemand: 4200 + Math.random() * 600,
  peakDemand: 4800 + Math.random() * 800,
  renewable: 55 + Math.random() * 15,
}));