import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import StaffDashboard from "../pages/StaffDashboard";
import PetForm from "../pages/PetForm";
import About from "../pages/About";
import Contact from "../pages/Contact";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/staff-dashboard" element={<StaffDashboard />} />
      <Route path="/book" element={<PetForm />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
}
