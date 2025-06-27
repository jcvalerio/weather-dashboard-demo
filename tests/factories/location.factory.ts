import { Location, Coordinates } from '@/types/weather'

// Extend Location for search results
export interface LocationSearchResult extends Location {
  id: string;
  region: string;
  display_name: string;
}

export const createMockLocation = (overrides?: Partial<LocationSearchResult>): LocationSearchResult => ({
  id: 'san-francisco-ca-us',
  city: 'San Francisco',
  country: 'United States',
  coordinates: {
    lat: 37.7749,
    lon: -122.4194,
  },
  region: 'California',
  display_name: 'San Francisco, California, United States',
  ...overrides,
})

export const createMockLocationSearchResults = (): LocationSearchResult[] => [
  createMockLocation(),
  createMockLocation({
    id: 'new-york-ny-us',
    city: 'New York',
    country: 'United States',
    coordinates: {
      lat: 40.7128,
      lon: -74.0060,
    },
    region: 'New York',
    display_name: 'New York, New York, United States',
  }),
  createMockLocation({
    id: 'london-gb',
    city: 'London',
    country: 'United Kingdom',
    coordinates: {
      lat: 51.5074,
      lon: -0.1278,
    },
    region: 'England',
    display_name: 'London, England, United Kingdom',
  }),
  createMockLocation({
    id: 'tokyo-jp',
    city: 'Tokyo',
    country: 'Japan',
    coordinates: {
      lat: 35.6762,
      lon: 139.6503,
    },
    region: 'Tokyo',
    display_name: 'Tokyo, Tokyo, Japan',
  }),
]