import React from "react";
import { useNavigate } from "react-router-dom";
import "./StudentDashboard.css";
import { useAuth } from "../AuthContext.jsx";
import { FaLinkedin, FaInstagram, FaTiktok } from "react-icons/fa6";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const handleLogout = () => {
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="student-dashboard">
      <main className="dashboard-main">
        <h1>Welkom, {user?.voornaam}!</h1>
        <p>
          Dit is jouw persoonlijke Careerlaunch startpagina. Hier vind je alles om je carrière te lanceren:
        </p>
        <div className="dashboard-actions">
          <button onClick={() => navigate("/bedrijven")}>Bekijk bedrijven</button>
          <button onClick={() => navigate("/reservaties")}>Bekijk reservaties</button>
        </div>
        <section className="dashboard-info">
          <h2>Evenementen & Tips</h2>
          <ul>
            <li>Bekijk de nieuwste stageplaatsen en jobs.</li>
            <li>Neem deel aan speeddates en workshops.</li>
            <li>Werk aan je CV en sollicitatievaardigheden.</li>
          </ul>
        </section>
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

          {/* ✅ New right-side social icons */}
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
