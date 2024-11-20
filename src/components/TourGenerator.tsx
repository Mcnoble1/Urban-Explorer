import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader, Wand2, X } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Tour, TourStop } from '../types/tours';

interface TourGeneratorProps {
  onSave: (tour: Omit<Tour, 'id' | 'coverImage'>) => void;
  onClose: () => void;
}

export const TourGenerator: React.FC<TourGeneratorProps> = ({ onSave, onClose }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const findPlace = async (placeName: string, description: string): Promise<TourStop | null> => {
    return new Promise((resolve) => {
      const service = new google.maps.places.PlacesService(
        new google.maps.Map(document.createElement('div'))
      );

      // First try with exact name
      service.findPlaceFromQuery(
        {
          query: placeName,
          fields: ['name', 'formatted_address', 'geometry', 'photos', 'place_id']
        },
        (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results?.[0]) {
            const place = results[0];
            resolve({
              id: place.place_id!,
              title: place.name!,
              description: description,
              coordinates: {
                lat: place.geometry!.location!.lat(),
                lng: place.geometry!.location!.lng()
              },
              image: place.photos?.[0]?.getUrl() || 
                `https://source.unsplash.com/800x600/?${encodeURIComponent(place.name!)}`,
              duration: 10
            });
          } else {
            // If exact name fails, try with a simplified search
            const simplifiedName = placeName.split(/[&(]/)[0].trim(); // Remove anything after & or (
            service.findPlaceFromQuery(
              {
                query: simplifiedName,
                fields: ['name', 'formatted_address', 'geometry', 'photos', 'place_id']
              },
              (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && results?.[0]) {
                  const place = results[0];
                  resolve({
                    id: place.place_id!,
                    title: place.name!,
                    description: description,
                    coordinates: {
                      lat: place.geometry!.location!.lat(),
                      lng: place.geometry!.location!.lng()
                    },
                    image: place.photos?.[0]?.getUrl() || 
                      `https://source.unsplash.com/800x600/?${encodeURIComponent(place.name!)}`,
                    duration: 10
                  });
                } else {
                  resolve(null);
                }
              }
            );
          }
        }
      );
    });
  };

  const generateTour = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setError(null);

    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const promptText = `Generate a tour based on: "${prompt}"
        Format the response as JSON with:
        - title: A catchy title for the tour
        - description: A brief tour description
        - locations: Array of 5-7 must-visit places, each with:
          - name: Place name (keep it simple and searchable)
          - description: Brief description
        Example format:
        {
          "title": "Historic Rome Adventure",
          "description": "Journey through ancient Rome's most iconic sites",
          "locations": [
            {
              "name": "Colosseum",
              "description": "Ancient amphitheater and icon of Rome"
            }
          ]
        }`;

      const result = await model.generateContent(promptText);
      const response = await result.response;
      const text = response.text();
      const jsonStr = text.replace(/```json\n?|\n?```/gi, '').trim();
      
      const tourPlan = JSON.parse(jsonStr);

      const locationPromises = tourPlan.locations.map((loc: any) => 
        findPlace(loc.name, loc.description)
      );

      const stops = await Promise.all(locationPromises);
      const validStops = stops.filter((stop): stop is TourStop => stop !== null);
      
      if (validStops.length === 0) {
        throw new Error('No valid locations found for the tour');
      }

      if (validStops.length < stops.length) {
        const foundCount = validStops.length;
        const totalCount = stops.length;
        setError(`Note: Only ${foundCount} out of ${totalCount} locations could be found. Creating tour with available locations.`);
      }

      onSave({
        title: tourPlan.title,
        description: tourPlan.description,
        stops: validStops
      });

      if (validStops.length < stops.length) {
        setTimeout(onClose, 2000);
      } else {
        onClose();
      }
    } catch (err) {
      console.error('Error generating tour:', err);
      setError('Failed to generate tour. Please try again with a different prompt.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-xl"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">AI Tour Generator</h2>
              <p className="text-gray-600 mt-1">
                Describe where you want to explore and let AI create a tour for you
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Example: Create a tour of historic landmarks in Rome, or Show me the best hidden gems in Tokyo..."
              className="w-full h-32 px-4 py-3 border rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />

            {error && (
              <div className={`p-3 rounded-lg text-sm ${
                error.startsWith('Note:') 
                  ? 'bg-blue-50 text-blue-700'
                  : 'bg-red-50 text-red-700'
              }`}>
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={generateTour}
                disabled={!prompt.trim() || isGenerating}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
              >
                {isGenerating ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Generating Tour...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    Generate Tour
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};