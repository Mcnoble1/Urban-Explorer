import React from 'react';
import { MapPin, Navigation, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface YearlyStatsProps {
  totalPlaces: number;
  totalDistance: number;
  mostVisited: string;
}

export const YearlyStats: React.FC<YearlyStatsProps> = ({
  totalPlaces,
  totalDistance,
  mostVisited,
}) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-indigo-50 p-4 rounded-lg"
      >
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-4 h-4 text-indigo-600" />
          <span className="text-sm font-medium text-indigo-600">Places</span>
        </div>
        <p className="text-2xl font-bold text-gray-900">{totalPlaces}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-indigo-50 p-4 rounded-lg"
      >
        <div className="flex items-center gap-2 mb-2">
          <Navigation className="w-4 h-4 text-indigo-600" />
          <span className="text-sm font-medium text-indigo-600">Miles</span>
        </div>
        <p className="text-2xl font-bold text-gray-900">
          {Math.round(totalDistance)}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-indigo-50 p-4 rounded-lg"
      >
        <div className="flex items-center gap-2 mb-2">
          <Star className="w-4 h-4 text-indigo-600" />
          <span className="text-sm font-medium text-indigo-600">Top Place</span>
        </div>
        <p className="text-lg font-bold text-gray-900 truncate">
          {mostVisited}
        </p>
      </motion.div>
    </div>
  );
};