import React, { useEffect, useRef, useState } from 'react';
import { Search, MapPin, Loader, Coffee, Building2, TreePine } from 'lucide-react';
import { CountrySelector } from './CountrySelector';
import { useLocationStore } from '../store/useLocationStore';
import { fetchPlacesForCity } from '../services/placesService';

interface SidebarProps {
  onLocationSelect: (coordinates: { lat: number; lng: number }) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onLocationSelect }) => {
  const { selectedCountry, selectedCity } = useLocationStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    const loadPlaces = async () => {
      if (selectedCity) {
        setLoading(true);
        try {
          const [attractions, cafes, museums, parks] = await Promise.all([
            fetchPlacesForCity(selectedCity.coordinates.lat, selectedCity.coordinates.lng, 'tourist_attraction'),
            fetchPlacesForCity(selectedCity.coordinates.lat, selectedCity.coordinates.lng, 'cafe'),
            fetchPlacesForCity(selectedCity.coordinates.lat, selectedCity.coordinates.lng, 'museum'),
            fetchPlacesForCity(selectedCity.coordinates.lat, selectedCity.coordinates.lng, 'park')
          ]);

          // Ensure unique IDs by adding category prefix
          const allLocations = [
            ...attractions.map(loc => ({ ...loc, id: `attraction-${loc.id}` })),
            ...cafes.map(loc => ({ ...loc, id: `cafe-${loc.id}` })),
            ...museums.map(loc => ({ ...loc, id: `museum-${loc.id}` })),
            ...parks.map(loc => ({ ...loc, id: `park-${loc.id}` }))
          ];
          
          setLocations(allLocations);
        } catch (error) {
          console.error('Error loading places:', error);
          setLocations([]);
        } finally {
          setLoading(false);
        }
      }
    };

    loadPlaces();
  }, [selectedCity]);

  useEffect(() => {
    let mounted = true;

    const initAutocomplete = async () => {
      if (!searchInputRef.current || !window.google) return;

      const autocomplete = new window.google.maps.places.Autocomplete(searchInputRef.current, {
        fields: ['geometry', 'name', 'place_id', 'formatted_address'],
        types: ['geocode', 'establishment']
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place?.geometry?.location) {
          onLocationSelect({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          });
        }
      });

      if (mounted) {
        autocompleteRef.current = autocomplete;
      }
    };

    // Wait for Google Maps API to load
    const checkGoogleMapsLoaded = setInterval(() => {
      if (window.google?.maps) {
        clearInterval(checkGoogleMapsLoaded);
        initAutocomplete();
      }
    }, 100);

    return () => {
      mounted = false;
      clearInterval(checkGoogleMapsLoaded);
    };
  }, [onLocationSelect]);

  const filteredLocations = locations.filter(location =>
    (searchQuery === '' || location.title.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (selectedCategory === null || location.category === selectedCategory)
  );

  const categories = [
    { id: 'cultural', label: 'Cultural', icon: Building2 },
    { id: 'cafe', label: 'Cafes', icon: Coffee },
    { id: 'scenic', label: 'Parks', icon: TreePine }
  ];

  return (
    <div className="w-96 h-full bg-white shadow-lg overflow-hidden flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-4">
          <MapPin className="w-6 h-6 text-indigo-600" />
          Urban Explorer
        </h1>
        
        <CountrySelector />

        <div className="mt-4 relative">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search hidden gems..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        </div>

        {selectedCity && (
          <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
            <p className="text-sm text-indigo-700">
              Exploring {selectedCity.name}
              {selectedCountry && `, ${selectedCountry}`}
            </p>
          </div>
        )}

        <div className="mt-4 flex gap-2">
          {categories.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSelectedCategory(selectedCategory === id ? null : id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm ${
                selectedCategory === id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader className="w-6 h-6 text-indigo-600 animate-spin" />
          </div>
        ) : filteredLocations.length > 0 ? (
          <div className="space-y-4">
            {filteredLocations.map(location => (
              <button
                key={location.id}
                onClick={() => onLocationSelect(location.coordinates)}
                className="w-full text-left p-4 bg-white hover:bg-gray-50 rounded-lg transition-colors border border-gray-100 hover:border-indigo-200"
              >
                <div className="flex gap-4">
                  <img
                    src={location.image}
                    alt={location.title}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">{location.title}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{location.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm font-medium text-indigo-600">
                        {location.points} points
                      </span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">
                        {location.rating.toFixed(1)} ★
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <MapPin className="w-8 h-8 mb-2" />
            <p>No locations found</p>
          </div>
        )}
      </div>
    </div>
  );
};