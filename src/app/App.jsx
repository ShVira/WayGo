// 1. You MUST import useContext here
import React, { useContext } from "react"; 
import "./ui/App.css"; // Global styles and variables
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
import LocationPage from "../pages/Location/Location";
import { SavedProvider } from "./providers/SavedContext"; 
import { SavedPage } from "../pages/Like/Saved";
import Profile from "../pages/Profile/Profile";
import History from "../pages/History/History";
import Auth from "../pages/Auth/Auth";

// 2. Import the actual Context object, not just the Provider
import { AppContext, AppProvider } from "../features/app-context/AppContext";

function AppRoutes() {
  // This line will crash the app if 'useContext' or 'AppContext' is undefined
  const { user } = useContext(AppContext);

  return (
    <BrowserRouter basename="/WayGo">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/location/:id" element={<LocationPage />} />
        <Route path="/saved" element={<SavedPage />} />
        <Route path="/history" element={<History />} />

        <Route path="/profile" element={user ? <Profile /> : <Auth />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AppProvider>
      <SavedProvider>
        <AppRoutes />
      </SavedProvider>
    </AppProvider>
  );
}
