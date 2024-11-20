import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, MapPin, Save, X } from 'lucide-react';
import { Tour, TourStop } from '../types/tours';

interface TourCreatorProps {
  onSave: (tour: Omit<Tour, 'id' | 'coverImage'>) => void;
  onClose: () => void;
}

export const TourCreator: React.FC<TourCreatorProps> = ({ onSave, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [stops, setStops] = useState<TourStop[]>([]);
  const [searchResults, setSearchResults] = useState<TourStop[]>([]);
  const modalContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (modalContentRef.current && stops.length > 0) {
      modalContentRef.current.scrollTo({
        top: modalContentRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [stops.length]);

  const searchPlaces = async () => {
    if (!searchQuery.trim() || !window.google) return;

    const service = new window.google.maps.places.PlacesService(
      new window.google.maps.Map(document.createElement('div'))
    );

    return new Promise((resolve) => {
      service.textSearch(
        { query: searchQuery },
        (results: google.maps.places.PlaceResult[] | null, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            const locations = results.slice(0, 5).map(place => ({
              id: place.place_id!,
              title: place.name!,
              description: place.formatted_address || '',
              coordinates: {
                lat: place.geometry!.location!.lat(),
                lng: place.geometry!.location!.lng()
              },
              image: place.photos?.[0]?.getUrl() || 
                `https://source.unsplash.com/800x600/?${encodeURIComponent(place.name!)}`,
              duration: 10
            }));
            setSearchResults(locations);
          }
        }
      );
    });
  };

  const addStop = (location: TourStop) => {
    setStops([...stops, location]);
    setSearchResults([]);
    setSearchQuery('');
  };

  const removeStop = (index: number) => {
    setStops(stops.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!title || stops.length === 0) return;
    onSave({ title, description, stops });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
      >
        <div className="p-6 border-b flex-shrink-0">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Create New Tour</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div 
          ref={modalContentRef}
          className="flex-1 overflow-y-auto p-6 space-y-4"
        >
          <input
            type="text"
            placeholder="Tour Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />

          <textarea
            placeholder="Tour Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg h-24 resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />

          <div className="relative">
            <input
              type="text"
              placeholder="Search for places to add..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchPlaces()}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>

          {searchResults.length > 0 && (
            <div className="border rounded-lg divide-y">
              {searchResults.map(result => (
                <button
                  key={result.id}
                  onClick={() => addStop(result)}
                  className="w-full p-3 text-left hover:bg-gray-50 flex items-center gap-3"
                >
                  <Plus className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="font-medium">{result.title}</div>
                    <div className="text-sm text-gray-500">{result.description}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="pt-4">
            <h3 className="font-medium mb-4">Tour Stops ({stops.length})</h3>
            {stops.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <MapPin className="w-8 h-8 mx-auto mb-2" />
                <p>Search and add places to create your tour</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stops.map((stop, index) => (
                  <motion.div
                    key={stop.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 p-3 border rounded-lg hover:border-indigo-200 transition-colors"
                  >
                    <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{stop.title}</div>
                      <div className="text-sm text-gray-500">{stop.description}</div>
                    </div>
                    <button
                      onClick={() => removeStop(index)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t bg-gray-50 flex-shrink-0">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {stops.length === 0 ? (
                'Add at least one stop to create a tour'
              ) : (
                `${stops.length} stop${stops.length === 1 ? '' : 's'} added`
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!title || stops.length === 0}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
              >
                <Save className="w-4 h-4" />
                Create Tour
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};