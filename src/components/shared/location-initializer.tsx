'use client';

import { useEffect } from 'react';
import { useLocationStore } from '@/lib/store/location-store';
import { useGeolocation } from '@/lib/hooks/use-geolocation';

export function LocationInitializer() {
  const { coordinates, setLocation } = useLocationStore();
  const { coordinates: geoCoords, getCurrentPosition } = useGeolocation();

  useEffect(() => {
    // Always set a default location immediately to prevent empty state
    if (!coordinates) {
      console.log('Setting default location: San Francisco');
      setLocation(
        { lat: 37.7749, lon: -122.4194 },
        'San Francisco, US'
      );
    }
  }, [coordinates, setLocation]);

  useEffect(() => {
    // If geolocation is available, update to user's location
    if (geoCoords && coordinates) {
      console.log('Updating to user location:', geoCoords);
      setLocation(geoCoords, 'Current Location');
    }
  }, [geoCoords, coordinates, setLocation]);

  // Trigger geolocation request on mount
  useEffect(() => {
    if (!coordinates && !geoCoords) {
      getCurrentPosition();
    }
  }, [coordinates, geoCoords, getCurrentPosition]);

  return null; // This component doesn't render anything
}