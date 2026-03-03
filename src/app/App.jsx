import { BrowserRouter, Routes, Route } from "react-router-dom";
import LocationPage from "../pages/Location/Location";

// Можна також додати Home, якщо він вже створений
// import Home from "../pages/Home/Home";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<LocationPage />} />
        
        <Route path="/location/:id" element={<LocationPage />} />
      </Routes>
    </BrowserRouter>
  );
}