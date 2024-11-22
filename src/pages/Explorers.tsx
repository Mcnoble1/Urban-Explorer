import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader, Map as MapIcon } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Map } from '../components/Map';

interface Location {
  id: string;
  name: string;
  description: string;
  coordinates: { lat: number; lng: number };
  image?: string;
}

export const Explorers: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);


  const searchLocations = async () => {
    if (!searchQuery.trim()) return;
  
    setIsLoading(true);
    setError(null);
  
    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  
      const prompt = `Generate a list of locations matching the search: "${searchQuery}". 
        For each location, provide:
        1. The exact name of the place
        2. A brief one-sentence description
        Format as JSON array with properties: name, description`;
  
      const result = await model.generateContent(prompt);
      const response = await result.response;
  
      const text = await response.text();
      console.log(text);
  
      // Extract only the JSON array from the response
      const jsonArrayMatch = text.match(/\[.*?\]/s); // Matches the first JSON array
      if (!jsonArrayMatch) throw new Error("No JSON array found in the response.");
      const jsonStr = jsonArrayMatch[0];
  
      const locationsList = JSON.parse(jsonStr);
  
      const { PlacesService } = await google.maps.importLibrary("places") as any;
      const mapDiv = document.createElement('div');
      const map = new google.maps.Map(mapDiv);
      const service = new PlacesService(map);
  
      const locationsWithCoordinates = await Promise.all(
        locationsList.map(async (loc: any) => {
          return new Promise<Location>((resolve, reject) => {
            service.findPlaceFromQuery(
              {
                query: loc.name,
                fields: ['name', 'geometry', 'photos']
              },
              (results: any, status: any) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && results[0]) {
                  resolve({
                    id: crypto.randomUUID(),
                    name: loc.name,
                    description: loc.description,
                    coordinates: {
                      lat: results[0].geometry.location.lat(),
                      lng: results[0].geometry.location.lng()
                    },
                    image: results[0].photos?.[0]?.getUrl() || 
                      `https://source.unsplash.com/800x600/?${encodeURIComponent(loc.name)}`
                  });
                } else {
                  reject(new Error(`Could not find coordinates for ${loc.name}`));
                }
              }
            );
          }).catch(() => null);
        })
      );
  
      const validLocations = locationsWithCoordinates.filter((loc): loc is Location => loc !== null);
      
      if (validLocations.length === 0) {
        setError('No valid locations found. Please try a different search.');
      } else {
        setLocations(validLocations);
        setSelectedLocation(validLocations[0]);
      }
    } catch (err) {
      console.error('Error searching locations:', err);
      setError('An error occurred while searching for locations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 top-16 bg-gray-50">
      <div className="flex h-full flex-col">
        <div className="bg-white shadow-lg p-4">
          <div className="max-w-7xl mx-auto">
            <p className="mt-2 text-gray-600">
              Discover amazing places around the world using natural language search
            </p>

            <div className="mt-4">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && searchLocations()}
                    placeholder="Search for places (e.g., 'greatest monuments in Asia', 'hidden beaches in Greece')"
                    className="w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                </div>
                <button
                  onClick={searchLocations}
                  disabled={isLoading}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    'Search'
                  )}
                </button>
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-96 bg-white border-r border-gray-200 overflow-y-auto">
            <div className="divide-y divide-gray-200">
              {locations.map(location => (
                <button
                  key={location.id}
                  onClick={() => setSelectedLocation(location)}
                  className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                    selectedLocation?.id === location.id ? 'bg-indigo-50' : ''
                  }`}
                >
                  <div className="flex gap-4">
                    <img
                      src={location.image}
                      alt={location.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">{location.name}</h3>
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                        {location.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}

              {locations.length === 0 && !isLoading && (
                <div className="flex flex-col items-center justify-center p-8 text-gray-500">
                  <MapIcon className="w-8 h-8 mb-2" />
                  <p>Search for places to begin exploring</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 relative">
            {selectedLocation ? (
              <Map center={selectedLocation.coordinates} locationName={selectedLocation.name} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <MapIcon className="w-16 h-16 mb-4" />
                <p>Select a location to view in 3D</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};