import React from 'react';
import { motion } from 'framer-motion';
import { Gem } from 'lucide-react';

interface GemOverlayProps {
  position: { x: number; y: number };
  onClick: () => void;
}

export const GemOverlay: React.FC<GemOverlayProps> = ({ position, onClick }) => {
  return (
    <div className="absolute pointer-events-auto" style={{ 
      left: position.x, 
      top: position.y,
      transform: 'translate(-50%, -50%)'
    }}>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        onClick={onClick}
        className="p-2 bg-white rounded-full shadow-lg cursor-pointer hover:bg-indigo-50 transition-colors"
      >
        <Gem className="w-6 h-6 text-indigo-600 animate-pulse" />
      </motion.button>
    </div>
  );
};