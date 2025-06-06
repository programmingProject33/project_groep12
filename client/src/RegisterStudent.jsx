import React from "react";
import "./RegisterStudent.css"; // Voor de styling
import { useNavigate } from "react-router-dom";
 
export default function RegisterStudent() {
  return (
<div>
      {/* NAVBAR */}
<nav className="navbar">
<div className="navbar-logo">
<span className="navbar-title">Careerlaunch</span>
</div>
<ul className="navbar-links">
<li><a href="/">Home</a></li>
<li><a href="#">Register</a></li>
<li><a href="#">Bedrijven</a></li>
<li><a href="#">Contact</a></li>
<li><a href="#">Login</a></li>
</ul>
</nav>
 
      {/* FORMULIER */}
<main className="student-register-container">
<h1>Account maken als student</h1>
<form className="student-register-form">
<label>
            Voornaam:
<input type="text" name="voornaam" required />
</label>
<label>
            Naam:
<input type="text" name="naam" required />
</label>
<label>
            E-mailadres:
<input type="email" name="email" required />
</label>
<label>
            Wachtwoord:
<input type="password" name="wachtwoord" required />
</label>
<label>
            Wachtwoord bevestiging:
<input type="password" name="wachtwoord2" required />
</label>
<label className="checkbox-row">
<input type="checkbox" required />
<span>
              Ik ga akkoord met&nbsp;
<a href="#" target="_blank" rel="noopener noreferrer">privacybeleid</a>
</span>
</label>
<button type="submit" className="btn register-green">Account maken</button>
</form>
</main>
 
      {/* FOOTER */}
<footer className="footer">
<div className="footer-row">
          {/* Links: Logo + mail */}
<div className="footer-col left">
<div className="footer-logo-box">
<div className="footer-logo">LOGO</div>
</div>
<div className="footer-mail">
              E-mailadres: pp-test@ehb.be<br />
              +32 494 77 08 550
</div>
</div>
          {/* Midden: Menu */}
<div className="footer-col middle">
<ul className="footer-menu">
<li>Home</li>
<li>Inschrijving</li>
<li>Contact</li>
<li>Login</li>
</ul>
</div>
          {/* Rechts: Socials */}
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