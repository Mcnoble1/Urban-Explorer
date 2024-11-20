import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Map, User, Trophy, LogIn, LogOut, Navigation2, Search, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';
import { useAuthStore } from '../store/useAuthStore';

const navItems = [
  { path: '/', label: 'Home', icon: Map },
  { path: '/explore', label: 'Explore', icon: Map },
  { path: '/tours', label: 'Tours', icon: Navigation2 },
  { path: '/explorers', label: 'The Explorers', icon: Search },
  { path: '/unwrapped', label: '2024 Unwrapped', icon: Calendar },
  { path: '/profile', label: 'Profile', icon: User },
  { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
];

export const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Map className="w-8 h-8 text-indigo-600" />
            <span className="text-xl font-bold">Urban Explorer</span>
          </Link>
          
          <div className="hidden md:flex space-x-4">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={cn(
                  "relative px-3 py-2 rounded-md text-sm font-medium",
                  location.pathname === path
                    ? "text-indigo-600"
                    : "text-gray-600 hover:text-indigo-600"
                )}
              >
                <span className="flex items-center gap-1">
                  <Icon className="w-4 h-4" />
                  {label}
                </span>
                {location.pathname === path && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              {/* <span className="text-sm font-medium text-gray-700">
                Welcome, {user?.name}
              </span> */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};