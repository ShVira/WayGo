import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import LocationPage from "../pages/Location/Location";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/location/:id" element={<LocationPage />} />
      </Routes>
    </BrowserRouter>
  );
}
