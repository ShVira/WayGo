import React, { useContext, useEffect} from "react"; 
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

// Import Error Pages
import NotFoundPage from "../pages/Error/NotFound";
import ForbiddenPage from "../pages/Error/Forbidden";
import ServerErrorPage from "../pages/Error/ServerError";

import { AppContext, AppProvider } from "../features/app-context/AppContext";

function AppRoutes() {
  const { user, isBusy } = useContext(AppContext);

  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark';
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  if (isBusy) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        backgroundColor: 'var(--bg-main)', 
        color: 'var(--primary)', 
        fontWeight: 'bold' 
      }}>
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
      <Route path="*" element={<div>Сторінку не  (404)</div>} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <SavedProvider>
          <HistoryProvider>
            <AppRoutes />
          </HistoryProvider>
        </SavedProvider>
      </BrowserRouter>
    </AppProvider>
  );
}