import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Location {
  id: string;
  title: string;
  description: string;
  coordinates: { lat: number; lng: number };
  rating: number;
  image: string;
  category: 'cafe' | 'historical' | 'scenic' | 'cultural';
  visited: boolean;
  interacted: boolean;
  points: number;
}

interface LocationState {
  selectedCountry: string | null;
  selectedCity: { name: string; coordinates: { lat: number; lng: number } } | null;
  locations: Record<string, Location>;
  visitedLocations: string[];
  interactedLocations: string[];
  points: number;
  setSelectedCountry: (country: string | null) => void;
  setSelectedCity: (city: { name: string; coordinates: { lat: number; lng: number } } | null) => void;
  visitLocation: (locationId: string) => void;
  interactWithLocation: (locationId: string) => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      selectedCountry: null,
      selectedCity: null,
      locations: {},
      visitedLocations: [],
      interactedLocations: [],
      points: 0,
      setSelectedCountry: (country) => set({ selectedCountry: country }),
      setSelectedCity: (city) => set({ selectedCity: city }),
      visitLocation: (locationId) =>
        set((state) => ({
          visitedLocations: [...state.visitedLocations, locationId],
          points: state.points + 100, // More points for visiting
          locations: {
            ...state.locations,
            [locationId]: {
              ...state.locations[locationId],
              visited: true,
            },
          },
        })),
      interactWithLocation: (locationId) =>
        set((state) => ({
          interactedLocations: [...state.interactedLocations, locationId],
          points: state.points + 25, // Fewer points for just interacting
          locations: {
            ...state.locations,
            [locationId]: {
              ...state.locations[locationId],
              interacted: true,
            },
          },
        })),
    }),
    {
      name: 'location-storage',
    }
  )
);