import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Coordinates } from '@/types/weather';

interface LocationState {
  coordinates: Coordinates | null;
  locationName: string | null;
  setLocation: (coordinates: Coordinates, name?: string) => void;
  clearLocation: () => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      coordinates: null,
      locationName: null,
      setLocation: (coordinates, name) =>
        set({
          coordinates,
          locationName: name || null,
        }),
      clearLocation: () =>
        set({
          coordinates: null,
          locationName: null,
        }),
    }),
    {
      name: 'weather-location',
      storage: createJSONStorage(() => localStorage),
      // Only persist coordinates and locationName
      partialize: (state) => ({
        coordinates: state.coordinates,
        locationName: state.locationName,
      }),
    }
  )
);