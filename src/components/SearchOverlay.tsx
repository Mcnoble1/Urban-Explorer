import React, { useEffect, useRef } from 'react';
import { Search } from 'lucide-react';

interface SearchOverlayProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult) => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ onPlaceSelect }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    const initAutocomplete = async () => {
      if (!inputRef.current) return;

      const { Autocomplete } = await google.maps.importLibrary("places") as any;
      
      autocompleteRef.current = new Autocomplete(inputRef.current, {
        fields: ['geometry', 'name', 'place_id', 'formatted_address'],
        types: ['geocode', 'establishment']
      });

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace();
        if (place && place.geometry) {
          onPlaceSelect(place);
        }
      });
    };

    initAutocomplete();
  }, [onPlaceSelect]);

  return (
    <div className="absolute top-4 left-4 z-50 bg-white rounded-lg shadow-lg">
      <div className="p-3 bg-indigo-600 text-white text-sm font-medium rounded-t-lg">
        Search Location
      </div>
      <div className="p-3">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            placeholder="Enter a location..."
            className="w-[400px] pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        </div>
      </div>
    </div>
  );
};