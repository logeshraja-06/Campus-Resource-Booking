import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Resources from "./pages/Resources";
import BookingHistory from "./pages/BookingHistory";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/student-dashboard" element={<StudentDashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/resources" element={<Resources />} />
      <Route path="/booking-history" element={<BookingHistory />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;