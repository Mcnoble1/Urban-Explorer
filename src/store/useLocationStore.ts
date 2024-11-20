import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Location } from '../types/location';

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
  getLocationsByYear: (year: number) => Location[];
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set, get) => ({
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
          points: state.points + 100,
          locations: {
            ...state.locations,
            [locationId]: {
              ...state.locations[locationId],
              visited: true,
              visitDate: new Date().toISOString(),
            },
          },
        })),
      interactWithLocation: (locationId) =>
        set((state) => ({
          interactedLocations: [...state.interactedLocations, locationId],
          points: state.points + 25,
          locations: {
            ...state.locations,
            [locationId]: {
              ...state.locations[locationId],
              interacted: true,
            },
          },
        })),
      getLocationsByYear: (year) => {
        const state = get();
        return Object.values(state.locations)
          .filter(location => {
            if (!location.visitDate) return false;
            const visitYear = new Date(location.visitDate).getFullYear();
            return visitYear === year;
          })
          .sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime());
      },
    }),
    {
      name: 'location-storage',
    }
  )
);