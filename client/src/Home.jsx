import React from "react";
import "./Home.css";

export default function Home() {
  return (
    <div>
      {/* NAVIGATIEBALK */}
      <nav className="navbar">
        <div className="navbar-logo">
          <span className="navbar-title">Careerlaunch</span>
         </div>
        <ul className="navbar-links">
          <li><a href="#">Home</a></li>
          <li><a href="#">Companies</a></li>
          <li><a href="#">Students</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Contact</a></li>
          <li>
            <button className="navbar-btn register">Register</button>
          </li>
          <li>
            <button className="navbar-btn login">Login</button>
          </li>
        </ul>
      </nav>

      {/* HERO SECTION */}
      <header className="hero">
        <div className="hero-content">
          <h1>Connect met de toekomst van tech</h1>
          <p>
            SpeedConnect Expo is hét event waar studenten en bedrijven elkaar ontmoeten! Registreer je nu om kansen te ontdekken, te netwerken en je carrière een boost te geven.
          </p>
          <div className="hero-btns">
            <button className="btn primary">Registreer als bedrijf</button>
            <button className="btn secondary">Registreer als student</button>
          </div>
        </div>
        <div className="hero-img" />
      </header>

      {/* INFO CARDS SECTION */}
      <section className="info-section">
        <h2>Waarom deelnemen?</h2>
        <div className="cards">
          <div className="card">
            <h3>Voor Bedrijven</h3>
            <p>Ontmoet getalenteerde studenten, vind stagiairs en bouw aan je employer brand.</p>
          </div>
          <div className="card">
            <h3>Voor Studenten</h3>
            <p>Vind stages, maak kennis met bedrijven en ontdek carrièremogelijkheden.</p>
          </div>
          <div className="card">
            <h3>Netwerkmomenten</h3>
            <p>Praat met recruiters, netwerk met andere studenten en vergroot je kansen!</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
  <div className="footer-row">
    {/* Links: Logo + mail */}
    <div className="footer-col left">
      <div className="footer-logo-box">
        
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
        <span className="icon">🐱</span>
        <span className="icon">🔗</span>
        <span className="icon">📘</span>
        <span className="icon">📸</span>
        <span className="icon">❌</span>
        <span className="icon">🎵</span>
      </div>
    </div>
  </div>
</footer>

    </div>
  );
}