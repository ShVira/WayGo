import { useState, useEffect } from 'react';

// Add type definition for window.google
declare global {
  interface Window {
    google: any;
  }
}

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

// Simple cache to prevent re-fetching
const CACHE: Record<string, string> = {};
let scriptLoaded = false;
let scriptLoadingPromise: Promise<void> | null = null;

const loadGoogleMapsScript = (): Promise<void> => {
  if (scriptLoaded) return Promise.resolve();
  if (scriptLoadingPromise) return scriptLoadingPromise;

  scriptLoadingPromise = new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      scriptLoaded = true;
      resolve();
      return;
    }

    if (!GOOGLE_MAPS_API_KEY) {
      console.warn('Google Maps API key is missing. Skipping script load.');
      reject(new Error('API Key missing'));
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      scriptLoaded = true;
      resolve();
    };
    script.onerror = (e) => {
      console.error('Failed to load Google Maps script', e);
      reject(e);
    };
    document.head.appendChild(script);
  });

  return scriptLoadingPromise;
};

export const useGooglePlacePhoto = (googlePlaceId: string | undefined, fallbackImage: string) => {
  const [photoUrl, setPhotoUrl] = useState<string>(fallbackImage);

  useEffect(() => {
    if (!googlePlaceId) return;

    if (CACHE[googlePlaceId]) {
      setPhotoUrl(CACHE[googlePlaceId]);
      return;
    }

    let isMounted = true;

    const fetchPhoto = async () => {
      try {
        await loadGoogleMapsScript();
        
        if (!window.google || !window.google.maps || !window.google.maps.places) {
          throw new Error('Google Maps Places library not loaded');
        }

        const mapDiv = document.createElement('div');
        const service = new window.google.maps.places.PlacesService(mapDiv);
        
        service.getDetails(
          { placeId: googlePlaceId, fields: ['photos'] },
          (place, status) => {
            if (!isMounted) return;

            if (
              status === window.google.maps.places.PlacesServiceStatus.OK &&
              place &&
              place.photos &&
              place.photos.length > 0
            ) {
              const photo = place.photos[0];
              const photoReference = (photo as any).photo_reference || photo.photo_reference;
              
              let url = '';
              if (photoReference) {
                url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoReference}&key=${GOOGLE_MAPS_API_KEY}`;
              } else {
                url = photo.getUrl({ maxWidth: 800 });
              }

              CACHE[googlePlaceId] = url;
              setPhotoUrl(url);
            } else {
              // Keep fallback
              console.warn(`No photos found for placeId: ${googlePlaceId}`);
            }
          }
        );
      } catch (error) {
        if (isMounted) {
          console.error('Error loading Google Place photo:', error);
          // Keep fallback
        }
      }
    };

    fetchPhoto();

    return () => {
      isMounted = false;
    };
  }, [googlePlaceId]);

  return photoUrl;
};
