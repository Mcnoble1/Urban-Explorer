import React, { useState } from 'react';
import { Map } from '../components/Map';
import { Sidebar } from '../components/Sidebar';
import { LocationDetails } from '../components/LocationDetails';
import { useLocationStore } from '../store/useLocationStore';

export const Explore: React.FC = () => {
  const { selectedCity } = useLocationStore();
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [mapCenter, setMapCenter] = useState(
    selectedCity?.coordinates || { lat: 40.7128, lng: -74.0060 } // Default to New York
  );

  const handleLocationSelect = (coordinates: { lat: number; lng: number }) => {
    setMapCenter(coordinates);
  };

  return (
    <div className="fixed inset-0 top-16 bg-gray-50">
      <div className="flex h-full">
        <Sidebar onLocationSelect={handleLocationSelect} />
        <div className="flex-1 relative">
          <Map center={mapCenter} />
          {selectedLocation && (
            <LocationDetails
              location={selectedLocation}
              onClose={() => setSelectedLocation(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
};