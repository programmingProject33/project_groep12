import React from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GuestLayout from "./voor-inloggen/GuestLayout";
import UserLayout from "./inloggen-student/UserLayout";
import ProtectedRoute from "./inloggen-student/ProtectedRoute";
import GuestRoute from "./voor-inloggen/GuestRoute";
import Home from "./voor-inloggen/Home";
import Login from "./voor-inloggen/login";
import Registreer from "./voor-inloggen/registreer";
import Bedrijven from "./voor-inloggen/bedrijven";
import StudentDashboard from "./inloggen-student/StudentDashboard";
import Reservaties from "./inloggen-student/Reservaties";
import Profiel from "./inloggen-student/Profiel";
import Contact from "./inloggen-student/Contact";
import ContactNavbalk from "./voor-inloggen/contactNavbalk";
import { useAuth } from "./AuthContext.jsx";

function App() {
  const { user } = useAuth();
  // console.log("App rendering, checking localStorage:", localStorage.getItem("user"));
  
  return (
    <Router>
      <Routes>
        {/* Publieke routes */}
        <Route path="/" element={<GuestLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="registreer" element={<Registreer />} />
          <Route path="contactNavbalk" element={<ContactNavbalk />} />
        </Route>

        {/* Beschermde routes */}
        <Route path="/" element={<UserLayout />}>
          <Route path="student-dashboard" element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          } />
          <Route path="bedrijven" element={
            <ProtectedRoute>
              <Bedrijven />
            </ProtectedRoute>
          } />
          <Route path="reservaties" element={
            <ProtectedRoute>
              <Reservaties />
            </ProtectedRoute>
          } />
          <Route path="profiel" element={
            <ProtectedRoute>
              <Profiel />
            </ProtectedRoute>
          } />
          <Route path="contact" element={
            <ProtectedRoute>
              <Contact />
            </ProtectedRoute>
          } />
        </Route>

        {/* Bedrijven route - toegankelijk voor zowel ingelogde als niet-ingelogde gebruikers */}
        <Route path="/bedrijven" element={
          user ? <UserLayout /> : <GuestLayout />
        }>
          <Route index element={<Bedrijven />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
