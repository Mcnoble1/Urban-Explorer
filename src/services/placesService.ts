import { Location } from '../store/useLocationStore';

const PLACES_TYPES = ['tourist_attraction', 'cafe', 'museum', 'park'] as const;
type PlaceType = typeof PLACES_TYPES[number];

interface PlaceResult {
  place_id: string;
  name: string;
  geometry: {
    location: {
      lat: () => number;
      lng: () => number;
    };
  };
  photos?: Array<{
    getUrl: () => string;
  }>;
  rating?: number;
  vicinity?: string;
}

export const fetchPlacesForCity = async (
  lat: number,
  lng: number,
  type: PlaceType
): Promise<Location[]> => {
  try {
    const { PlacesService } = await google.maps.importLibrary("places") as any;
    
    // Create a dummy map element for PlacesService
    const mapDiv = document.createElement('div');
    const map = new google.maps.Map(mapDiv, {
      center: { lat, lng },
      zoom: 15
    });

    const service = new PlacesService(map);

    return new Promise((resolve, reject) => {
      const request = {
        location: { lat, lng },
        radius: 5000, // 5km radius
        type: type,
        rankBy: google.maps.places.RankBy.RATING
      };

      service.nearbySearch(request, (results: PlaceResult[] | null, status: any) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          const locations: Location[] = results
            .filter(place => place.rating && place.rating >= 4.0) // Only places with good ratings
            .slice(0, 5) // Limit to top 5 places
            .map(place => ({
              id: place.place_id,
              title: place.name,
              description: place.vicinity || 'A must-visit location',
              coordinates: {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
              },
              rating: place.rating || 4.0,
              image: place.photos?.[0]?.getUrl() || 
                `https://source.unsplash.com/800x600/?${type.replace('_', '-')}`,
              category: type === 'tourist_attraction' ? 'cultural' : 
                       type === 'cafe' ? 'cafe' : 
                       type === 'museum' ? 'cultural' : 'scenic',
              visited: false,
              interacted: false,
              points: type === 'tourist_attraction' ? 100 : 
                      type === 'museum' ? 80 : 
                      type === 'park' ? 60 : 40
            }));
          resolve(locations);
        } else {
          console.warn('Places API returned no results, using fallback data');
          // Use fallback data with correct coordinates
          resolve(getFallbackLocations(lat, lng, type));
        }
      });
    });
  } catch (error) {
    console.error('Error fetching places:', error);
    return getFallbackLocations(lat, lng, type);
  }
};

// Fallback data in case the API fails
const getFallbackLocations = (lat: number, lng: number, type: PlaceType): Location[] => {
  const fallbackLocations: Record<PlaceType, Location[]> = {
    tourist_attraction: [
      {
        id: 'fallback-1',
        title: 'Historic City Center',
        description: 'A beautiful historic district with amazing architecture',
        coordinates: { 
          lat: lat + (Math.random() - 0.5) * 0.01,
          lng: lng + (Math.random() - 0.5) * 0.01
        },
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80',
        category: 'cultural',
        visited: false,
        interacted: false,
        points: 100
      }
    ],
    cafe: [
      {
        id: 'fallback-3',
        title: 'Artisan Coffee House',
        description: 'Local favorite with amazing coffee and pastries',
        coordinates: { 
          lat: lat + (Math.random() - 0.5) * 0.01,
          lng: lng + (Math.random() - 0.5) * 0.01
        },
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80',
        category: 'cafe',
        visited: false,
        interacted: false,
        points: 40
      }
    ],
    museum: [
      {
        id: 'fallback-4',
        title: 'Modern Art Gallery',
        description: 'Contemporary art in a stunning setting',
        coordinates: { 
          lat: lat + (Math.random() - 0.5) * 0.01,
          lng: lng + (Math.random() - 0.5) * 0.01
        },
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=800&q=80',
        category: 'cultural',
        visited: false,
        interacted: false,
        points: 80
      }
    ],
    park: [
      {
        id: 'fallback-5',
        title: 'Central Gardens',
        description: 'Peaceful urban oasis with beautiful landscapes',
        coordinates: { 
          lat: lat + (Math.random() - 0.5) * 0.01,
          lng: lng + (Math.random() - 0.5) * 0.01
        },
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=800&q=80',
        category: 'scenic',
        visited: false,
        interacted: false,
        points: 60
      }
    ]
  };

  return fallbackLocations[type];
};