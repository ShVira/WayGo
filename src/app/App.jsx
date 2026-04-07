import React, { useContext } from "react"; 
import "./ui/App.css"; 
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
import LocationPage from "../pages/Location/Location";
import { SavedProvider } from "./providers/SavedContext"; 
import { HistoryProvider } from "./providers/HistoryContext"; 
import { SavedPage } from "../pages/Like/Saved";
import Profile from "../pages/Profile/Profile";
import History from "../pages/History/History";
import Auth from "../pages/Auth/Auth";

import { AppContext, AppProvider } from "../features/app-context/AppContext";

function AppRoutes() {
  const { user, isBusy } = useContext(AppContext);

  // Use isBusy from AppContext which tracks Firebase Auth state
  if (isBusy) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'white', color: '#4caf50', fontWeight: 'bold' }}>
        <div>Завантаження...</div>
      </div>
    );
  }

  return (
   <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/location/:id" element={<LocationPage />} />
  <Route path="/saved" element={<SavedPage />} />
  <Route path="/history" element={<History />} />
  <Route path="/profile" element={user ? <Profile /> : <Auth />} />
  <Route path="/auth" element={user ? <Profile /> : <Auth />} />
  
  {/* Add this line to catch unmatched routes */}
  <Route path="*" element={<div>Сторінку не знайдено (404)</div>} />
</Routes>
  );
}

export default function App() {
  const basename = import.meta.env.DEV ? "/" : "/WayGo";

  return (
    <AppProvider>
      <SavedProvider>
        <HistoryProvider>
          <BrowserRouter basename={basename}>
            <AppRoutes />
          </BrowserRouter>
        </HistoryProvider>
      </SavedProvider>
    </AppProvider>
  );
}
