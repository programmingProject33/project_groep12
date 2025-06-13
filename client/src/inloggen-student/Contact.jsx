import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Contact.css";
import { FaLinkedin, FaInstagram, FaTiktok } from "react-icons/fa6";

export default function Contact() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="contact-page">
      <main className="contact-main">
        <h1>Contact</h1>
        <p>Heb je vragen? Neem gerust contact op met het Careerlaunch team!</p>
        <div className="contact-info">
          <p><b>Email:</b> support-careerlaunch@ehb.be</p>
          <p><b>Telefoon:</b> +32 494 77 08 550</p>
          <p><b>Adres:</b> Nijverheidskaai 170, 1070 Anderlecht</p>
        </div>
        <form className="contact-form">
          <label>
            Naam:
            <input type="text" required />
          </label>
          <label>
            E-mail:
            <input type="email" required />
          </label>
          <label>
            Bericht:
            <textarea rows={4} required />
          </label>
          <button type="submit">Verzenden</button>
        </form>
      </main>

      {/* Footer */}
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
              <li onClick={() => navigate("/")}>Home</li>
              <li onClick={() => navigate("/bedrijven")}>Bedrijven</li>
              <li onClick={() => navigate("/Reservaties")}>Reservaties</li>
              <li onClick={() => navigate("/contactNavbalk")}>Contact</li>
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
    </div>
  );
}
