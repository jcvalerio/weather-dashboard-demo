import type { EnergyData } from '@/types/energy';
import { mockEnergyData } from '@/lib/mocks/energy-data';

class EnergyService {
  async getEnergyData(): Promise<EnergyData> {
    try {
      // In a real implementation, this would call an actual energy API
      // For now, we'll simulate an API call with mock data
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      
      // Add some randomization to make the data feel more "live"
      const data = { ...mockEnergyData };
      
      // Randomize current demand slightly
      data.currentDemand = data.currentDemand + (Math.random() - 0.5) * 200;
      
      // Update renewable percentage slightly
      data.renewable.percentage = Math.max(45, Math.min(75, data.renewable.percentage + (Math.random() - 0.5) * 10));
      
      // Update last updated timestamp
      data.lastUpdated = new Date().toISOString();
      
      return data;
    } catch (error) {
      console.error('Energy API error:', error);
      return mockEnergyData;
    }
  }

  async getHistoricalEnergyData(days: number = 30): Promise<Array<{
    date: string;
    avgDemand: number;
    peakDemand: number;
    renewable: number;
  }>> {
    try {
      // Simulate historical data API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const historicalData = Array.from({ length: days }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (days - i));
        
        return {
          date: date.toISOString(),
          avgDemand: 4200 + Math.sin(i / 7) * 400 + Math.random() * 300,
          peakDemand: 4800 + Math.sin(i / 7) * 500 + Math.random() * 400,
          renewable: 55 + Math.sin(i / 5) * 10 + Math.random() * 15,
        };
      });
      
      return historicalData;
    } catch (error) {
      console.error('Historical energy data error:', error);
      return [];
    }
  }
}

export const energyService = new EnergyService();