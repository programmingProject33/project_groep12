import React from "react";
import "./registerstudent.css";
import { FaLinkedin, FaInstagram, FaXTwitter, FaTiktok } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

export default function RegisterStudent() {
  const navigate = useNavigate();

  const goToHome = () => {
    navigate("/");
  };

  return (
    <div>
      {/* NAVIGATIE */}
      <nav className="navbar">
        <div className="navbar-logo" onClick={goToHome} style={{ cursor: "pointer" }}>
          <span className="navbar-title">Careerlaunch</span>
        </div>
        <ul className="navbar-links">
          <li><a onClick={goToHome} style={{ cursor: "pointer" }}>Home</a></li>
          <li><a href="#">Bedrijven</a></li>
          <li><a href="#">Contact</a></li>
          <li><button className="navbar-btn register">Registreer</button></li>
          <li><button className="navbar-btn login">Login</button></li>
        </ul>
      </nav>

      {/* FORMULIER VOOR STUDENT REGISTRATIE */}
      <main className="register-container">
        <h2>Registreer als Student</h2>
        <form className="register-form">
          <label>
            Voornaam:
            <input type="text" placeholder="Voornaam" />
          </label>
          <label>
            Achternaam:
            <input type="text" placeholder="Achternaam" />
          </label>
          <label>
            E-mailadres:
            <input type="email" placeholder="voorbeeld@ehb.be" />
          </label>
          <label>
            Studie:
            <input type="text" placeholder="Toegepaste Informatica..." />
          </label>
          <button type="submit" className="btn primary">Verzenden</button>
        </form>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-row">
          <div className="footer-col left">
            <div className="footer-logo-box"></div>
            <div className="footer-mail">
              E-mailadres: pp-test@ehb.be<br />
              +32 494 77 08 550
            </div>
          </div>
          <div className="footer-col middle">
            <ul className="footer-menu">
              <li onClick={goToHome} style={{ cursor: "pointer" }}>Home</li>
              <li>Inschrijving</li>
              <li>Contact</li>
              <li>Login</li>
            </ul>
          </div>
          <div className="footer-col right">
            <div className="footer-socials">
              <a href="#" className="icon" title="LinkedIn"><FaLinkedin /></a>
              <a href="#" className="icon" title="Instagram"><FaInstagram /></a>
              <a href="#" className="icon" title="X"><FaXTwitter /></a>
              <a href="#" className="icon" title="TikTok"><FaTiktok /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
