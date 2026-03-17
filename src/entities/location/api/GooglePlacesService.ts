import { Location } from './MockLocations';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

// Add type definition for window.google
declare global {
  interface Window {
    google: any;
  }
}

let scriptLoaded = false;
let scriptLoadingPromise: Promise<void> | null = null;

const loadGoogleMapsScript = (): Promise<void> => {
  if (scriptLoaded) return Promise.resolve();
  if (scriptLoadingPromise) return scriptLoadingPromise;

  scriptLoadingPromise = new Promise((resolve, reject) => {
    if (window.google && window.google.maps && window.google.maps.places) {
      scriptLoaded = true;
      resolve();
      return;
    }

    if (!GOOGLE_MAPS_API_KEY) {
      console.warn('Google Maps API key is missing.');
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

// Map Google Place types to Vibes
const TYPE_MAPPING: Record<string, string[]> = {
  cafe: ['ToGo', 'Cozy'],
  bakery: ['ToGo'],
  restaurant: ['Social', 'ToGo'],
  bar: ['Social', 'Special'],
  night_club: ['Social', 'Special'],
  park: ['Nature', 'Active'],
  museum: ['Explore'],
  art_gallery: ['Explore'],
  tourist_attraction: ['Explore', 'Special'],
  church: ['Explore'],
  gym: ['Active'],
  stadium: ['Active', 'Special'],
  zoo: ['Nature'],
  aquarium: ['Nature'],
  book_store: ['Cozy'],
  library: ['Cozy'],
  spa: ['Cozy'],
  shopping_mall: ['Social'],
  cinema: ['Social'],
  bowling_alley: ['Social'],
  amusement_park: ['Special'],
};

const getVibesFromTypes = (types: string[]): string[] => {
  const vibes = new Set<string>();
  types.forEach(type => {
    if (TYPE_MAPPING[type]) {
      TYPE_MAPPING[type].forEach(vibe => vibes.add(vibe));
    }
  });
  return vibes.size > 0 ? Array.from(vibes) : ['Explore']; // Default to Explore if no mapping found
};

const getIconForVibes = (vibes: string[]): string => {
  if (vibes.includes('ToGo')) return '⚡';
  if (vibes.includes('Cozy')) return '☕';
  if (vibes.includes('Social')) return '🍸';
  if (vibes.includes('Nature')) return '🌿';
  if (vibes.includes('Active')) return '🏃';
  if (vibes.includes('Explore')) return '🧭';
  if (vibes.includes('Special')) return '✨';
  return '📍';
};

// Simple session cache to minimize API calls
const CACHE_NEARBY: Record<string, Location[]> = {};
const CACHE_DETAILS: Record<string, Location> = {};

export const fetchNearbyLocations = async (
  center: [number, number],
  radius: number,
  vibe?: string | null
): Promise<Location[]> => {
  const cacheKey = `${center[0].toFixed(4)},${center[1].toFixed(4)},${radius},${vibe || 'all'}`;
  
  if (CACHE_NEARBY[cacheKey]) {
    console.log('Returning nearby locations from cache');
    return CACHE_NEARBY[cacheKey];
  }

  try {
    await loadGoogleMapsScript();

    if (!window.google || !window.google.maps || !window.google.maps.places) {
      throw new Error('Google Maps Places library not loaded');
    }

    const mapDiv = document.createElement('div');
    const service = new window.google.maps.places.PlacesService(mapDiv);

    return new Promise((resolve, reject) => {
      const request: any = {
        location: new window.google.maps.LatLng(center[0], center[1]),
        radius: radius,
        type: vibe ? mapVibeToGoogleType(vibe) : undefined,
      };

      service.nearbySearch(request, (results: any[], status: any) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          const locations: Location[] = results.map((place) => {
            const vibes = getVibesFromTypes(place.types || []);
            return {
              id: place.place_id,
              googlePlaceId: place.place_id,
              name: place.name,
              distance: 'Nearby', 
              rating: place.rating || 0,
              image: place.photos && place.photos.length > 0 
                ? place.photos[0].getUrl({ maxWidth: 800 }) 
                : 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop',
              vibes: vibes,
              icon: getIconForVibes(vibes),
              coords: [place.geometry.location.lat(), place.geometry.location.lng()],
              reviewUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}&query_place_id=${place.place_id}`,
              description: 'Real location from Google Maps.',
              address: place.vicinity || 'Address not available',
              hours: place.opening_hours ? (place.opening_hours.isOpen() ? 'Open now' : 'Closed') : 'Hours not available',
            };
          });

          const filtered = vibe 
            ? locations.filter(loc => loc.vibes.includes(vibe))
            : locations;

          CACHE_NEARBY[cacheKey] = filtered;
          resolve(filtered);
        } else if (status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
          CACHE_NEARBY[cacheKey] = [];
          resolve([]);
        } else {
          reject(new Error(`Nearby Search failed with status: ${status}`));
        }
      });
    });
  } catch (error) {
    console.error('Error fetching nearby locations:', error);
    return [];
  }
};

export const fetchLocationDetails = async (placeId: string): Promise<Location | null> => {
  if (CACHE_DETAILS[placeId]) {
    console.log('Returning location details from cache');
    return CACHE_DETAILS[placeId];
  }

  try {
    await loadGoogleMapsScript();

    if (!window.google || !window.google.maps || !window.google.maps.places) {
      throw new Error('Google Maps Places library not loaded');
    }

    const mapDiv = document.createElement('div');
    const service = new window.google.maps.places.PlacesService(mapDiv);

    return new Promise((resolve, reject) => {
      // requesting ONLY necessary fields to save quota/costs
      service.getDetails({ 
        placeId: placeId,
        fields: [
          'name', 'rating', 'photos', 'geometry', 'url', 
          'editorial_summary', 'formatted_address', 'opening_hours', 'types', 'place_id'
        ]
      }, (place: any, status: any) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
          const vibes = getVibesFromTypes(place.types || []);
          const location = {
            id: place.place_id,
            googlePlaceId: place.place_id,
            name: place.name,
            distance: 'Nearby',
            rating: place.rating || 0,
            image: place.photos && place.photos.length > 0 
              ? place.photos[0].getUrl({ maxWidth: 1200 }) 
              : 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop',
            vibes: vibes,
            icon: getIconForVibes(vibes),
            coords: [place.geometry.location.lat(), place.geometry.location.lng()],
            reviewUrl: place.url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}&query_place_id=${place.place_id}`,
            description: place.editorial_summary?.overview || place.formatted_address || 'Real location from Google Maps.',
            address: place.formatted_address || place.vicinity || 'Address not available',
            hours: place.opening_hours ? (place.opening_hours.isOpen() ? 'Open now' : 'Closed') : 'Hours not available',
          };
          CACHE_DETAILS[placeId] = location;
          resolve(location);
        } else {
          reject(new Error(`Get Details failed with status: ${status}`));
        }
      });
    });
  } catch (error) {
    console.error('Error fetching location details:', error);
    return null;
  }
};

const mapVibeToGoogleType = (vibe: string): string | undefined => {
  switch (vibe) {
    case 'ToGo': return 'cafe';
    case 'Explore': return 'tourist_attraction';
    case 'Cozy': return 'cafe';
    case 'Active': return 'park';
    case 'Social': return 'restaurant';
    case 'Nature': return 'park';
    case 'Special': return 'museum';
    default: return undefined;
  }
};
