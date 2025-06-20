import React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "./StudentHeader.css";
import ehbLogo from "../assets/favicon_io/ehb-logo.png";

export default function StudentHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <nav className="navbar student-navbar">
      <div className="navbar-logo" onClick={() => handleNavigation("/student-dashboard")}>
        <img
          src={ehbLogo}
          alt="EHB logo"
        />
        <span>
          Careerlaunch
        </span>
      </div>
      <ul className="navbar-links">
        <li 
          className={location.pathname === "/student-dashboard" ? "active" : ""}
        >
          <Link to="/student-dashboard">Home</Link>
        </li>
        <li 
          className={location.pathname === "/student/bedrijven" ? "active" : ""}
        >
          <Link to="/student/bedrijven">Bedrijven</Link>
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