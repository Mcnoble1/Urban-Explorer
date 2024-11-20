import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Wand2, Map as MapIcon } from 'lucide-react';
import { TourCreator } from '../components/TourCreator';
import { TourGenerator } from '../components/TourGenerator';
import { TourViewer } from '../components/TourViewer';
import { Tour } from '../types/tours';

export const Tours: React.FC = () => {
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [showTourCreator, setShowTourCreator] = useState(false);
  const [showTourGenerator, setShowTourGenerator] = useState(false);
  const [tours, setTours] = useState<Tour[]>([]);

  const handleSaveTour = (tour: Omit<Tour, 'id' | 'coverImage'>) => {
    const newTour: Tour = {
      ...tour,
      id: crypto.randomUUID(),
      coverImage: tour.stops[0]?.image || 'https://images.unsplash.com/photo-1486078695445-0497c2f58cfe?w=800&q=80',
    };
    setTours([...tours, newTour]);
  };

  return (
    <div className="fixed inset-0 top-16 bg-gray-50">
      {!selectedTour ? (
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Virtual Tours</h1>
              <p className="mt-2 text-gray-600">Experience curated journeys through amazing places</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowTourGenerator(true)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Wand2 className="w-4 h-4" />
                AI Generate Tour
              </button>
              <button
                onClick={() => setShowTourCreator(true)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create Tour
              </button>
            </div>
          </div>

          {tours.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tours.map((tour) => (
                <motion.div
                  key={tour.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer"
                  onClick={() => setSelectedTour(tour)}
                >
                  <div className="relative h-48">
                    <img
                      src={tour.coverImage}
                      alt={tour.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white">{tour.title}</h3>
                      <p className="mt-1 text-sm text-white/90">{tour.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500">
              <MapIcon className="w-16 h-16 mb-4" />
              <h2 className="text-xl font-medium mb-2">No tours created yet</h2>
              <p className="text-sm mb-6">Create your first tour or let AI generate one for you</p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowTourGenerator(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                >
                  <Wand2 className="w-4 h-4" />
                  Generate with AI
                </button>
                <button
                  onClick={() => setShowTourCreator(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Create Manually
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <TourViewer
          tour={selectedTour}
          onClose={() => setSelectedTour(null)}
        />
      )}

      {showTourCreator && (
        <TourCreator
          onSave={handleSaveTour}
          onClose={() => setShowTourCreator(false)}
        />
      )}

      {showTourGenerator && (
        <TourGenerator
          onSave={handleSaveTour}
          onClose={() => setShowTourGenerator(false)}
        />
      )}
    </div>
  );
};