import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import LocationPage from "../pages/Location/Location";
// Import your Provider here
import { SavedProvider } from "./providers/SavedContext"; 
import { SavedPage } from "../pages/Like/Saved";

export default function App() {
  return (
    /* 1. Wrap everything in the Provider */
    <SavedProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/location/:id" element={<LocationPage />} />
          <Route path="/saved" element={<SavedPage />} />
        </Routes>
      </BrowserRouter>
    </SavedProvider>
  );
}