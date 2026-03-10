import { BrowserRouter, Routes, Route } from "react-router-dom";
import LocationPage from "../pages/Location/Location";
import Layout from "../features/layout/Layout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LocationPage />} />
          <Route path="location/:id" element={<LocationPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}