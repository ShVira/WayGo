# WayGo - Project Context & Technical Documentation

## 1. Project Overview
**WayGo** is an innovative personalized web application for finding leisure locations based on the user's **emotional context** (Vibe).

*   **Goal:** Reduce decision-making time ("where to go?") from 15-20 minutes to a few seconds.
*   **Key Innovation:** Replacing traditional categories with "Vibes" (atmosphere-based filtering).
*   **Aesthetic:** "Ecological," clean, and fresh. Light mode with green accents (#2e7d32, #4caf50).

## 2. Core Features & Functional Modules
### Vibe Engine
Locations are classified into 7 primary vibes:
1.  **ToGo** (Quick visits, coffee on the run) - Icon: `Zap`
2.  **Explore** (New places, discovery) - Icon: `Compass`
3.  **Cozy** (Comfort, quiet work, relaxation) - Icon: `Coffee`
4.  **Active** (Sports, movement) - Icon: `Activity`
5.  **Social** (Meeting friends, crowds) - Icon: `Users`
6.  **Nature** (Parks, outdoor spots) - Icon: `Leaf`
7.  **Special** (Unique events, specific atmosphere) - Icon: `Sparkles`

### Key Functionalities
*   **Dynamic Search:** Radius-based search using Google Places API, filtered by vibes.
*   **Interactive Map:** Leaflet-based visualization with custom markers and a green radius circle.
*   **Shuffle Button:** Selects 5 random locations within the search radius and focuses the map on one.
*   **Caching & Optimization:** Session-level caching for API results and field-limiting to minimize quota usage.
*   **Saved Locations:** Persistence via LocalStorage and React Context (`SavedContext`).

## 3. Technical Stack
*   **Frontend:** React (SPA) + TypeScript.
*   **Routing:** React Router DOM v7.
*   **Maps:** Leaflet & React-Leaflet (OpenStreetMap tiles).
*   **External API:** Google Places API (Nearby Search & Place Details).
*   **Geocoding:** OpenStreetMap (Nominatim) for free location searches.
*   **Icons:** Lucide-React.
*   **Styling:** Vanilla CSS (Modular).
*   **Build Tool:** Vite.

## 4. Architecture & Implementation Details
### Directory Structure
*   `src/app/`: Routing and global providers (`SavedContext`).
*   `src/entities/`: 
    *   `location/api/`: `GooglePlacesService.ts` (Core API logic), `MockLocations.ts` (Data types and fallbacks).
*   `src/features/`: UI modules (`category-selector`, `navigation-bar`, `shuffle`, `layout`).
*   `src/pages/`: 
    *   `Home/`: Map management, location fetching, and shuffle logic.
    *   `Location/`: Dynamic detail fetching from Google Places.
    *   `Like/`: Saved locations display.

### Google Places Integration Strategy
*   **Quota Management:** 
    *   **Caching:** Results for `nearbySearch` and `getDetails` are stored in an in-memory session cache.
    *   **Field Filtering:** `getDetails` requests only specific fields (`name`, `photos`, `geometry`, etc.) to stay in the Basic/Atmosphere billing tiers.
    *   **Pre-fetching:** Popups use image URLs already retrieved during search to avoid redundant calls.
*   **Vibe Mapping:** Maps Google Place types (e.g., `cafe`, `park`) to WayGo vibes using `TYPE_MAPPING` in `GooglePlacesService.ts`.

### Location Data Structure
*   `id`: Support for both `number` (mocks) and `string` (Google Place IDs).
*   `coords`: Array `[latitude, longitude]`.
*   `vibes`: Array of vibe labels (e.g., `['Cozy', 'Social']`).

## 5. Development & Security
*   **Environment Variables:** `VITE_GOOGLE_MAPS_API_KEY` is required in `.env`.
*   **Git Safety:** `.env` is excluded via `.gitignore`.
*   **Geocoding:** Always use Nominatim for text-to-coordinate conversion to save API credits.

## 6. Recent Updates
*   Integrated real-world location fetching with a 5-random-result constraint.
*   Implemented "Shuffle" button logic to pick 5 new random locations from the same area.
*   Transitioned `LocationPage` to fetch real-time data from Google when needed.
