import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import { FaLinkedin, FaInstagram, FaXTwitter, FaTiktok } from "react-icons/fa6";

export default function UserLayout() {
  const location = useLocation();
  const { user, isAuthLoading } = useAuth();
  if (isAuthLoading) return null; // of een loader
  if (!user || user.type !== 'student') {
    return null;
  }

  return (
    <div className="user-layout">
      {/* Student Navigation */}
      <nav className="navbar">
        <div className="navbar-logo">
          Careerlaunch
        </div>
        <div className="navbar-spacer" />
        <ul className="navbar-links">
          <li className={location.pathname === "/student-dashboard" ? "active" : ""}>
            <Link to="/student-dashboard">Home</Link>
          </li>
          <li className={location.pathname === "/bedrijven" ? "active" : ""}>
            <Link to="/bedrijven">Bedrijven</Link>
          </li>
          <li className={location.pathname === "/reservaties" ? "active" : ""}>
            <Link to="/reservaties">Reservaties</Link>
          </li>
          <li className={location.pathname === "/contact" ? "active" : ""}>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
        <Link to="/profiel" className="navbar-icon" aria-label="Profiel">
          <span role="img" aria-label="profile">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#1a1111">
              <circle cx="12" cy="8" r="4"/>
              <path d="M12 14c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z"/>
            </svg>
          </span>
        </Link>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-row">
          <div className="footer-col left">
            <div className="footer-mail">
              E-mailadres: support-careerlaunch@ehb.be<br />
              Telefoonnummer: +32 494 77 08 550
            </div>
          </div>
          <div className="footer-col middle">
            <ul className="footer-menu">
              <li><Link to="/student-dashboard">Home</Link></li>
              <li><Link to="/bedrijven">Bedrijven</Link></li>
              <li><Link to="/reservaties">Reservaties</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className="footer-col right">
            <div className="footer-socials">
              <a href="https://www.linkedin.com/company/meterasmusplus/" target="_blank" rel="noopener noreferrer" className="icon" title="LinkedIn"><FaLinkedin /></a>
              <a href="https://www.instagram.com/erasmushogeschool/?hl=en" target="_blank" rel="noopener noreferrer" className="icon" title="Instagram"><FaInstagram /></a>
              <a href="https://x.com/EUErasmusPlus?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor" target="_blank" rel="noopener noreferrer" className="icon" title="X"><FaXTwitter /></a>
              <a href="https://www.tiktok.com/@erasmushogeschool" target="_blank" rel="noopener noreferrer" className="icon" title="TikTok"><FaTiktok /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 