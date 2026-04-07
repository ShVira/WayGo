import { Location, MOCK_LOCATIONS } from './MockLocations';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

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
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&language=uk`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      scriptLoaded = true;
      resolve();
    };
    script.onerror = (e) => reject(e);
    document.head.appendChild(script);
  });

  return scriptLoadingPromise;
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

const getDiverseFallback = (place: any): string => {
  const type = place.types?.[0] || 'place';
  const id = place.place_id || 'random';
  // Use the ID itself for the lock to ensure uniqueness if we MUST use a fallback
  return `https://loremflickr.com/800/600/${type},landscape/all?lock=${id}`;
};

const getPhotoUrl = (place: any, maxWidth: number): string => {
  if (place.photos && place.photos.length > 0) {
    const photo = place.photos[0];
    // In Google Maps JS SDK, the photo_reference is often stored in the photo object
    // but not exposed in the TypeScript definitions.
    const photoReference = photo.photo_reference || (photo as any).photo_reference;
    
    if (photoReference) {
      return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${GOOGLE_MAPS_API_KEY}`;
    }
    
    // Fallback to getUrl if photo_reference is somehow missing
    return photo.getUrl({ maxWidth });
  }
  return getDiverseFallback(place);
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

const CACHE_NEARBY: Record<string, Location[]> = {};
const CACHE_DETAILS: Record<string, Location> = {};

export const fetchNearbyLocations = async (
  center: [number, number],
  radius: number,
  vibe?: string | null
): Promise<Location[]> => {
  const cacheKey = `${center[0].toFixed(4)},${center[1].toFixed(4)},${radius},${vibe || 'all'}`;
  if (CACHE_NEARBY[cacheKey]) return CACHE_NEARBY[cacheKey];

  try {
    await loadGoogleMapsScript();
    const mapDiv = document.createElement('div');
    const service = new window.google.maps.places.PlacesService(mapDiv);

    return new Promise((resolve) => {
      service.nearbySearch({
        location: new window.google.maps.LatLng(center[0], center[1]),
        radius: radius,
        type: vibe ? mapVibeToGoogleType(vibe) : undefined
      }, (results: any[], status: any) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          const locations = results
            .filter(place => place.photos && place.photos.length > 0)
            .map((place) => {
            const vibes = getVibesFromTypes(place.types || []);
            return {
              id: place.place_id,
              googlePlaceId: place.place_id,
              name: place.name,
              distance: 'Поруч', 
              rating: place.rating || 0,
              image: getPhotoUrl(place, 800),
              vibes: vibes,
              icon: getIconForVibes(vibes),
              coords: [place.geometry.location.lat(), place.geometry.location.lng()],
              reviewUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}&query_place_id=${place.place_id}`,
              description: 'Локація з Google Maps.',
              address: place.vicinity || 'Адреса недоступна',
              hours: place.opening_hours 
                ? (place.opening_hours.open_now !== undefined 
                    ? (place.opening_hours.open_now ? 'Відчинено' : 'Зачинено') 
                    : (place.opening_hours.isOpen() ? 'Відчинено' : 'Зачинено')) 
                : 'Немає даних',
              userRatingsTotal: place.user_ratings_total || 0,
            };
          });
          CACHE_NEARBY[cacheKey] = locations;
          resolve(locations);
        } else resolve([]);
      });
    });
  } catch (error) {
    return [];
  }
};

export const fetchLocationDetails = async (placeId: string): Promise<Location | null> => {
  if (CACHE_DETAILS[placeId]) return CACHE_DETAILS[placeId];
  try {
    await loadGoogleMapsScript();
    const mapDiv = document.createElement('div');
    const service = new window.google.maps.places.PlacesService(mapDiv);
    return new Promise((resolve) => {
      service.getDetails({ 
        placeId: placeId,
        fields: ['name', 'rating', 'user_ratings_total', 'photos', 'geometry', 'url', 'editorial_summary', 'formatted_address', 'opening_hours', 'types', 'place_id']
      }, (place: any, status: any) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
          const vibes = getVibesFromTypes(place.types || []);
          const location = {
            id: place.place_id,
            googlePlaceId: place.place_id,
            name: place.name,
            distance: 'Поруч',
            rating: place.rating || 0,
            userRatingsTotal: place.user_ratings_total || 0,
            image: getPhotoUrl(place, 1200),
            vibes: vibes,
            icon: getIconForVibes(vibes),
            coords: [place.geometry.location.lat(), place.geometry.location.lng()],
            reviewUrl: place.url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}&query_place_id=${place.place_id}`,
            description: place.editorial_summary?.overview || 'Локація з Google Maps.',
            address: place.formatted_address || place.vicinity || 'Адреса недоступна',
            hours: place.opening_hours 
              ? (place.opening_hours.open_now !== undefined 
                  ? (place.opening_hours.open_now ? 'Відчинено' : 'Зачинено') 
                  : (place.opening_hours.isOpen() ? 'Відчинено' : 'Зачинено')) 
              : 'Немає даних',
            weekdayText: place.opening_hours?.weekday_text || [],
          };
          CACHE_DETAILS[placeId] = location;
          resolve(location);
        } else resolve(null);
      });
    });
  } catch (error) {
    return null;
  }
};
