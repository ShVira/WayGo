import React, { useContext, useState, useEffect } from "react"; 
import "./ui/App.css"; 
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
import LocationPage from "../pages/Location/Location";
import { SavedProvider } from "./providers/SavedContext"; 
// --- 1. IMPORT THE HISTORY PROVIDER ---
import { HistoryProvider } from "./providers/HistoryContext"; 
import { SavedPage } from "../pages/Like/Saved";
import Profile from "../pages/Profile/Profile";
import History from "../pages/History/History";
import Auth from "../pages/Auth/Auth";

import { AppContext, AppProvider } from "../features/app-context/AppContext";

function AppRoutes() {
  const { user, setUser } = useContext(AppContext);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const savedSession = localStorage.getItem("user-231");
    if (savedSession) {
      try {
        const parsedUser = JSON.parse(savedSession);
        setUser(parsedUser);
      } catch (e) {
        console.error("Failed to parse user session", e);
        localStorage.removeItem("user-231");
      }
    }
    setIsInitializing(false); 
  }, [setUser]);

  if (isInitializing) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Завантаження...</span>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter basename="/WayGo">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/location/:id" element={<LocationPage />} />
        <Route path="/saved" element={<SavedPage />} />
        <Route path="/history" element={<History />} />
        <Route path="/profile" element={user ? <Profile /> : <Auth />} />
        <Route path="/auth" element={user ? <Profile /> : <Auth />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AppProvider>
      <SavedProvider>
        {/* --- 2. WRAP APP ROUTES IN HISTORY PROVIDER --- */}
        <HistoryProvider>
          <AppRoutes />
        </HistoryProvider>
      </SavedProvider>
    </AppProvider>
  );
}