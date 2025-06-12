import React from "react";
import { useNavigate } from "react-router-dom";
import { FaLinkedin, FaInstagram, FaXTwitter, FaTiktok } from "react-icons/fa6";
import "./studentenprofile.css";

export default function StudentenProfiel() {
  const navigate = useNavigate();

  return (
    <div className="studenten-container">
      {/* NAVIGATION */}
      <nav className="studenten-navbar">
        <div className="studenten-logo" onClick={() => navigate("/")}>
          Careerlaunch
        </div>
        <ul className="studenten-links">
          <li onClick={() => navigate("/")}>Home</li>
          <li onClick={() => navigate("/studenten")}>Studenten</li>
          <li onClick={() => navigate("/contactNavbalk")}>Contact</li>
          <li onClick={() => navigate("/reservaties")}>Reservaties</li>
          <li>
            <img src="/profile-icon.png" alt="Profiel" className="studenten-icon" />
          </li>
        </ul>
      </nav>

      {/* MAIN CONTENT */}
      <main className="studenten-main">
        <h1>Profiel studenten</h1>
        <div className="studenten-filters">
          <input type="text" placeholder="Zoekveld" />
          <button>Sector</button>
          <button>Dienstverband</button>
        </div>

        <table className="studenten-table">
          <thead>
            <tr>
              <th>Profiel</th>
              <th>Sector</th>
              <th>Dienstverband</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Mohammad Akfir</td><td>IT</td><td>stage, studentenjob</td></tr>
            <tr><td>Mark Vermeer</td><td>IT</td><td>stage</td></tr>
            <tr><td>Tom Aertsens</td><td>IT</td><td>studentenjob</td></tr>
            <tr><td>Lisa Wouters</td><td>IT</td><td>stage</td></tr>
            <tr><td>Lucas Ackerman</td><td>IT</td><td>stage, studentenjob</td></tr>
          </tbody>
        </table>
      </main>

      {/* FOOTER */}
      <footer className="studenten-footer">
        <div className="studenten-footer-row">
          <div className="studenten-footer-col">
            <p>E-mailadres: support-careerlaunch@ehb.be</p>
            <p>Telefoonnummer: +32 494 77 08 550</p>
          </div>
          <div className="studenten-footer-col">
            <ul>
              <li onClick={() => navigate("/")}>Home</li>
              <li onClick={() => navigate("/studenten")}>Studenten</li>
              <li onClick={() => navigate("/reservaties")}>Reservaties</li>
              <li onClick={() => navigate("/contactNavbalk")}>Contact</li>
            </ul>
          </div>
          <div className="studenten-footer-col">
            <a href="https://www.linkedin.com/company/meterasmusplus/" target="_blank" rel="noreferrer"><FaLinkedin /></a>
            <a href="https://www.instagram.com/erasmushogeschool/" target="_blank" rel="noreferrer"><FaInstagram /></a>
            <a href="https://x.com/EUErasmusPlus" target="_blank" rel="noreferrer"><FaXTwitter /></a>
            <a href="https://www.tiktok.com/@erasmushogeschool" target="_blank" rel="noreferrer"><FaTiktok /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
