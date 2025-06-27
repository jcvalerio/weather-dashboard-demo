import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { WeatherData, Coordinates } from '@/types/weather';
import { CACHE_CONFIG, UPDATE_INTERVALS } from '@/lib/constants/config';

interface LocationSearchResult {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

async function fetchWeatherData(coordinates: Coordinates): Promise<WeatherData> {
  const params = new URLSearchParams({
    lat: coordinates.lat.toString(),
    lon: coordinates.lon.toString(),
  });

  const response = await fetch(`/api/weather?${params}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }

  return response.json();
}

async function searchLocations(query: string): Promise<LocationSearchResult[]> {
  if (query.length < 2) return [];

  const params = new URLSearchParams({ q: query });
  const response = await fetch(`/api/weather/search?${params}`);
  
  if (!response.ok) {
    throw new Error('Failed to search locations');
  }

  return response.json();
}

export function useWeather(coordinates: Coordinates | null) {
  return useQuery({
    queryKey: ['weather', coordinates],
    queryFn: () => {
      if (!coordinates) throw new Error('Coordinates are required');
      return fetchWeatherData(coordinates);
    },
    enabled: !!coordinates,
    staleTime: CACHE_CONFIG.weatherTTL,
    refetchInterval: UPDATE_INTERVALS.weather,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useLocationSearch() {
  return useMutation({
    mutationFn: searchLocations,
    retry: 1,
  });
}

export function useRefreshWeather() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (coordinates: Coordinates) => {
      await queryClient.invalidateQueries({
        queryKey: ['weather', coordinates],
      });
      return fetchWeatherData(coordinates);
    },
  });
}

// Hook for managing current location
export function useCurrentLocation(coordinates: Coordinates | null) {
  const queryClient = useQueryClient();

  const setLocation = () => {
    // Invalidate all weather queries to force refresh with new location
    queryClient.invalidateQueries({
      queryKey: ['weather'],
    });
  };

  return {
    coordinates,
    setLocation,
  };
}