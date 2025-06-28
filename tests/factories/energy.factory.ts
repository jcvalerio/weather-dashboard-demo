import { EnergyData, EnergyDemand, EnergyPricing, RenewableEnergy } from '@/types/energy'

export const createMockEnergyData = (overrides?: Partial<EnergyData>): EnergyData => {
  const currentDemand = 45000 + Math.random() * 10000
  const peakDemand = currentDemand + Math.random() * 5000
  
  return {
    currentDemand,
    peakDemand,
    forecastDemand: createMockForecastDemand(),
    pricing: createMockEnergyPricing(),
    renewable: createMockRenewableEnergy(),
    lastUpdated: new Date().toISOString(),
    ...overrides,
  }
}

export const createMockForecastDemand = (): EnergyDemand[] => 
  Array.from({ length: 24 }, (_, i) => ({
    timestamp: new Date(Date.now() + i * 3600000).toISOString(),
    demand: 40000 + Math.random() * 20000,
    forecast: 42000 + Math.random() * 18000,
    unit: 'MW' as const,
  }))

export const createMockEnergyPricing = (): EnergyPricing[] =>
  Array.from({ length: 24 }, (_, i) => ({
    timestamp: new Date(Date.now() + i * 3600000).toISOString(),
    price: 50 + Math.random() * 100,
    currency: 'USD',
    unit: 'MWh' as const,
  }))

export const createMockRenewableEnergy = (): RenewableEnergy => {
  const solar = 5000 + Math.random() * 3000
  const wind = 3000 + Math.random() * 2000
  const hydro = 1000 + Math.random() * 500
  const total = solar + wind + hydro
  
  return {
    solar,
    wind,
    hydro,
    total,
    percentage: Math.round((total / 50000) * 100),
  }
}