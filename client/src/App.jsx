import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Loader from "./Loader.jsx";
import ScrollToTop from './ScrollToTop';
import VerificationPage from './pages/VerificationPage';

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
import Reservaties from "./inloggen-student/Reservaties";
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

// Custom hook voor role-based redirects, nu een geldige component
function RoleRedirect() {
  const { user, isAuthLoading } = useAuth();
  
  if (isAuthLoading) return null; // of een loader
  
  if (!user) return <Navigate to="/login" replace />;
  
  // Only redirect if user has a valid type
  if (user.type === 'student') {
    return <Navigate to="/student/dashboard" replace />;
  } else if (user.type === 'bedrijf') {
    return <Navigate to="/bedrijf/home" replace />;
  }
  
  // Fallback voor onbekende gebruikerstypes - clear invalid user data
  localStorage.removeItem('user');
  return <Navigate to="/login" replace />;
}

function BedrijvenRedirectWrapper() {
  const { user, isAuthLoading } = useAuth();
  
  if (isAuthLoading) return null; // of een loader
  
  // Only redirect if user is logged in and is a student
  if (user && user.type === 'student') {
    return <Navigate to="/student/bedrijven" replace />;
  }
  
  // For non-logged in users or companies, show the public bedrijven page
  return <Bedrijven />;
}

function App() {
  const { isAuthLoading } = useAuth();
  if (isAuthLoading) {
    return <Loader />;
  }
  return (
    <Router>
      <ScrollToTop />
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

        {/* Route voor e-mail verificatie */}
        <Route path="/confirm/:token" element={<VerificationPage />} />

        {/* Student routes met UserLayout als parent */}
        <Route path="/student" element={
          <ProtectedRoute allowedRoles={['student']}>
            <UserLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="bedrijven" element={<StudentBedrijven />} />
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
        <Route path="*" element={<RoleRedirect />} />
      </Routes>
    </Router>
  );
}

export default App;
