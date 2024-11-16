import React from 'react';
import { motion } from 'framer-motion';
import { Globe, ChevronDown } from 'lucide-react';
import { supportedCountries } from '../data/countries';
import { useLocationStore } from '../store/useLocationStore';

export const CountrySelector: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { selectedCountry, setSelectedCountry, setSelectedCity } = useLocationStore();

  const handleCountrySelect = (countryCode: string) => {
    const country = supportedCountries.find(c => c.code === countryCode);
    setSelectedCountry(countryCode);
    if (country) {
      setSelectedCity(country.defaultCity);
    }
    setIsOpen(false);
  };

  const selectedCountryName = supportedCountries.find(
    c => c.code === selectedCountry
  )?.name || 'Select a country';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-indigo-500 transition-colors"
      >
        <Globe className="w-5 h-5 text-indigo-600" />
        <span className="text-gray-700">{selectedCountryName}</span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute z-10 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto"
        >
          {supportedCountries.map((country) => (
            <button
              key={country.code}
              onClick={() => handleCountrySelect(country.code)}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
            >
              <span className="text-lg">{country.name}</span>
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
};