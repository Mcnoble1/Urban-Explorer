import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react';
import { Map } from './Map';
import { Tour } from '../types/tours';

interface TourViewerProps {
  tour: Tour;
  onClose: () => void;
}

export const TourViewer: React.FC<TourViewerProps> = ({ tour, onClose }) => {
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const mapRef = useRef<any>(null);
  const transitionTimeoutRef = useRef<NodeJS.Timeout>();

  const currentStop = tour.stops[currentStopIndex];

  useEffect(() => {
    if (isPlaying && mapRef.current) {
      const stop = tour.stops[currentStopIndex];
      const nextStop = tour.stops[currentStopIndex + 1];
      
      if (nextStop) {
        // First, smoothly fly to the current location
        mapRef.current.setAttribute('center', `${stop.coordinates.lat},${stop.coordinates.lng},300`);
        mapRef.current.setAttribute('tilt', '45');
        mapRef.current.setAttribute('heading', '0');

        // Then, after a delay, start orbiting
        const orbitInterval = setInterval(() => {
          const currentHeading = parseFloat(mapRef.current.getAttribute('heading')) || 0;
          mapRef.current.setAttribute('heading', ((currentHeading + 1) % 360).toString());
        }, 100);

        // After the duration, move to the next location
        transitionTimeoutRef.current = setTimeout(() => {
          clearInterval(orbitInterval);
          setCurrentStopIndex(currentStopIndex + 1);
        }, (stop.duration || 10) * 1000);

        return () => {
          clearInterval(orbitInterval);
          if (transitionTimeoutRef.current) {
            clearTimeout(transitionTimeoutRef.current);
          }
        };
      } else {
        setIsPlaying(false);
        setCurrentStopIndex(0);
      }
    }
  }, [tour, currentStopIndex, isPlaying]);

  useEffect(() => {
    if (currentStop && mapRef.current) {
      // Smoothly fly to the new location
      mapRef.current.setAttribute('center', `${currentStop.coordinates.lat},${currentStop.coordinates.lng},300`);
      mapRef.current.setAttribute('tilt', '45');
      mapRef.current.setAttribute('heading', '0');
    }
  }, [currentStop]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }
  };

  const handleNext = () => {
    if (currentStopIndex < tour.stops.length - 1) {
      setCurrentStopIndex(currentStopIndex + 1);
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStopIndex > 0) {
      setCurrentStopIndex(currentStopIndex - 1);
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    }
  };

  return (
    <div className="h-full flex">
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">{tour.title}</h2>
            <button
              onClick={onClose}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Back to Tours
            </button>
          </div>
          <p className="text-gray-600">{tour.description}</p>

          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={handlePrevious}
              disabled={currentStopIndex === 0}
              className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
            >
              <SkipBack className="w-6 h-6" />
            </button>
            <button
              onClick={handlePlayPause}
              className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>
            <button
              onClick={handleNext}
              disabled={currentStopIndex === tour.stops.length - 1}
              className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
            >
              <SkipForward className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {tour.stops.map((stop, index) => (
              <button
                key={stop.id}
                onClick={() => setCurrentStopIndex(index)}
                className={`w-full text-left p-4 rounded-lg border transition-colors ${
                  index === currentStopIndex
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-200'
                }`}
              >
                <div className="flex gap-4">
                  <img
                    src={stop.image}
                    alt={stop.title}
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                        {index + 1}
                      </div>
                      <h3 className="font-medium">{stop.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{stop.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 relative">
        <Map
          center={currentStop.coordinates}
          onMapLoad={(map) => { mapRef.current = map; }}
          locationName={currentStop.title}
        />
      </div>
    </div>
  );
};