import React from 'react';
import { Star, Navigation2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface LocationCardProps {
  title: string;
  description: string;
  rating: number;
  image: string;
  distance: string;
  onClick: () => void;
}

export const LocationCard: React.FC<LocationCardProps> = ({
  title,
  description,
  rating,
  image,
  distance,
  onClick
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <div className="relative h-48">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-sm font-medium">{rating}</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-600 line-clamp-2">{description}</p>
        <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
          <Navigation2 className="w-4 h-4" />
          <span>{distance} away</span>
        </div>
      </div>
    </motion.div>
  );
};