# WayGo - Project Context & Documentation

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
*   **Personalized Search:** Radius-based search filtered by vibes and distance (1, 5, 10, 50 km).
*   **Interactive Map:** Real-time visualization of locations using Leaflet (Kyiv mock data implemented).
*   **Shuffle Button:** Floating action button (FAB) on the map for instant recommendation refresh.
*   **Social Interaction:** "I was here" marks, reviews, likes/dislikes (Mocked in NavigationBar).
*   **AI Core:** NLP analysis of reviews to automatically assign vibes (Future implementation).

## 3. Technical Stack
*   **Frontend:** React (SPA) + TypeScript.
*   **Routing:** React Router DOM v7.
*   **Maps:** Leaflet & React-Leaflet (OpenStreetMap).
*   **Icons:** Lucide-React.
*   **State Management:** React Context / Custom Stores.
*   **Styling:** Vanilla CSS (Modular).
*   **Build Tool:** Vite.

## 4. Current Implementation Status (Frontend)
### Architecture
The project follows a feature-based structure:
*   `src/app/`: Routing and global configuration.
*   `src/features/`: Reusable logic/UI components:
    *   `header/`: Centered logo, slogan ("Знайди свій вайб поруч"), and MapPin icon.
    *   `navigation-bar/`: Footer with 4 tabs (Головна, Обране, Історія, Профіль).
    *   `category-selector/`: Top-level Vibe grid with Lucide icons.
    *   `shuffle/`: Floating "Shuffle" button for the map.
    *   `layout/`: Main app wrapper (Header/Navbar/Content).
*   `src/pages/`: Page-level components:
    *   `Home/`: Vibe selector (top), Search Bar with distance dropdown (middle), and Map (bottom).
    *   `Location/`: Detailed view for specific locations.

### Key Components
1.  **Header:** Centered green logo and thin slogan. Height increased for spacious feel.
2.  **NavigationBar:** Fixed bottom menu with Map, Bookmark, Clock, and User icons.
3.  **Home Page:**
    *   `CategorySelector`: Horizontal scrollable/grid of vibes.
    *   `SearchBar`: Input with "Вкажіть місцерозташування..." placeholder and distance dropdown.
    *   `MapContainer`: Full-width map with custom markers and popups.
    *   `ShuffleButton`: Pulsating green FAB at the bottom center of the map.

## 5. Development Guide
*   **Run Dev Server:** `npm run dev` (from `WayGo` folder).
*   **Build:** `npm run build`.
*   **Main Color Palette:**
    *   Primary Green: `#4caf50` (Logo, Markers, Icons).
    *   Deep Green: `#2e7d32` (Title, Shuffle Button).
    *   Background: `#f9fbf9` (Ecological white).
    *   Borders/Dividers: `#edf2ed`.

## 6. Recent UI Changes
*   Swapped Vibe Selector (Top) and Search Bar (Middle).
*   Unified icon system using `lucide-react`.
*   Updated Header branding (centered, specific slogan, larger logo).
*   Replaced Emoji markers with Leaflet markers + Popups containing location info.
