import React from "react";
import { useNavigate } from "react-router-dom";
import "./StudentDashboard.css";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
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
              <li onClick={() => navigate("/contactNavbalk")}>Contact</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
} 