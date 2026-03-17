# GEMINI Mandates - WayGo Project

## 1. Technical Mandates
- **API Quota Preservation**: Always check `src/entities/location/api/GooglePlacesService.ts` before making new API calls. Use the `CACHE_NEARBY` and `CACHE_DETAILS` objects to minimize redundant requests.
- **Field-Level Optimization**: When using `getDetails`, never request all fields. Only request: `['name', 'rating', 'photos', 'geometry', 'url', 'editorial_summary', 'formatted_address', 'opening_hours', 'types', 'place_id']`.
- **Geocoding Policy**: Do not use Google's Geocoding API for address-to-coordinate conversion. Use the existing Nominatim (OpenStreetMap) implementation in `Home.tsx` as it is free.
- **Vibe Engine Integrity**: Any new categories or location types must be mapped to the existing 7 vibes (`ToGo`, `Explore`, `Cozy`, `Active`, `Social`, `Nature`, `Special`) using the `TYPE_MAPPING` system.

## 2. Security Mandates
- **API Key Protection**: `VITE_GOOGLE_MAPS_API_KEY` must never be hardcoded. It is stored in `.env` and accessed via `import.meta.env`.
- **Git Hygiene**: `.env` and sensitive local files must remain in `.gitignore`. Never stage them.

## 3. Implementation Standards
- **State Management**: Use the `SavedContext` for any persistence related to user favorites.
- **Map Interaction**: All map-related movements and zoom levels should be handled within `Home.tsx` using the `ChangeView` helper component to ensure smooth animations.
- **Responsive Aesthetics**: Follow the "Ecological" theme: use `#4caf50` for primary actions and ensure all new UI components are responsive for mobile views.

## 4. Testing & Validation
- **Mock Fallbacks**: If the Google Places API is unavailable or the quota is exceeded, the system must gracefully fall back to the `MOCK_LOCATIONS` data.
