import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Trophy, Star, Camera, Calendar, Edit, Medal } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { EditProfileModal } from '../components/EditProfileModal';

// ... (keep the achievements and visitedLocations arrays as they are)

export const Profile: React.FC = () => {
  const { user } = useAuthStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6 mb-8"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-6">
            <div className="relative">
              <img
                src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=6366f1&color=fff`}
                alt={user?.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-lg"
              >
                <Edit className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
              <p className="text-gray-600">{user?.email}</p>
              {user?.bio && (
                <p className="text-gray-600 mt-2">{user.bio}</p>
              )}
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm text-gray-600">12 Places Visited</span>
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-600">Level 5 Explorer</span>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Edit Profile
          </button>
        </div>
      </motion.div>

      {/* Rest of the profile content remains the same */}

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  );
};