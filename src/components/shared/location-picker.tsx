'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { MapPin, Loader2, Search, Navigation } from 'lucide-react';
import { useGeolocation } from '@/lib/hooks/use-geolocation';
import { useLocationSearch } from '@/lib/hooks/use-weather';
import { useLocationStore } from '@/lib/store/location-store';
import { useDebounce } from '@/lib/hooks/use-debounce';

export function LocationPicker() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const debouncedQuery = useDebounce(searchQuery, 300);
  
  const { coordinates: geoCoords, getCurrentPosition, loading: geoLoading } = useGeolocation();
  const { coordinates, setLocation, locationName } = useLocationStore();
  const locationSearch = useLocationSearch();

  // Trigger search when debounced query changes
  useEffect(() => {
    if (debouncedQuery && debouncedQuery.length >= 2) {
      locationSearch.mutate(debouncedQuery);
      setShowResults(true);
    } else {
      setShowResults(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]); // locationSearch intentionally excluded to prevent infinite loop

  // Set location from geolocation
  useEffect(() => {
    if (geoCoords && !coordinates) {
      setLocation(geoCoords, 'Current Location');
    }
  }, [geoCoords, coordinates, setLocation]);

  const handleLocationSelect = (location: { name: string; country: string; lat: number; lon: number }) => {
    setLocation(
      { lat: location.lat, lon: location.lon },
      `${location.name}, ${location.country}`
    );
    setSearchQuery('');
    setShowResults(false);
  };

  const handleUseCurrentLocation = () => {
    getCurrentPosition();
  };

  return (
    <div className="relative">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for a location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Button
          variant="outline"
          onClick={handleUseCurrentLocation}
          disabled={geoLoading}
          className="shrink-0"
        >
          {geoLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Navigation className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Current Location Display */}
      {coordinates && locationName && (
        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{locationName}</span>
        </div>
      )}

      {/* Search Results */}
      {showResults && (
        <Card className="absolute top-full left-0 right-0 mt-1 p-2 z-50 shadow-lg">
          {locationSearch.isPending && (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              <span className="text-sm">Searching...</span>
            </div>
          )}
          
          {locationSearch.data && locationSearch.data.length > 0 && (
            <div className="space-y-1">
              {locationSearch.data.map((location, index) => (
                <button
                  key={index}
                  onClick={() => handleLocationSelect(location)}
                  className="w-full text-left p-2 rounded hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {location.name}, {location.country}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
          
          {locationSearch.data && locationSearch.data.length === 0 && !locationSearch.isPending && (
            <div className="text-center p-4 text-sm text-muted-foreground">
              No locations found
            </div>
          )}
          
          {locationSearch.error && (
            <div className="text-center p-4 text-sm text-destructive">
              Failed to search locations
            </div>
          )}
        </Card>
      )}
    </div>
  );
}