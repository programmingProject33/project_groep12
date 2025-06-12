import React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

export default function UserNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  console.log("Current location:", location.pathname);
  
  const handleNavigation = (path) => {
    console.log("Navigating to:", path);
    navigate(path);
  };

  return (
    <nav className="navbar user-navbar">
      <div className="navbar-logo" onClick={() => handleNavigation("/student-dashboard")}>
        Careerlaunch
      </div>
      <ul className="navbar-links">
        <li 
          className={location.pathname === "/student-dashboard" ? "active" : ""}
        >
          <Link to="/student-dashboard">Home</Link>
        </li>
        <li 
          className={location.pathname === "/bedrijven" ? "active" : ""}
        >
          <Link to="/bedrijven">Bedrijven</Link>
        </li>
        <li 
          className={location.pathname === "/reservaties" ? "active" : ""}
        >
          <Link to="/reservaties">Reservaties</Link>
        </li>
        <li 
          className={location.pathname === "/contact" ? "active" : ""}
        >
          <Link to="/contact">Contact</Link>
        </li>
        <li 
          className={location.pathname === "/profiel" ? "active" : ""}
        >
          <Link to="/profiel">Profiel</Link>
        </li>
      </ul>
    </nav>
  );
} 