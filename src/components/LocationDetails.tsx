import React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Share2, ThumbsUp, X, Info } from 'lucide-react';
import { useLocationStore, Location } from '../store/useLocationStore';

interface LocationDetailsProps {
  location: Location;
  onClose: () => void;
}

export const LocationDetails: React.FC<LocationDetailsProps> = ({ location, onClose }) => {
  const { visitLocation, interactWithLocation } = useLocationStore();
  const [showFunFact, setShowFunFact] = React.useState(false);

  const handleVisit = () => {
    visitLocation(location.id);
  };

  const handleInteract = () => {
    interactWithLocation(location.id);
  };

  // Fun facts based on location category
  const getFunFact = () => {
    switch (location.category) {
      case 'cultural':
        return "Did you know? Cultural sites often have hidden symbols and meanings in their architecture that tell stories about the local history!";
      case 'cafe':
        return "Fun fact: The world's first coffee house opened in Constantinople in 1475!";
      case 'scenic':
        return "Nature fact: Urban parks can be up to 4°C cooler than surrounding built-up areas, creating natural 'cooling islands'!";
      default:
        return "Every location has a unique story waiting to be discovered!";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-lg p-6 m-4"
    >
      <button
        onClick={onClose}
        className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full"
      >
        <X className="w-5 h-5 text-gray-500" />
      </button>

      <div className="flex items-start gap-4">
        <img
          src={location.image}
          alt={location.title}
          className="w-32 h-32 rounded-lg object-cover"
        />
        <div>
          <h2 className="text-xl font-bold text-gray-900">{location.title}</h2>
          <div className="flex items-center gap-2 mt-1">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm text-gray-600">{location.rating}</span>
          </div>
          <p className="mt-2 text-gray-600">{location.description}</p>
          
          <button
            onClick={() => setShowFunFact(!showFunFact)}
            className="mt-2 flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700"
          >
            <Info className="w-4 h-4" />
            {showFunFact ? 'Hide fun fact' : 'Show fun fact'}
          </button>
          
          {showFunFact && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-2 p-3 bg-indigo-50 rounded-lg text-sm text-indigo-700"
            >
              {getFunFact()}
            </motion.div>
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={handleVisit}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <MapPin className="w-4 h-4" />
          Mark as Visited
        </button>
        <button
          onClick={handleInteract}
          className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ThumbsUp className="w-4 h-4" />
        </button>
        <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {location.visited && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-3 bg-green-50 rounded-lg flex items-center gap-2"
        >
          <Star className="w-5 h-5 text-green-500" />
          <span className="text-sm text-green-700">
            You've visited this location! +{location.points} points earned
          </span>
        </motion.div>
      )}
    </motion.div>
  );
};