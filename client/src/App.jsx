import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

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

// Company Components
import BedrijfHome from "./inloggen-bedrijf/homeBedrijf.jsx";
import BedrijfStudenten from "./inloggen-bedrijf/Studenten.jsx";
import BedrijfReservaties from "./inloggen-bedrijf/reservatieBedrijf.jsx";
import BedrijfContact from "./inloggen-bedrijf/contactBedrijf.jsx";
import BedrijfProfiel from "./inloggen-bedrijf/profielBedrijf.jsx";
import StudentProfiel from "./inloggen-bedrijf/StudentProfiel.jsx";

// Context
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

        {/* Bedrijfspagina's met eigen prefix */}
        <Route path="/bedrijf/home" element={
          <ProtectedRoute>
            {user && user.type === 'bedrijf' ? (
              <BedrijfHome />
            ) : (
              <div>Geen toegang</div>
            )}
          </ProtectedRoute>
        } />
        <Route path="/bedrijf/studenten" element={
          <ProtectedRoute>
            {user && user.type === 'bedrijf' ? (
              <BedrijfStudenten />
            ) : (
              <div>Geen toegang</div>
            )}
          </ProtectedRoute>
        } />
        <Route path="/bedrijf/student/:studentId" element={
          <ProtectedRoute>
            {user && user.type === 'bedrijf' ? (
              <StudentProfiel />
            ) : (
              <div>Geen toegang</div>
            )}
          </ProtectedRoute>
        } />
        <Route path="/bedrijf/reservaties" element={
          <ProtectedRoute>
            {user && user.type === 'bedrijf' ? (
              <BedrijfReservaties />
            ) : (
              <div>Geen toegang</div>
            )}
          </ProtectedRoute>
        } />
        <Route path="/bedrijf/contact" element={
          <ProtectedRoute>
            {user && user.type === 'bedrijf' ? (
              <BedrijfContact />
            ) : (
              <div>Geen toegang</div>
            )}
          </ProtectedRoute>
        } />
        <Route path="/bedrijf/profiel" element={
          <ProtectedRoute>
            {user && user.type === 'bedrijf' ? (
              <BedrijfProfiel />
            ) : (
              <div>Geen toegang</div>
            )}
          </ProtectedRoute>
        } />

        {/* Student-routes */}
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
        {/* Speeddate page route - toegankelijk voor zowel ingelogde als niet-ingelogde gebruikers */}
        <Route path="/speeddate/:bedrijfId" element={
          user ? <UserLayout /> : <GuestLayout />
        }>
          <Route index element={<SpeeddatePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
