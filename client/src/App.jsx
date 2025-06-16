import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Loader from "./Loader.jsx";

// Guest/Public Components
import GuestLayout from "./voor-inloggen/GuestLayout";
import GuestRoute from "./voor-inloggen/GuestRoute";
import Home from "./voor-inloggen/Home";
import Login from "./voor-inloggen/login";
import Registreer from "./voor-inloggen/registreer";
import Bedrijven from "./voor-inloggen/bedrijven";
import ContactNavbalk from "./voor-inloggen/contactNavbalk";
import SpeeddatePage from "./voor-inloggen/SpeeddatePage.jsx";

// Student Components
import UserLayout from "./inloggen-student/UserLayout";
import ProtectedRoute from "./inloggen-student/ProtectedRoute";
import StudentDashboard from "./inloggen-student/StudentDashboard";
import Reservaties from "./na-inloggen/Reservaties";
import Profiel from "./inloggen-student/Profiel";
import Contact from "./inloggen-student/Contact";
import StudentBedrijven from "./inloggen-student/StudentBedrijven";

// Company Components
import BedrijfHome from "./inloggen-bedrijf/homeBedrijf.jsx";
import BedrijfStudenten from "./inloggen-bedrijf/Studenten.jsx";
import BedrijfReservaties from "./inloggen-bedrijf/reservatieBedrijf.jsx";
import BedrijfContact from "./inloggen-bedrijf/contactBedrijf.jsx";
import BedrijfProfiel from "./inloggen-bedrijf/profielBedrijf.jsx";
import StudentProfiel from "./inloggen-bedrijf/StudentProfiel.jsx";

// Context
import { useAuth } from "./AuthContext.jsx";

// Custom hook voor role-based redirects
function useRoleRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.type === 'student' ? '/student-dashboard' : '/bedrijf/home'} replace />;
}

function BedrijvenRedirectWrapper() {
  const { user, isAuthLoading } = useAuth();
  if (isAuthLoading) return null; // of een loader
  if (user && user.type === 'student') {
    return <Navigate to="/student/bedrijven" replace />;
  }
  return <Bedrijven />;
}

function App() {
  const { isAuthLoading } = useAuth();
  if (isAuthLoading) {
    return <Loader />;
  }
  return (
    <Router>
      <Routes>
        {/* Publieke routes */}
        <Route path="/" element={<GuestLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          } />
          <Route path="registreer" element={
            <GuestRoute>
              <Registreer />
            </GuestRoute>
          } />
          <Route path="contactNavbalk" element={<ContactNavbalk />} />
          <Route path="bedrijven" element={<BedrijvenRedirectWrapper />} />
        </Route>

        {/* Student routes met UserLayout als parent */}
        <Route path="/" element={
          <ProtectedRoute allowedRoles={['student']}>
            <UserLayout />
          </ProtectedRoute>
        }>
          <Route path="student-dashboard" element={<StudentDashboard />} />
          <Route path="student/bedrijven" element={<StudentBedrijven />} />
          <Route path="bedrijven" element={<Bedrijven />} />
          <Route path="reservaties" element={<Reservaties />} />
          <Route path="profiel" element={<Profiel />} />
          <Route path="contact" element={<Contact />} />
          <Route path="speeddate/:bedrijfId" element={<SpeeddatePage />} />
        </Route>

        {/* Bedrijf routes met eigen layout */}
        <Route path="/bedrijf" element={
          <ProtectedRoute allowedRoles={['bedrijf']}>
            <div className="bedrijf-layout">
              <Outlet />
            </div>
          </ProtectedRoute>
        }>
          <Route path="home" element={<BedrijfHome />} />
          <Route path="studenten" element={<BedrijfStudenten />} />
          <Route path="student/:studentId" element={<StudentProfiel />} />
          <Route path="reservaties" element={<BedrijfReservaties />} />
          <Route path="contact" element={<BedrijfContact />} />
          <Route path="profiel" element={<BedrijfProfiel />} />
        </Route>

        {/* Catch-all route voor ongeldige paden */}
        <Route path="*" element={<useRoleRedirect />} />
      </Routes>
    </Router>
  );
}

export default App;
