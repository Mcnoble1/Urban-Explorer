import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Map, Compass, Award } from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Discover Your City's Hidden Gems
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Explore unique locations, earn rewards, and become the ultimate urban explorer
        </p>
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 px-6 py-3 text-lg font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Compass className="w-5 h-5" />
          Start Exploring
        </Link>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <feature.icon className="w-12 h-12 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const features = [
  {
    icon: Map,
    title: "3D City Exploration",
    description: "Experience your city in stunning 3D with our interactive map powered by Google's latest technology."
  },
  {
    icon: Compass,
    title: "Hidden Gems",
    description: "Discover secret spots, local favorites, and off-the-beaten-path locations curated just for you."
  },
  {
    icon: Award,
    title: "Rewards & Badges",
    description: "Earn points and unlock achievements as you explore and discover new places in your city."
  }
];