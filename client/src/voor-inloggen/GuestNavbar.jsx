import React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

export default function GuestNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  console.log("Current location:", location.pathname);
  
  const handleNavigation = (path) => {
    console.log("Navigating to:", path);
    navigate(path);
  };

  return (
    <nav className="navbar guest-navbar">
      <div className="navbar-logo" onClick={() => handleNavigation("/")}>
        Careerlaunch
      </div>
      <ul className="navbar-links">
        <li 
          className={location.pathname === "/" ? "active" : ""}
        >
          <Link to="/">Home</Link>
        </li>
        <li 
          className={location.pathname === "/bedrijven" ? "active" : ""}
        >
          <Link to="/bedrijven">Bedrijven</Link>
        </li>
        <li 
          className={location.pathname === "/contactNavbalk" ? "active" : ""}
        >
          <Link to="/contactNavbalk">Contact</Link>
        </li>
        <li 
          className={location.pathname === "/registreer" ? "active" : ""}
        >
          <Link to="/registreer">Registreer</Link>
        </li>
        <li 
          className={location.pathname === "/login" ? "active" : ""}
        >
          <Link to="/login">Login</Link>
        </li>
      </ul>
    </nav>
  );
} 