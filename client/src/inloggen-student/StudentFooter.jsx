import React from "react";
import { useLocation, Link } from "react-router-dom";
import "./StudentFooter.css";
import { useAuth } from "../AuthContext.jsx";
import { FaLinkedin, FaInstagram, FaXTwitter, FaTiktok } from "react-icons/fa6";

export default function StudentFooter() {
  const location = useLocation();
  const { user, isAuthLoading } = useAuth();
  if (isAuthLoading) return null;
  if (!user || user.type !== 'student') return null;

  return (
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
            <li><Link to="/student/bedrijven">Bedrijven</Link></li>
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
      <p>&copy; {new Date().getFullYear()} Careerlaunch. Alle rechten voorbehouden.</p>
    </footer>
  );
} 