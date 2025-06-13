import React from "react";
import "./Reservaties.css";
import { useNavigate } from "react-router-dom";
import {
  FaLinkedin,
  FaInstagram,
  FaXTwitter,
  FaTiktok
} from "react-icons/fa6";

export default function Reservaties() {
  const navigate = useNavigate();

  return (
    <div className="reservaties-page">
      <main className="reservaties-main">
        <h1>Reservaties</h1>
        <p>Hier kun je je gemaakte reservaties bekijken.</p>
      </main>

      {/* Footer */}
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
           <div className="footer-col middle">
            <ul className="footer-menu">
              <li onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
                Home
              </li>
              <li onClick={() => navigate("/bedrijven")} style={{ cursor: "pointer" }}>
                Bedrijven
              </li>
              <li onClick={() => navigate("/Reservaties")} style={{ cursor: "pointer" }}>
                Reservaties
              </li>
              <li onClick={() => navigate("/contact")} style={{ cursor: "pointer" }}>
                Contact
              </li>
            </ul>
          </div>
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
    </div>
  );
}
