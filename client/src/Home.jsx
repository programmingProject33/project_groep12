import React from "react";
import "./Home.css";
import { FaLinkedin, FaInstagram, FaXTwitter, FaTiktok } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();  // Binnen de component!

  return (
    <div>
      {/* NAVIGATIEBALK */}
      <nav className="navbar">
        <div className="navbar-logo">
          <span className="navbar-title">Careerlaunch</span>
        </div>
        <ul className="navbar-links">
          <li><a href="#">Home</a></li>
          <li><a href="#">Bedrijven</a></li>
          <li onClick={() => navigate("/contactNavbalk")} style={{ cursor: "pointer" }}>Contact</li>
          <li>
            <button className="navbar-btn register">Registreer</button>
          </li>
          <li>
            <button className="navbar-btn login">Login</button>
          </li>
        </ul>
      </nav>

      {/* HERO SECTION */}
      <header className="hero">
        <div className="hero-content">
          <h1>Career Launch '25-'26</h1>
          <p>
            Het evenement Career Launch '24-'25 aan de Erasmus Hogeschool Brussel biedt studenten van de EHB de kans om in contact te komen met bedrijven die op zoek zijn naar stagiairs en werknemers. Het richt zich op studenten van de opleidingen Toegepaste Informatica, Multimedia & Creative Technologies, Programmeren, Systeem- en Netwerkbeheer, en Internet of Things. 
            Tijdens de Career Launch kunnen studenten deelnemen aan groepsessies, speeddates en netwerkmomenten met vertegenwoordigers van diverse bedrijven. Organisaties zoals Accenture, Capgemini, Colruyt Group en vele anderen zijn aanwezig om hun werking toe te lichten en potentiële kandidaten te ontmoeten.
            Het doel van dit evenement is om studenten te helpen bij het vinden van stages en jobs, en bedrijven de kans te geven getalenteerde en gemotiveerde studenten te leren kennen.
          </p>
          {/* Knoppen verwijderd */}
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
            <h3>Voor Alumni's</h3>
            <p>Deel je ervaringen, ontmoet topwerkgevers en geef je carrière een nieuwe boost!</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-row">
          <div className="footer-col left">
            <div className="footer-logo-box"></div>
            <div className="footer-mail">
              E-mailadres: support-careerlaunch@ehb.be<br />
              Telefoonnummer: +32 494 77 08 550
            </div>
          </div>
          <div className="footer-col middle">
            <ul className="footer-menu">
              <li>Home</li>
              <li>Registreer</li>
              <li onClick={() => navigate("/contactNavbalk")} style={{ cursor: "pointer" }}>Contact</li>
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
