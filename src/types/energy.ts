export interface EnergyDemand {
  timestamp: string;
  demand: number;
  forecast: number;
  unit: 'MW' | 'GW';
}

export interface EnergyPricing {
  timestamp: string;
  price: number;
  currency: string;
  unit: 'MWh' | 'kWh';
}

export interface RenewableEnergy {
  solar: number;
  wind: number;
  hydro: number;
  total: number;
  percentage: number;
}

export interface EnergyData {
  currentDemand: number;
  peakDemand: number;
  forecastDemand: EnergyDemand[];
  pricing: EnergyPricing[];
  renewable: RenewableEnergy;
  lastUpdated: string;
}