import React from "react";
import { useNavigate } from "react-router-dom";
import { FaLinkedin, FaInstagram, FaTiktok } from "react-icons/fa6";
import "./Footer.css";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="footer-row">
        <div className="footer-col left">
          <div className="footer-logo-box"></div>
          <div className="footer-mail">
            E-mailadres: support-careerlaunch@ehb.be
            <br />
            Telefoonnummer: +32 494 77 08 550
          </div>
        </div>
        <div className="footer-col middle">
          <ul className="footer-menu">
            <li onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
              Home
            </li>
            <li onClick={() => navigate("/registreer")} style={{ cursor: "pointer" }}>
              Registreer
            </li>
            <li onClick={() => navigate("/contactNavbalk")} style={{ cursor: "pointer" }}>
              Contact
            </li>
            <li onClick={() => navigate("/login")} style={{ cursor: "pointer" }}>
              Login
            </li>
          </ul>
        </div>
        <div className="footer-col right">
          <div className="footer-socials">
            <a
              href="https://www.linkedin.com/company/meterasmusplus/"
              target="_blank"
              rel="noopener noreferrer"
              className="icon"
              title="LinkedIn"
            >
              <FaLinkedin />
            </a>
            <a
              href="https://www.instagram.com/erasmushogeschool/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="icon"
              title="Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.tiktok.com/@erasmushogeschool"
              target="_blank"
              rel="noopener noreferrer"
              className="icon"
              title="TikTok"
            >
              <FaTiktok />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
} 