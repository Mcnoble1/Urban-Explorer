export interface Location {
  id: string;
  title: string;
  description: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  image: string;
  visitDate: string;
  category: string;
}