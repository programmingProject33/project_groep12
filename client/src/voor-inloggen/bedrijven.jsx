import React, { useEffect, useState } from "react";
import "./bedrijven.css";
import { useNavigate } from "react-router-dom";
import { FaLinkedin, FaInstagram, FaTiktok } from "react-icons/fa6";

export default function Bedrijven() {
  const [bedrijven, setBedrijven] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/bedrijven")
      .then((res) => res.json())
      .then((data) => setBedrijven(data))
      .catch((error) => console.error("Error fetching bedrijven:", error));
  }, []);

  return (
    <div className="bedrijven-container">
      <div className="bedrijven-header">
        <h1>Onze Partner Bedrijven</h1>
        <p>Ontdek de bedrijven die samenwerken met onze stageplaatsen</p>
      </div>
      
      <div className="bedrijven-grid">
        {bedrijven.length === 0 ? (
          <p>Geen bedrijven gevonden.</p>
        ) : (
          bedrijven.map((bedrijf) => (
            <div className="bedrijf-card" key={bedrijf.bedrijf_id}>
              <h2 className="bedrijf-naam">
                <a
                  href={
                    bedrijf.bedrijf_URL.startsWith("http")
                      ? bedrijf.bedrijf_URL
                      : `https://${bedrijf.bedrijf_URL}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {bedrijf.naam}
                </a>
              </h2>
              <div className="bedrijf-info">
                <p><strong>BTW-nummer:</strong> {bedrijf.BTW_nr}</p>
                <p>
                  <strong>Adres:</strong> {bedrijf.straatnaam} {bedrijf.huis_nr}
                  {bedrijf.bus_nr && ` bus ${bedrijf.bus_nr}`}, {bedrijf.postcode} {bedrijf.gemeente}
                </p>
                <p><strong>Telefoon:</strong> {bedrijf.telefoon_nr}</p>
                <p>
                  <strong>Email:</strong>{" "}
                  <a href={`mailto:${bedrijf.email}`}>{bedrijf.email}</a>
                </p>
                <p>
                  <strong>Website:</strong>{" "}
                  <a
                    href={
                      bedrijf.bedrijf_URL.startsWith("http")
                        ? bedrijf.bedrijf_URL
                        : `https://${bedrijf.bedrijf_URL}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {bedrijf.bedrijf_URL}
                  </a>
                </p>
              </div>
              <button
                className="reserveer-btn"
                onClick={() => navigate(`/speeddate/${bedrijf.bedrijf_id}`)}
              >
                Reserveer speeddate
              </button>
            </div>
          ))
        )}
      </div>

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
              <li onClick={() => navigate("/")} style={{ cursor: "pointer" }}>Home</li>
              <li onClick={() => navigate("/registreer")} style={{ cursor: "pointer" }}>Registreer</li>
              <li onClick={() => navigate("/contactNavbalk")} style={{ cursor: "pointer" }}>Contact</li>
              <li onClick={() => navigate("/login")} style={{ cursor: "pointer" }}>Login</li>
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
