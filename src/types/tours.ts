export interface TourStop {
  id: string;
  title: string;
  description: string;
  coordinates: { lat: number; lng: number };
  image: string;
  duration?: number;
}

export interface Tour {
  id: string;
  title: string;
  description: string;
  stops: TourStop[];
  coverImage: string;
}