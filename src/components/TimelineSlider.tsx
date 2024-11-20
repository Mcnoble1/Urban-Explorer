import React from 'react';
import { motion } from 'framer-motion';

interface TimelineSliderProps {
  value: number;
  max: number;
  onChange: (value: number) => void;
}

export const TimelineSlider: React.FC<TimelineSliderProps> = ({
  value,
  max,
  onChange,
}) => {
  const percentage = (value / max) * 100;

  return (
    <div className="relative w-full h-2 bg-gray-200 rounded-full">
      <motion.div
        className="absolute left-0 top-0 h-full bg-indigo-600 rounded-full"
        style={{ width: `${percentage}%` }}
        initial={false}
        animate={{ width: `${percentage}%` }}
      />
      <input
        type="range"
        min={0}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
    </div>
  );
};