import React from 'react';
import { motion } from 'framer-motion';
import { Info, X } from 'lucide-react';

interface LocationOverlayProps {
  title: string;
  funFact: string;
  onClose: () => void;
}

export const LocationOverlay: React.FC<LocationOverlayProps> = ({
  title,
  funFact,
  onClose,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="absolute top-4 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-lg p-4 max-w-md z-50 pointer-events-auto"
    >
      <button
        onClick={onClose}
        className="absolute right-2 top-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
      >
        <X className="w-4 h-4 text-gray-500" />
      </button>
      <div className="flex items-start gap-3 pr-6">
        <Info className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-medium text-gray-900">{title}</h3>
          <p className="mt-1 text-sm text-gray-600">{funFact}</p>
        </div>
      </div>
    </motion.div>
  );
};