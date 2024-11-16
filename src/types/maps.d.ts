declare global {
  interface Window {
    google: any;
  }
}

declare module 'google.maps' {
  export interface Map3D extends HTMLElement {
    center: { lat: number; lng: number; altitude: number };
    tilt: number;
    heading: number;
    range: number;
  }
}