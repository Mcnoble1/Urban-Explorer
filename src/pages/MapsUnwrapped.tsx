import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Map, Share2, Play, Pause, Calendar, Navigation } from 'lucide-react';
import { Map3D } from '../components/Map3D';
import { TimelineSlider } from '../components/TimelineSlider';
import { YearlyStats } from '../components/YearlyStats';
import { LocationTimeline } from '../components/LocationTimeline';
import { useLocationStore } from '../store/useLocationStore';
import { calculateDistance } from '../utils/distance';

export const MapsUnwrapped: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const mapRef = useRef<any>(null);
  const { visitedLocations, getLocationsByYear } = useLocationStore();
  
  const locations = getLocationsByYear(2024);
  const totalDistance = locations.reduce((acc, loc, i) => {
    if (i === 0) return 0;
    return acc + calculateDistance(
      locations[i - 1].coordinates,
      loc.coordinates
    );
  }, 0);

  useEffect(() => {
    if (isPlaying && mapRef.current) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev === locations.length - 1) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isPlaying, locations.length]);

  useEffect(() => {
    if (mapRef.current && locations[currentIndex]) {
      const location = locations[currentIndex];
      mapRef.current.setAttribute('center', `${location.coordinates.lat},${location.coordinates.lng},300`);
      mapRef.current.setAttribute('tilt', '45');
      mapRef.current.setAttribute('heading', '0');
    }
  }, [currentIndex, locations]);

  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'My 2024 Travel Unwrapped',
        text: `I visited ${locations.length} places in 2024!`,
        url: window.location.href
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <div className="fixed inset-0 top-16 bg-gray-50">
      <div className="h-full flex">
        {/* Left Panel */}
        <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Map className="w-6 h-6 text-indigo-600" />
                2024 Unwrapped
              </h1>
              <button
                onClick={handleShare}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            <YearlyStats
              totalPlaces={locations.length}
              totalDistance={totalDistance}
              mostVisited={locations[0]?.title || 'N/A'}
            />
          </div>

          <div className="flex-1 overflow-y-auto">
            <LocationTimeline
              locations={locations}
              currentIndex={currentIndex}
              onLocationSelect={setCurrentIndex}
            />
          </div>

          <div className="p-4 border-t bg-gray-50">
            <TimelineSlider
              value={currentIndex}
              max={locations.length - 1}
              onChange={setCurrentIndex}
            />
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Play Journey
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <Map3D
            ref={mapRef}
            locations={locations}
            currentIndex={currentIndex}
          />
        </div>
      </div>
    </div>
  );
};