import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, MapPin, Star, Crown, Search } from 'lucide-react';
import { cn } from '../utils/cn';

interface Explorer {
  id: string;
  name: string;
  avatar: string;
  points: number;
  rank: number;
  placesVisited: number;
  achievements: number;
  isCurrentUser?: boolean;
}

// Mock data for the leaderboard
const explorers: Explorer[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    points: 2850,
    rank: 1,
    placesVisited: 47,
    achievements: 15,
  },
  {
    id: '2',
    name: 'Alex Rivera',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    points: 2720,
    rank: 2,
    placesVisited: 42,
    achievements: 13,
  },
  {
    id: '3',
    name: 'Emma Wilson',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
    points: 2590,
    rank: 3,
    placesVisited: 38,
    achievements: 12,
    isCurrentUser: true,
  },
  // Add more mock users here
];

const timeFilters = ['All Time', 'This Month', 'This Week'] as const;
type TimeFilter = typeof timeFilters[number];

export const Leaderboard: React.FC = () => {
  const [selectedTime, setSelectedTime] = useState<TimeFilter>('All Time');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredExplorers = explorers.filter(explorer =>
    explorer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Trophy className="w-8 h-8 text-yellow-500" />
            Explorer Leaderboard
          </h1>
          <p className="mt-2 text-gray-600">
            Compete with fellow explorers and climb the ranks
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search explorers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-64"
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>

          <div className="flex rounded-lg border border-gray-200 p-1 bg-white">
            {timeFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedTime(filter)}
                className={cn(
                  'px-4 py-1.5 text-sm font-medium rounded-md transition-colors',
                  selectedTime === filter
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 hover:text-indigo-600'
                )}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <LeaderboardCard
          icon={Crown}
          title="Top Explorer"
          value={explorers[0].name}
          subtitle={`${explorers[0].points.toLocaleString()} points`}
          iconColor="text-yellow-500"
        />
        <LeaderboardCard
          icon={MapPin}
          title="Most Places Visited"
          value={explorers[0].placesVisited.toString()}
          subtitle="locations"
          iconColor="text-indigo-500"
        />
        <LeaderboardCard
          icon={Medal}
          title="Most Achievements"
          value={explorers[0].achievements.toString()}
          subtitle="badges earned"
          iconColor="text-emerald-500"
        />
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Rank</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Explorer</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Points</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Places Visited</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Achievements</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredExplorers.map((explorer) => (
                <motion.tr
                  key={explorer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    'group hover:bg-gray-50 transition-colors',
                    explorer.isCurrentUser && 'bg-indigo-50'
                  )}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {explorer.rank <= 3 ? (
                        <Trophy className={cn(
                          'w-5 h-5 mr-2',
                          explorer.rank === 1 && 'text-yellow-500',
                          explorer.rank === 2 && 'text-gray-400',
                          explorer.rank === 3 && 'text-amber-600'
                        )} />
                      ) : (
                        <span className="w-5 h-5 mr-2 flex items-center justify-center text-sm font-medium text-gray-500">
                          {explorer.rank}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={explorer.avatar}
                        alt={explorer.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {explorer.name}
                          {explorer.isCurrentUser && (
                            <span className="ml-2 text-xs font-medium text-indigo-600">(You)</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{explorer.points.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{explorer.placesVisited}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-sm text-gray-900">{explorer.achievements}</span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

interface LeaderboardCardProps {
  icon: React.FC<{ className?: string }>;
  title: string;
  value: string;
  subtitle: string;
  iconColor: string;
}

const LeaderboardCard: React.FC<LeaderboardCardProps> = ({
  icon: Icon,
  title,
  value,
  subtitle,
  iconColor,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl shadow-lg p-6"
  >
    <div className="flex items-center gap-4">
      <div className={cn('p-3 rounded-lg bg-gray-50', iconColor)}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div className="mt-1">
          <span className="text-2xl font-bold text-gray-900">{value}</span>
          <span className="ml-1 text-sm text-gray-500">{subtitle}</span>
        </div>
      </div>
    </div>
  </motion.div>
);