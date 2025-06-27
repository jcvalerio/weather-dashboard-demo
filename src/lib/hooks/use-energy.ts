import { useQuery } from '@tanstack/react-query';
import type { EnergyData } from '@/types/energy';
import { CACHE_CONFIG, UPDATE_INTERVALS } from '@/lib/constants/config';

async function fetchEnergyData(): Promise<EnergyData> {
  const response = await fetch('/api/energy');
  
  if (!response.ok) {
    throw new Error('Failed to fetch energy data');
  }

  return response.json();
}

export function useEnergyData() {
  return useQuery({
    queryKey: ['energy'],
    queryFn: fetchEnergyData,
    staleTime: CACHE_CONFIG.energyTTL,
    refetchInterval: UPDATE_INTERVALS.energy,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}