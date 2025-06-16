import React from "react";
import { useLocation, Link } from "react-router-dom";
import "./BedrijfNavbar.css";
import { useAuth } from "../AuthContext.jsx";

export default function BedrijfNavbar() {
  const location = useLocation();
  const { user, isAuthLoading } = useAuth();
  if (isAuthLoading) return null;
  if (!user || user.type !== 'bedrijf') {
    return null;
  }

  return (
    <nav className="navbar bedrijf-navbar">
      <div className="navbar-logo">
        Careerlaunch
      </div>
      <div className="navbar-spacer" />
      <ul className="navbar-links">
        <li className={location.pathname === "/bedrijf/home" ? "active" : ""}>
          <Link to="/bedrijf/home">Home</Link>
        </li>
        <li className={location.pathname === "/bedrijf/studenten" ? "active" : ""}>
          <Link to="/bedrijf/studenten">Studenten</Link>
        </li>
        <li className={location.pathname === "/bedrijf/reservaties" ? "active" : ""}>
          <Link to="/bedrijf/reservaties">Reservaties</Link>
        </li>
        <li className={location.pathname === "/bedrijf/contact" ? "active" : ""}>
          <Link to="/bedrijf/contact">Contact</Link>
        </li>
      </ul>
      <Link to="/bedrijf/profiel" className="navbar-icon" aria-label="Profiel">
        <span role="img" aria-label="profile"> 
          <svg width="28" height="28" viewBox="0 0 24 24" fill="#1a1111"><circle cx="12" cy="8" r="4"/><path d="M12 14c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z"/></svg>
        </span>
      </Link>
    </nav>
  );
} 