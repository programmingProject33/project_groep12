import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaLinkedin, FaInstagram, FaXTwitter, FaTiktok } from "react-icons/fa6";
import "./contactNavbalk.css";

function Bedrijven() {
  const [bedrijven, setBedrijven] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/bedrijven")
      .then((res) => res.json())
      .then((data) => setBedrijven(data))
      .catch((err) => console.error("Fout bij ophalen:", err));
  }, []);

  return (
    <div className="page-container">
      {/* NAVIGATIEBALK */}
      <nav className="navbar">
        <div className="navbar-logo" onClick={() => navigate("/")}> 
          <span className="navbar-title">Careerlaunch</span>
        </div>
        <ul className="navbar-links">
          <li><Link className="nav-link" to="/">Home</Link></li>
          <li>Bedrijven</li>
          <li><Link className="nav-link" to="/contactNavbalk">Contact</Link></li>
          <li>
            <button className="navbar-btn register" onClick={() => navigate("/registreer")}>Registreer</button>
          </li>
          <li>
            <button className="navbar-btn login" onClick={() => navigate("/login")}>Login</button>
          </li>
        </ul>
      </nav>

      {/* MAIN CONTENT */}
      <main className="content-wrap bedrijven-container" style={{ padding: "2rem" }}>
        <h1>Bedrijven Lijst</h1>
        <ul>
          {bedrijven.map((bedrijf) => (
            <li key={bedrijf.id}>
              {bedrijf.naam} – {bedrijf.sector} – {bedrijf.bedrijf_URL}
            </li>
          ))}
        </ul>
      </main>

      {/* FOOTER */}
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
              <li onClick={() => navigate("/")} style={{ cursor: "pointer" }}>Home</li>
              <li onClick={() => navigate("/registreer")} style={{ cursor: "pointer" }}>Registreer</li>
              <li onClick={() => navigate("/contactNavbalk")} style={{ cursor: "pointer" }}>Contact</li>
              <li onClick={() => navigate("/login")} style={{ cursor: "pointer" }}>Login</li>
            </ul>
          </div>
          <div className="footer-col right">
            <div className="footer-socials">
              <a href="https://www.linkedin.com/company/meterasmusplus/" target="_blank" rel="noopener noreferrer" className="icon" title="LinkedIn"><FaLinkedin /></a>
              <a href="https://www.instagram.com/erasmushogeschool/?hl=en" target="_blank" rel="noopener noreferrer" className="icon" title="Instagram"><FaInstagram /></a>
              <a href="https://www.tiktok.com/@erasmushogeschool" target="_blank" rel="noopener noreferrer" className="icon" title="TikTok"><FaTiktok /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Bedrijven;
