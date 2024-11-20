import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { Location } from '../types/location';

interface LocationTimelineProps {
  locations: Location[];
  currentIndex: number;
  onLocationSelect: (index: number) => void;
}

export const LocationTimeline: React.FC<LocationTimelineProps> = ({
  locations,
  currentIndex,
  onLocationSelect,
}) => {
  return (
    <div className="p-4">
      {locations.map((location, index) => (
        <motion.button
          key={location.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => onLocationSelect(index)}
          className={`w-full text-left mb-4 p-4 rounded-lg border transition-colors ${
            index === currentIndex
              ? 'border-indigo-500 bg-indigo-50'
              : 'border-gray-200 hover:border-indigo-200'
          }`}
        >
          <div className="flex gap-4">
            <img
              src={location.image}
              alt={location.title}
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div>
              <h3 className="font-medium text-gray-900">{location.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{location.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">
                  {new Date(location.visitDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
};