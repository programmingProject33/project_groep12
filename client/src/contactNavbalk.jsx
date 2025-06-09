import React from "react";
import "./contactNavbalk.css";
import { FaLinkedin, FaInstagram, FaXTwitter, FaTiktok } from "react-icons/fa6";

export default function Contact() {
  return (
    <div>
      {/* navigatiebalk */}
      <nav className="navbar">
        <div className="navbar-logo">
          <span className="navbar-title">Careerlaunch</span>
        </div>
        <ul className="navbar-links">
          <li><a href="/">Home</a></li>
          <li><a href="#">Bedrijven</a></li>
          <li><a href="#">Contact</a></li>
          <li><button className="navbar-btn register">Registreer</button></li>
          <li><button className="navbar-btn login">Login</button></li>
        </ul>
      </nav>

      {/* body van contact */}
      <main className="contact-container">
        <h1>Contact Us</h1>
        <p className="subtitle">
          We helpen je graag! Neem contact met ons op als je vragen of opmerkingen hebt.
        </p>
        <section className="contact-info">
          <h2>Contact Informaties</h2>
          <div className="contact-table">
            <div>
              <span>Email</span>
              <span>support-careerlaunch@ehb.be</span>
            </div>
            <div>
              <span>Telefoonnummer</span>
              <span>+32 494 77 08 550</span>
            </div>
            <div>
              <span>Adres</span>
              <span>Nijverheidskaai 170, 1070 Anderlecht. </span>
            </div>
          </div>
        </section>

        <section className="contact-form-section">
          <h2>Send us a Message</h2>
          <form className="contact-form">
            <label>
              Voornaam + Achternaam
              <input type="text" placeholder="Enter your name" required />
            </label>
            <label>
              E-mail
              <input type="email" placeholder="Enter your email" required />
            </label>
            <label>
              Onderwerp
              <input type="text" placeholder="Enter the subject" required />
            </label>
            <label>
              Message
              <textarea placeholder="Enter your message" rows="5" required />
            </label>
            <button type="submit" className="contact-btn">Verzenden</button>
          </form>
        </section>
      </main>

      {/* footer */}
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
              <li><a href="/">Home</a></li>
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
